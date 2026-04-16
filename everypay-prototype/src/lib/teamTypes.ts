export interface TeamInvitation {
  id: string;
  organizationId: string;
  email: string;
  invitedBy: string; // user ID
  roles: string[];
  status: "PENDING" | "ACCEPTED" | "EXPIRED" | "CANCELLED";
  inviteCode: string; // unique acceptance link token
  sentAt: string;
  expiresAt: string; // 72 hours from sentAt
  acceptedAt: string | null;
  personalMessage: string | null;
}
