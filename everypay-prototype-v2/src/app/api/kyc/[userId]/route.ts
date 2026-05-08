import { NextRequest, NextResponse } from "next/server";
import { readSeed, writeSeed, withMockError } from "../../helpers";
import type { KycSubmission, KYCDocument } from "@/lib/kycTypes";
import { KYCStatus } from "@/lib/types";

export async function GET(
  _request: NextRequest,
  { params }: { params: { userId: string } }
) {
  return withMockError(() => {
    const submissions = readSeed<Array<KycSubmission>>("kyc_submissions.json");
    const submission = submissions.find(
      (s: KycSubmission) => s.userId === params.userId
    );

    return NextResponse.json({
      data: submission || null,
      status: "success",
    });
  });
}

export async function POST(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  const body = (await request.json()) as {
    step: string;
    data: Record<string, unknown>;
  };

  return withMockError(() => {
    const users = readSeed<Array<{ id: string; kycStatus: string }>>("users.json");
    const user = users.find((u: { id: string }) => u.id === params.userId);

    if (!user) {
      return NextResponse.json(
        { data: null, status: "error", error: "User not found" },
        { status: 404 }
      );
    }

    const submissions = readSeed<Array<KycSubmission>>("kyc_submissions.json");
    let submission = submissions.find(
      (s: KycSubmission) => s.userId === params.userId
    );

    const now = new Date().toISOString();

    if (!submission) {
      submission = {
        id: `kyc-${Date.now()}`,
        userId: params.userId,
        idDocument: null,
        livenessCheck: null,
        addressVerification: null,
        sanctionsScreening: "pending",
        submittedAt: now,
        completedAt: null,
      };
      submissions.push(submission);
    }

    // Process step
    if (body.step === "id_document") {
      const data = body.data as {
        type: string;
        documentNumber: string;
        nationality: string;
        expiryDate: string;
      };
      submission.idDocument = {
        id: `doc-${Date.now()}`,
        userId: params.userId,
        type: data.type as KYCDocument["type"],
        documentUrl: `/mock/${data.type}-${params.userId}.pdf`,
        documentNumber: data.documentNumber,
        nationality: data.nationality,
        expiryDate: data.expiryDate,
        submittedAt: now,
      };
      // Update user KYC status to documents under review
      user.kycStatus = KYCStatus.DOCUMENTS_UNDER_REVIEW;
      writeSeed("users.json", users);
    } else if (body.step === "liveness") {
      submission.livenessCheck = {
        id: `live-${Date.now()}`,
        userId: params.userId,
        selfieUrl: `/mock/selfie-${params.userId}.jpg`,
        result: "passed", // mock: always passes
        failureReason: null,
        checkedAt: now,
      };
    } else if (body.step === "address") {
      const data = body.data as {
        addressLine1: string;
        addressLine2: string;
        city: string;
        state: string;
        country: string;
        postalCode: string;
      };
      submission.addressVerification = {
        id: `addr-${Date.now()}`,
        userId: params.userId,
        addressLine1: data.addressLine1,
        addressLine2: data.addressLine2,
        city: data.city,
        state: data.state,
        country: data.country,
        postalCode: data.postalCode,
        proofDocumentUrl: `/mock/address-proof-${params.userId}.pdf`,
        submittedAt: now,
      };
    }

    // Check if all steps complete
    if (
      submission.idDocument &&
      submission.livenessCheck &&
      submission.addressVerification
    ) {
      submission.sanctionsScreening = "passed"; // mock: auto-pass
      submission.completedAt = now;
      user.kycStatus = KYCStatus.VERIFIED;
      writeSeed("users.json", users);
    }

    writeSeed("kyc_submissions.json", submissions);

    return NextResponse.json({ data: submission, status: "success" });
  });
}
