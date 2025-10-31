import {
  users,
  tasks,
  profiles,
  type User,
  type InsertUser,
  type Task,
  type InsertTask,
  type UpdateTask,
  type Profile,
  type InsertProfile,
  type UpdateProfile,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Profile operations
  getProfile(userId: string): Promise<Profile | undefined>;
  createProfile(userId: string, profile: InsertProfile): Promise<Profile>;
  updateProfile(userId: string, profile: UpdateProfile): Promise<Profile | undefined>;
  
  // Task operations
  getTasks(userId: string): Promise<Task[]>;
  getTask(id: number, userId: string): Promise<Task | undefined>;
  createTask(userId: string, task: InsertTask): Promise<Task>;
  updateTask(id: number, userId: string, task: UpdateTask): Promise<Task | undefined>;
  deleteTask(id: number, userId: string): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(userData: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .returning();
    return user;
  }

  // Profile operations
  async getProfile(userId: string): Promise<Profile | undefined> {
    const [profile] = await db
      .select()
      .from(profiles)
      .where(eq(profiles.userId, userId));
    return profile;
  }

  async createProfile(userId: string, profileData: InsertProfile): Promise<Profile> {
    const [profile] = await db
      .insert(profiles)
      .values({
        userId,
        ...profileData,
      })
      .returning();
    return profile;
  }

  async updateProfile(userId: string, profileData: UpdateProfile): Promise<Profile | undefined> {
    const [profile] = await db
      .update(profiles)
      .set({
        ...profileData,
        updatedAt: new Date(),
      })
      .where(eq(profiles.userId, userId))
      .returning();
    return profile;
  }

  // Task operations
  async getTasks(userId: string): Promise<Task[]> {
    return await db
      .select()
      .from(tasks)
      .where(eq(tasks.userId, userId))
      .orderBy(desc(tasks.createdAt));
  }

  async getTask(id: number, userId: string): Promise<Task | undefined> {
    const [task] = await db
      .select()
      .from(tasks)
      .where(and(eq(tasks.id, id), eq(tasks.userId, userId)));
    return task;
  }

  async createTask(userId: string, taskData: InsertTask): Promise<Task> {
    const [task] = await db
      .insert(tasks)
      .values({
        userId,
        ...taskData,
      })
      .returning();
    return task;
  }

  async updateTask(id: number, userId: string, taskData: UpdateTask): Promise<Task | undefined> {
    const [task] = await db
      .update(tasks)
      .set({
        ...taskData,
        updatedAt: new Date(),
      })
      .where(and(eq(tasks.id, id), eq(tasks.userId, userId)))
      .returning();
    return task;
  }

  async deleteTask(id: number, userId: string): Promise<boolean> {
    const result = await db
      .delete(tasks)
      .where(and(eq(tasks.id, id), eq(tasks.userId, userId)))
      .returning();
    return result.length > 0;
  }
}

export const storage = new DatabaseStorage();
