import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertProjectSchema, updateProjectSchema } from "@shared/schema";
import { z } from "zod";

// Extend Express Request to include user
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

// Mock Google token verification (in production, use Google Auth Library)
async function verifyGoogleToken(token: string) {
  // TODO: Replace with actual Google token verification
  // For now, return mock user data
  if (token === "mock_google_token") {
    return {
      sub: "google_user_123",
      email: "user@example.com",
      name: "John Doe",
      picture: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&w=32&h=32&fit=crop&crop=face",
    };
  }
  throw new Error("Invalid token");
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  const requireAuth = async (req: Request, res: Response, next: Function) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const token = authHeader.substring(7);
    try {
      const googleUser = await verifyGoogleToken(token);
      const user = await storage.getUserByGoogleId(googleUser.sub);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }
      req.user = user;
      next();
    } catch (error) {
      return res.status(401).json({ message: "Invalid token" });
    }
  };

  // Auth routes
  app.post("/api/auth/google", async (req: Request, res: Response) => {
    try {
      const { token } = req.body;
      if (!token) {
        return res.status(400).json({ message: "Token required" });
      }

      // Verify Google token
      const googleUser = await verifyGoogleToken(token);
      
      // Check if user exists
      let user = await storage.getUserByGoogleId(googleUser.sub);
      
      if (!user) {
        // Create new user
        const newUserData = insertUserSchema.parse({
          email: googleUser.email,
          name: googleUser.name,
          avatar: googleUser.picture,
          googleId: googleUser.sub,
          accessToken: token,
        });
        user = await storage.createUser(newUserData);
      } else {
        // Update existing user's token
        user = await storage.updateUser(user.id, { accessToken: token });
      }

      res.json({ user, token });
    } catch (error) {
      console.error("Google auth error:", error);
      res.status(400).json({ message: "Authentication failed" });
    }
  });

  app.get("/api/auth/me", requireAuth, async (req: Request, res: Response) => {
    res.json({ user: req.user });
  });

  app.post("/api/auth/logout", requireAuth, async (req: Request, res: Response) => {
    // In a real app, you might invalidate the token
    res.json({ message: "Logged out successfully" });
  });

  // Project routes
  app.get("/api/projects", requireAuth, async (req: Request, res: Response) => {
    try {
      const projects = await storage.getProjectsByUserId(req.user.id);
      res.json(projects);
    } catch (error) {
      console.error("Get projects error:", error);
      res.status(500).json({ message: "Failed to fetch projects" });
    }
  });

  app.post("/api/projects", requireAuth, async (req: Request, res: Response) => {
    try {
      const projectData = insertProjectSchema.parse({
        ...req.body,
        userId: req.user.id,
      });

      // Extract repository name from URL
      const githubUrlMatch = projectData.githubUrl.match(/github\.com\/[\w\-\.]+\/([\w\-\.]+)/);
      if (!githubUrlMatch) {
        return res.status(400).json({ message: "Invalid GitHub URL" });
      }

      const repoName = githubUrlMatch[1].replace(/\.git$/, "");
      const projectWithName = {
        ...projectData,
        name: repoName,
      };

      const project = await storage.createProject(projectWithName);

      // Start import process (simplified simulation)
      setTimeout(async () => {
        await storage.updateProject(project.id, { status: "cloning" });
        setTimeout(async () => {
          await storage.updateProject(project.id, { status: "setting_up" });
          setTimeout(async () => {
            await storage.updateProject(project.id, { 
              status: "ready",
              replitUrl: `https://replit.com/@user/${repoName}`,
            });
          }, 2000);
        }, 2000);
      }, 1000);

      res.json(project);
    } catch (error) {
      console.error("Create project error:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid project data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create project" });
    }
  });

  app.patch("/api/projects/:id", requireAuth, async (req: Request, res: Response) => {
    try {
      const projectId = parseInt(req.params.id);
      const updates = updateProjectSchema.parse(req.body);

      const project = await storage.getProject(projectId);
      if (!project || project.userId !== req.user.id) {
        return res.status(404).json({ message: "Project not found" });
      }

      const updatedProject = await storage.updateProject(projectId, updates);
      res.json(updatedProject);
    } catch (error) {
      console.error("Update project error:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid update data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update project" });
    }
  });

  app.delete("/api/projects/:id", requireAuth, async (req: Request, res: Response) => {
    try {
      const projectId = parseInt(req.params.id);
      
      const project = await storage.getProject(projectId);
      if (!project || project.userId !== req.user.id) {
        return res.status(404).json({ message: "Project not found" });
      }

      const deleted = await storage.deleteProject(projectId);
      if (deleted) {
        res.json({ message: "Project deleted successfully" });
      } else {
        res.status(500).json({ message: "Failed to delete project" });
      }
    } catch (error) {
      console.error("Delete project error:", error);
      res.status(500).json({ message: "Failed to delete project" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
