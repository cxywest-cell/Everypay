import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const seedDir = path.join(process.cwd(), "src/seeds");

// Simple in-memory cache to avoid repeated cross-filesystem reads
const cache: Record<string, unknown> = {};

export function readSeed<T>(filename: string): T {
  if (cache[filename]) return cache[filename] as T;

  const filePath = path.join(seedDir, filename);
  const raw = fs.readFileSync(filePath, "utf-8");
  const parsed = JSON.parse(raw) as T;
  cache[filename] = parsed;
  return parsed;
}

export function writeSeed<T>(filename: string, data: T): void {
  cache[filename] = data;
  const filePath = path.join(seedDir, filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
}

export async function withMockError<T>(
  handler: () => NextResponse<{ data: T | null; status: "success" | "error"; error?: string }>
): Promise<NextResponse<{ data: T | null; status: "success" | "error"; error?: string }>> {
  // No artificial delay — removed mockDelay for better dev experience

  const rand = Math.random();
  if (rand < 0.05) {
    throw new Error("Request timeout");
  }
  if (rand < 0.07) {
    return NextResponse.json(
      { data: null, status: "error", error: "Internal server error" },
      { status: 500 }
    );
  }

  return handler();
}
