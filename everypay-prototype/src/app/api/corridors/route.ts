import { NextRequest, NextResponse } from "next/server";
import { readSeed, withMockError } from "../helpers";

type CorridorConfig = {
  corridor: string;
  complianceRules: string[];
  currencySymbol: string;
  numberFormat: string;
  partnerApiUptime: number;
};

export async function GET(request: NextRequest) {
  return withMockError<CorridorConfig | CorridorConfig[]>(() => {
    const configs = readSeed<CorridorConfig[]>("corridor_configs.json");
    const searchParams = request.nextUrl.searchParams;
    const corridor = searchParams.get("corridor");

    if (corridor) {
      const config = configs.find((c) => c.corridor === corridor);
      return NextResponse.json({ data: config || null, status: "success" });
    }

    return NextResponse.json({ data: configs, status: "success" });
  });
}
