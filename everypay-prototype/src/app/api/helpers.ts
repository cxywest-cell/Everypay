import { NextResponse } from "next/server";
import { mockDelay } from "@/lib/mockDelay";
import fs from "fs";
import path from "path";

const ERROR_RATE_TIMEOUT = 0.05;
const ERROR_RATE_500 = 0.02;

const seedDir = path.join(process.cwd(), "src/seeds");

export function readSeed<T>(filename: string): T {
  const filePath = path.join(seedDir, filename);
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw) as T;
}

export function writeSeed<T>(filename: string, data: T): void {
  const filePath = path.join(seedDir, filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
}

export async function withMockError<T>(
  handler: () => NextResponse<{ data: T | null; status: "success" | "error"; error?: string }>
): Promise<NextResponse<{ data: T | null; status: "success" | "error"; error?: string }>> {
  await mockDelay();

  const rand = Math.random();
  if (rand < ERROR_RATE_TIMEOUT) {
    throw new Error("Request timeout");
  }
  if (rand < ERROR_RATE_TIMEOUT + ERROR_RATE_500) {
    return NextResponse.json(
      { data: null, status: "error", error: "Internal server error" },
      { status: 500 }
    );
  }

  return handler();
}
