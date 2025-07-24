import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  avatar: text("avatar"),
  googleId: text("google_id").notNull().unique(),
  role: text("role", { enum: ["donor", "collector"] }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Books schema for book exchange
export const books = pgTable("books", {
  id: serial("id").primaryKey(),
  donorId: integer("donor_id").references(() => users.id).notNull(),
  title: text("title").notNull(),
  author: text("author").notNull(),
  isbn: text("isbn"),
  genre: text("genre").notNull(),
  condition: text("condition", { enum: ["excellent", "good", "fair", "poor"] }).notNull(),
  description: text("description"),
  images: jsonb("images").$type<string[]>().default([]),
  pickupLocation: text("pickup_location").notNull(),
  pickupAddress: text("pickup_address").notNull(),
  isAvailable: boolean("is_available").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Book requests schema
export const bookRequests = pgTable("book_requests", {
  id: serial("id").primaryKey(),
  bookId: integer("book_id").references(() => books.id).notNull(),
  collectorId: integer("collector_id").references(() => users.id).notNull(),
  message: text("message"),
  status: text("status", { enum: ["pending", "approved", "rejected", "completed"] }).notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  respondedAt: timestamp("responded_at"),
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
  role: true,
  accessToken: true,
  refreshToken: true,
});

export const insertBookSchema = createInsertSchema(books).pick({
  donorId: true,
  title: true,
  author: true,
  isbn: true,
  genre: true,
  condition: true,
  description: true,
  images: true,
  pickupLocation: true,
  pickupAddress: true,
});

export const insertBookRequestSchema = createInsertSchema(bookRequests).pick({
  bookId: true,
  collectorId: true,
  message: true,
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
export type InsertBook = z.infer<typeof insertBookSchema>;
export type Book = typeof books.$inferSelect;
export type InsertBookRequest = z.infer<typeof insertBookRequestSchema>;
export type BookRequest = typeof bookRequests.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type UpdateProject = z.infer<typeof updateProjectSchema>;
export type Project = typeof projects.$inferSelect;
