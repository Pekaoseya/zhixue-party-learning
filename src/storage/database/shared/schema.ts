import { pgTable, serial, timestamp, varchar, boolean, jsonb, index, integer } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

// 用户表
export const users = pgTable(
  "users",
  {
    id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
    username: varchar("username", { length: 50 }).notNull().unique(),
    password: varchar("password", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }),
    display_name: varchar("display_name", { length: 100 }),
    avatar_url: varchar("avatar_url", { length: 500 }),
    is_active: boolean("is_active").default(true).notNull(),
    last_login: timestamp("last_login", { withTimezone: true }),
    created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updated_at: timestamp("updated_at", { withTimezone: true }),
  },
  (table) => [
    index("users_username_idx").on(table.username),
    index("users_email_idx").on(table.email),
  ]
);

// 用户诊断记录表
export const userDiagnostics = pgTable(
  "user_diagnostics",
  {
    id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
    user_id: varchar("user_id", { length: 36 }).notNull().references(() => users.id),
    roles: jsonb("roles").notNull().default(sql`'[]'::jsonb`),
    topics: jsonb("topics").notNull().default(sql`'[]'::jsonb`),
    difficulty: varchar("difficulty", { length: 20 }).notNull().default("beginner"),
    learning_path_id: varchar("learning_path_id", { length: 100 }),
    completed: boolean("completed").default(false).notNull(),
    created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updated_at: timestamp("updated_at", { withTimezone: true }),
  },
  (table) => [
    index("user_diagnostics_user_id_idx").on(table.user_id),
    index("user_diagnostics_created_at_idx").on(table.created_at),
  ]
);

// 用户学习进度表
export const userProgress = pgTable(
  "user_progress",
  {
    id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
    user_id: varchar("user_id", { length: 36 }).notNull().references(() => users.id),
    node_id: varchar("node_id", { length: 100 }).notNull(),
    status: varchar("status", { length: 20 }).notNull().default("available"),
    score: integer("score"),
    completed_at: timestamp("completed_at", { withTimezone: true }),
    created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updated_at: timestamp("updated_at", { withTimezone: true }),
  },
  (table) => [
    index("user_progress_user_id_idx").on(table.user_id),
    index("user_progress_node_id_idx").on(table.node_id),
  ]
);

// 用户收藏表
export const userBookmarks = pgTable(
  "user_bookmarks",
  {
    id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
    user_id: varchar("user_id", { length: 36 }).notNull().references(() => users.id),
    content_id: varchar("content_id", { length: 100 }).notNull(),
    content_type: varchar("content_type", { length: 50 }).notNull(),
    created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("user_bookmarks_user_id_idx").on(table.user_id),
    index("user_bookmarks_content_idx").on(table.content_id),
  ]
);

// 保留健康检查表
export const healthCheck = pgTable("health_check", {
  id: serial().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
});

// 类型导出
export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type UserDiagnostic = typeof userDiagnostics.$inferSelect;
export type InsertUserDiagnostic = typeof userDiagnostics.$inferInsert;
export type UserProgess = typeof userProgress.$inferSelect;
export type InsertUserProgress = typeof userProgress.$inferInsert;
export type UserBookmark = typeof userBookmarks.$inferSelect;
export type InsertUserBookmark = typeof userBookmarks.$inferInsert;
