import { NextRequest, NextResponse } from "next/server";
import { readSeed, writeSeed, withMockError } from "../../helpers";
import type { KybSubmission } from "@/lib/kybTypes";
import type { BeneficialOwner } from "@/lib/types";
import { KYBStatus } from "@/lib/types";

export async function GET(
  _request: NextRequest,
  { params }: { params: { userId: string } }
) {
  return withMockError(() => {
    const submissions = readSeed<Array<KybSubmission>>("kyb_submissions.json");
    const submission = submissions.find(
      (s: KybSubmission) => s.userId === params.userId
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
    const users = readSeed<Array<{ id: string; organizationId: string | null }>>(
      "users.json"
    );
    const user = users.find((u: { id: string }) => u.id === params.userId);

    if (!user || !user.organizationId) {
      return NextResponse.json(
        { data: null, status: "error", error: "User or organization not found" },
        { status: 404 }
      );
    }

    const submissions = readSeed<Array<KybSubmission>>("kyb_submissions.json");
    let submission = submissions.find(
      (s: KybSubmission) => s.userId === params.userId
    );

    const now = new Date().toISOString();

    if (!submission) {
      submission = {
        id: `kyb-${Date.now()}`,
        userId: params.userId,
        businessDetails: null,
        authorizedSignatories: [],
        beneficialOwners: [],
        businessActivity: null,
        status: "pending",
        submittedAt: now,
        completedAt: null,
      };
      submissions.push(submission);
    }

    // Process step
    if (body.step === "business_details") {
      const data = body.data as {
        companyName: string;
        registrationNumber: string;
        incorporationDate: string;
        incorporationCountry: string;
        businessType: string;
        registeredAddress: string;
        taxId: string;
      };
      submission.businessDetails = {
        companyName: data.companyName,
        registrationNumber: data.registrationNumber,
        incorporationDate: data.incorporationDate,
        incorporationCountry: data.incorporationCountry,
        businessType: data.businessType,
        registeredAddress: data.registeredAddress,
        taxId: data.taxId,
        documentUrl: `/mock/certificate-${user.organizationId}.pdf`,
        submittedAt: now,
      };
    } else if (body.step === "signatories") {
      const data = body.data as { signatories: string[] };
      submission.authorizedSignatories = data.signatories;
    } else if (body.step === "beneficial_owners") {
      const data = body.data as {
        owners: Array<{
          fullName: string;
          nationality: string;
          ownershipPercentage: number;
          idDocumentType: string;
          idDocumentNumber: string;
          dateOfBirth: string;
          residentialAddress: string;
        }>;
      };
      submission.beneficialOwners = data.owners.map((owner) => ({
        id: `bo-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        fullName: owner.fullName,
        nationality: owner.nationality,
        ownershipPercentage: owner.ownershipPercentage,
        idDocumentType: owner.idDocumentType,
        idDocumentNumber: owner.idDocumentNumber,
        dateOfBirth: owner.dateOfBirth,
        residentialAddress: owner.residentialAddress,
        sanctionsScreening: "passed" as const, // mock: auto-pass
      }));
    } else if (body.step === "business_activity") {
      const data = body.data as {
        primaryActivity: string;
        industrySector: string;
        expectedMonthlyVolume: string;
        primaryCorridor: string;
        settlementCurrency: string;
      };
      submission.businessActivity = {
        primaryActivity: data.primaryActivity,
        industrySector: data.industrySector,
        expectedMonthlyVolume: data.expectedMonthlyVolume,
        primaryCorridor: data.primaryCorridor,
        settlementCurrency: data.settlementCurrency,
        supportingDocumentUrl: `/mock/business-activity-${user.organizationId}.pdf`,
        submittedAt: now,
      };
    }

    // Check if all steps complete
    if (
      submission.businessDetails &&
      submission.authorizedSignatories.length > 0 &&
      submission.beneficialOwners.length > 0 &&
      submission.businessActivity
    ) {
      submission.status = "verified";
      submission.completedAt = now;

      // Update organization KYB status
      const organizations = readSeed<
        Array<{ id: string; kybStatus: string; beneficialOwners: BeneficialOwner[]; businessActivity?: string }>
      >("organizations.json");
      const org = organizations.find(
        (o: { id: string }) => o.id === user.organizationId
      );
      if (org) {
        org.kybStatus = KYBStatus.VERIFIED;
        org.beneficialOwners = submission.beneficialOwners.map((bo) => ({
          id: bo.id,
          fullName: bo.fullName,
          ownershipPercentage: bo.ownershipPercentage,
          nationality: bo.nationality,
          idDocumentType: bo.idDocumentType,
          idDocumentNumber: bo.idDocumentNumber,
        }));
        org.businessActivity = submission.businessActivity.primaryActivity;
        writeSeed("organizations.json", organizations);
      }
    }

    writeSeed("kyb_submissions.json", submissions);

    return NextResponse.json({ data: submission, status: "success" });
  });
}
