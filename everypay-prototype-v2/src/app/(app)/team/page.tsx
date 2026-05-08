"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import type { User } from "@/lib/types";
import { Role } from "@/lib/types";
import type { TeamInvitation } from "@/lib/teamTypes";

const ROLE_COLORS: Record<Role, string> = {
  ADMIN: "bg-red-100 text-red-800",
  APPROVER: "bg-purple-100 text-purple-800",
  OPERATOR: "bg-blue-100 text-blue-800",
} as Record<Role, string>;

const ROLE_LABELS: Record<Role, string> = {
  ADMIN: "Admin",
  APPROVER: "Approver",
  OPERATOR: "Operator",
} as Record<Role, string>;

const TEAM_ROLES: Role[] = [
  Role.OPERATOR,
  Role.APPROVER,
  Role.ADMIN,
];

interface AuditEntry {
  id: string;
  eventType: string;
  actor: string;
  timestamp: string;
  metadata: Record<string, unknown>;
}

export default function TeamPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [users, setUsers] = useState<Array<User & { lastActive?: string }>>([]);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [selectedRoles, setSelectedRoles] = useState<Role[]>([]);
  const [isAdmin] = useState(true); // mock: current user is admin
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [auditLog, setAuditLog] = useState<AuditEntry[]>([]);
  const [showAuditLog, setShowAuditLog] = useState(false);
  const [invitations, setInvitations] = useState<TeamInvitation[]>([]);
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRoles, setInviteRoles] = useState<Role[]>([Role.OPERATOR]);
  const [inviteMessage, setInviteMessage] = useState("");
  const [inviting, setInviting] = useState(false);

  // Mock admin ID - in production this comes from session
  const adminId = searchParams.get("adminId") || "user-1";

  useEffect(() => {
    fetch("/api/users")
      .then((res) => res.json())
      .then((result) => {
        if (result.data) {
          const usersWithLastActive = (result.data as User[]).map(
            (u: User) => ({
              ...u,
              lastActive: new Date(u.updatedAt).toLocaleDateString(),
            })
          );
          setUsers(usersWithLastActive);
        }
      })
      .catch(() => {});

    fetch("/api/audit-log")
      .then((res) => res.json())
      .then((result) => {
        if (result.data) {
          setAuditLog(result.data as AuditEntry[]);
        }
      })
      .catch(() => {});

    fetch("/api/invitations")
      .then((res) => res.json())
      .then((result) => {
        if (result.data) {
          setInvitations(result.data as TeamInvitation[]);
        }
      })
      .catch(() => {});
  }, []);

  const startEditing = useCallback((user: User) => {
    setEditingUserId(user.id);
    setSelectedRoles([...user.roles]);
    setError(null);
    setSuccess(null);
  }, []);

  const cancelEditing = useCallback(() => {
    setEditingUserId(null);
    setSelectedRoles([]);
    setError(null);
  }, []);

  const toggleRole = useCallback((role: Role) => {
    setSelectedRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    );
  }, []);

  const saveRoles = useCallback(
    async (targetUserId: string) => {
      if (selectedRoles.length === 0) {
        setError("User must have at least one role");
        return;
      }

      setSaving(true);
      setError(null);
      setSuccess(null);

      try {
        const response = await fetch("/api/roles", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            adminId,
            targetUserId,
            newRoles: selectedRoles,
          }),
        });

        const result = await response.json();

        if (result.status === "success") {
          setUsers((prev) =>
            prev.map((u) =>
              u.id === targetUserId ? { ...u, roles: selectedRoles } : u
            )
          );
          setSuccess("Roles updated successfully");
          setEditingUserId(null);
          setSelectedRoles([]);

          // Refresh audit log
          fetch("/api/audit-log")
            .then((res) => res.json())
            .then((r) => {
              if (r.data) setAuditLog(r.data as AuditEntry[]);
            })
            .catch(() => {});
        } else {
          setError(result.error || "Failed to update roles");
        }
      } catch {
        setError("A network error occurred. Please try again.");
      } finally {
        setSaving(false);
      }
    },
    [selectedRoles, adminId]
  );

  const sendInvitation = async () => {
    if (!inviteEmail.trim()) {
      setError("Email is required");
      return;
    }
    if (inviteRoles.length === 0) {
      setError("At least one role must be assigned");
      return;
    }

    setInviting(true);
    setError(null);

    try {
      const response = await fetch("/api/invitations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: inviteEmail.trim(),
          roles: inviteRoles,
          invitedBy: adminId,
          organizationId: "org-alpha", // mock
          personalMessage: inviteMessage || undefined,
        }),
      });

      const result = await response.json();
      if (result.status === "success") {
        setInvitations((prev) => [...prev, result.data as TeamInvitation]);
        setSuccess(`Invitation sent to ${inviteEmail}`);
        setInviteEmail("");
        setInviteRoles([Role.OPERATOR]);
        setInviteMessage("");
        setShowInviteForm(false);
      } else {
        setError(result.error || "Failed to send invitation");
      }
    } catch {
      setError("A network error occurred. Please try again.");
    } finally {
      setInviting(false);
    }
  };

  const cancelInvitation = async (invitationId: string) => {
    try {
      const response = await fetch("/api/invitations", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invitationId, action: "cancel" }),
      });

      const result = await response.json();
      if (result.status === "success") {
        setInvitations((prev) =>
          prev.map((i) =>
            i.id === invitationId ? { ...result.data, status: "CANCELLED" } : i
          )
        );
        setSuccess("Invitation cancelled");
      }
    } catch {
      setError("Failed to cancel invitation");
    }
  };

  const removeUser = async (userId: string, userName: string) => {
    if (!confirm(`Are you sure you want to remove ${userName} from the organization?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: "DELETE",
      });

      const result = await response.json();
      if (result.status === "success") {
        setUsers((prev) => prev.filter((u) => u.id !== userId));
        setSuccess(`${userName} has been removed`);
      } else {
        setError(result.error || "Failed to remove user");
      }
    } catch {
      setError("A network error occurred. Please try again.");
    }
  };

  return (
    <div className="p-4 lg:p-6">
      {/* Toolbar */}
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setShowAuditLog(!showAuditLog)}
          className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          Audit Log
        </button>
      </div>

      {/* Messages */}
        {success && (
          <div className="mb-4 rounded-md bg-green-50 p-4 border border-green-200">
            <p className="text-sm text-green-700">{success}</p>
          </div>
        )}

        {showAuditLog && (
          <div className="mb-8 bg-white rounded-lg shadow border border-gray-200">
            <div className="px-4 py-3 border-b border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900">Audit Log</h3>
            </div>
            <div className="divide-y divide-gray-200">
              {auditLog.length === 0 ? (
                <p className="px-4 py-3 text-sm text-gray-500">No audit entries yet.</p>
              ) : (
                auditLog.map((entry) => (
                  <div key={entry.id} className="px-4 py-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-sm font-medium text-gray-900">{entry.eventType}</span>
                        <p className="text-xs text-gray-500">
                          Actor: {entry.actor} | {new Date(entry.timestamp).toLocaleString()}
                        </p>
                      </div>
                      <div className="text-xs text-gray-500">
                        Target: {(entry.metadata as { targetUserId?: string }).targetUserId}
                        <br />
                        Previous: {(entry.metadata as { previousRoles?: string[] }).previousRoles?.join(", ") || "none"}
                        <br />
                        New: {(entry.metadata as { newRoles?: string[] }).newRoles?.join(", ") || "none"}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Invite Member Button + Users Table */}
        <div className="bg-white rounded-lg shadow border border-gray-200">
          <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900">Organization Members</h3>
            <button
              onClick={() => setShowInviteForm(!showInviteForm)}
              className="inline-flex items-center px-3 py-1.5 border border-everypay-300 rounded-md text-sm font-medium text-everypay-700 bg-everypay-50 hover:bg-everypay-100"
            >
              <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Invite Member
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sign Key
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    KYC Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Roles
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Active
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>

              {/* Invite Form */}
              {showInviteForm && (
                <thead>
                  <tr className="bg-everypay-50">
                    <td colSpan={6} className="px-4 py-4">
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Email Address</label>
                          <input
                            type="email"
                            value={inviteEmail}
                            onChange={(e) => setInviteEmail(e.target.value)}
                            placeholder="colleague@company.com"
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-everypay-500 focus:outline-none focus:ring-everypay-500 sm:text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Assign Role</label>
                          <div className="mt-1 flex flex-wrap gap-2">
                            {TEAM_ROLES.map((role) => (
                              <button
                                key={role}
                                type="button"
                                onClick={() => setInviteRoles(inviteRoles.includes(role) ? inviteRoles.filter((r) => r !== role) : [...inviteRoles, role])}
                                className={`px-2 py-1 rounded-full text-xs font-medium border ${
                                  inviteRoles.includes(role)
                                    ? ROLE_COLORS[role]
                                    : "bg-white text-gray-400 border-gray-200"
                                }`}
                              >
                                {ROLE_LABELS[role]}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Personal Message (optional)</label>
                          <textarea
                            value={inviteMessage}
                            onChange={(e) => setInviteMessage(e.target.value)}
                            rows={2}
                            placeholder="Welcome to the team..."
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-everypay-500 focus:outline-none focus:ring-everypay-500 sm:text-sm"
                          />
                        </div>
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => { setShowInviteForm(false); setError(null); }}
                            className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-gray-900"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={sendInvitation}
                            disabled={inviting}
                            className="px-3 py-1.5 text-sm font-medium text-white bg-everypay-600 rounded-md hover:bg-everypay-700 disabled:opacity-50"
                          >
                            {inviting ? "Sending..." : "Send Invitation"}
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                </thead>
              )}

              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id} className={editingUserId === user.id ? "bg-everypay-50" : ""}>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-everypay-100 flex items-center justify-center text-everypay-700 font-medium text-sm">
                          {user.firstName[0]}{user.lastName[0]}
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">
                            {user.firstName} {user.lastName}
                          </div>
                          <div className="text-xs text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {user.walletAddress ? (
                        <span className="text-xs font-mono text-everypay-600 bg-everypay-50 px-2 py-1 rounded">{user.walletAddress}</span>
                      ) : (
                        <span className="text-xs text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          user.kycStatus === "VERIFIED"
                            ? "bg-green-100 text-green-800"
                            : user.kycStatus === "PENDING"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {user.kycStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {editingUserId === user.id ? (
                        <div className="flex flex-wrap gap-1">
                          {TEAM_ROLES.map((role) => (
                            <button
                              key={role}
                              onClick={() => toggleRole(role)}
                              className={`px-2 py-0.5 rounded-full text-xs font-medium border ${
                                selectedRoles.includes(role)
                                  ? ROLE_COLORS[role]
                                  : "bg-white text-gray-400 border-gray-200"
                              }`}
                            >
                              {ROLE_LABELS[role]}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-1">
                          {user.roles.map((role) => (
                            <span
                              key={role}
                              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                ROLE_COLORS[role] || "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {ROLE_LABELS[role] || role}
                            </span>
                          ))}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {user.lastActive}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                      {editingUserId === user.id ? (
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => saveRoles(user.id)}
                            disabled={saving}
                            className="text-everypay-600 hover:text-everypay-900 disabled:opacity-50"
                          >
                            {saving ? "Saving..." : "Save"}
                          </button>
                          <button
                            onClick={cancelEditing}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex justify-end space-x-3">
                          <button
                            onClick={() => startEditing(user)}
                            disabled={!isAdmin}
                            className="text-everypay-600 hover:text-everypay-900 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Edit Roles
                          </button>
                          <button
                            onClick={() => removeUser(user.id, `${user.firstName} ${user.lastName}`)}
                            disabled={!isAdmin}
                            className="text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Remove
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pending Invitations */}
        {invitations.filter((i) => i.status === "PENDING").length > 0 && (
          <div className="mt-6 bg-white rounded-lg shadow border border-gray-200">
            <div className="px-4 py-3 border-b border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900">Pending Invitations</h3>
            </div>
            <div className="divide-y divide-gray-200">
              {invitations
                .filter((i) => i.status === "PENDING")
                .map((inv) => (
                  <div key={inv.id} className="px-4 py-3 flex items-center justify-between">
                    <div>
                      <span className="text-sm font-medium text-gray-900">{inv.email}</span>
                      <p className="text-xs text-gray-500">
                        Invited by {inv.invitedBy} | Expires: {new Date(inv.expiresAt).toLocaleDateString()}
                      </p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {inv.roles.map((r) => (
                          <span
                            key={r}
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                              ROLE_COLORS[r as Role] || "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {ROLE_LABELS[r as Role] || r}
                          </span>
                        ))}
                      </div>
                    </div>
                    <button
                      onClick={() => cancelInvitation(inv.id)}
                      className="text-sm text-red-600 hover:text-red-900"
                    >
                      Revoke
                    </button>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mt-4 rounded-md bg-red-50 p-4 border border-red-200">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Permissions Note */}
        <div className="mt-6 rounded-md bg-blue-50 p-4 border border-blue-200">
          <div className="flex">
            <svg className="h-5 w-5 text-blue-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <div className="ml-3">
              <h4 className="text-sm font-medium text-blue-800">Role Permissions</h4>
              <div className="mt-2 text-sm text-blue-700">
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong>Operator:</strong> Create trades, initiate payments, manage settlements</li>
                  <li><strong>Approver:</strong> Approve/reject financial decisions and payment releases</li>
                  <li><strong>Admin:</strong> Full access including team management and role assignment</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
    </div>
  );
}
