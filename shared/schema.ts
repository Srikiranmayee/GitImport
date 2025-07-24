import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  avatar: text("avatar"),
  googleId: text("google_id").notNull().unique(),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  name: text("name").notNull(),
  githubUrl: text("github_url").notNull(),
  replitUrl: text("replit_url"),
  status: text("status", { enum: ["pending", "cloning", "setting_up", "ready", "failed"] }).notNull().default("pending"),
  includeHistory: boolean("include_history").default(true),
  installDependencies: boolean("install_dependencies").default(true),
  createReplit: boolean("create_replit").default(false),
  errorMessage: text("error_message"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  email: true,
  name: true,
  avatar: true,
  googleId: true,
  accessToken: true,
  refreshToken: true,
});

export const insertProjectSchema = createInsertSchema(projects).pick({
  userId: true,
  name: true,
  githubUrl: true,
  includeHistory: true,
  installDependencies: true,
  createReplit: true,
});

export const updateProjectSchema = createInsertSchema(projects).pick({
  status: true,
  replitUrl: true,
  errorMessage: true,
}).partial();

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type UpdateProject = z.infer<typeof updateProjectSchema>;
export type Project = typeof projects.$inferSelect;
