import { NextRequest, NextResponse } from "next/server";
import { withMockError } from "../../helpers";

export async function GET(
  _request: NextRequest,
  { params }: { params: { settlementId: string } }
) {
  return withMockError(() => {
    const evidencePack = {
      id: `ep-${params.settlementId}`,
      settlementId: params.settlementId,
      documents: [] as Array<{
        id: string;
        type: string;
        url: string;
        uploadedAt: string;
        hash: string;
      }>,
      hash: "sha256-placeholder",
      createdAt: new Date().toISOString(),
      retentionUntil: new Date(
        new Date().setFullYear(new Date().getFullYear() + 7)
      ).toISOString(),
      status: "GENERATED",
    };
    return NextResponse.json({ data: evidencePack, status: "success" });
  });
}
