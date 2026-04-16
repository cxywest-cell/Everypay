import { NextResponse } from "next/server";
import { readSeed, withMockError } from "../helpers";

export async function GET() {
  return withMockError(() => {
    const auditLogs = readSeed<
      Array<{
        id: string;
        eventType: string;
        settlementId: string | null;
        actor: string;
        timestamp: string;
        hashReference: string;
        metadata: Record<string, unknown>;
      }>
    >("audit_log.json");

    return NextResponse.json({ data: auditLogs, status: "success" });
  });
}
