import { NextResponse } from "next/server";
import { readSeed, withMockError } from "../helpers";

export async function GET() {
  return withMockError(() => {
    const counterparties = readSeed("counterparties.json");
    return NextResponse.json({ data: counterparties, status: "success" });
  });
}
