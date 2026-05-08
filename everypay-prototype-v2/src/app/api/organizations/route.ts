import { NextResponse } from "next/server";
import { readSeed, withMockError } from "../helpers";

export async function GET() {
  return withMockError(() => {
    const orgs = readSeed<Array<{ id: string; name: string; kybStatus: string }>>("organizations.json");
    const simplified = orgs.map((o) => ({ id: o.id, name: o.name, kybStatus: o.kybStatus }));
    return NextResponse.json({ data: simplified, status: "success" });
  });
}
