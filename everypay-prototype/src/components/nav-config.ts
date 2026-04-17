export interface NavItem {
  label: string;
  href: string;
  icon: string;
  roles: ("buyer" | "seller" | "approver")[];
}

export interface NavSection {
  label: string;
  items: NavItem[];
}

export const NAV_SECTIONS: NavSection[] = [
  {
    label: "Overview",
    items: [
      { label: "Dashboard", href: "/", icon: "dashboard", roles: ["buyer", "seller", "approver"] },
    ],
  },
  {
    label: "Procurement",
    items: [
      { label: "Procurement", href: "/procurement", icon: "procurement", roles: ["buyer"] },
      { label: "Templates", href: "/templates", icon: "templates", roles: ["seller"] },
    ],
  },
  {
    label: "Settlements",
    items: [
      { label: "Settlements", href: "/settlements", icon: "settlements", roles: ["buyer", "seller"] },
      { label: "Payment Agreements", href: "/settlements", icon: "agreements", roles: ["buyer", "seller"] },
      { label: "Approvals", href: "/approvals", icon: "approvals", roles: ["approver"] },
    ],
  },
  {
    label: "Ledger",
    items: [
      { label: "Purchase Ledger", href: "/purchase-ledger", icon: "purchaseLedger", roles: ["buyer"] },
      { label: "Sales Ledger", href: "/sales-ledger", icon: "salesLedger", roles: ["seller"] },
      { label: "Counterparties", href: "/counterparties", icon: "counterparties", roles: ["buyer", "seller"] },
    ],
  },
  {
    label: "Compliance",
    items: [
      { label: "Compliance", href: "/compliance", icon: "compliance", roles: ["approver"] },
      { label: "KYC", href: "/kyc", icon: "kyc", roles: ["buyer"] },
      { label: "KYB", href: "/kyb", icon: "kyc", roles: ["seller"] },
      { label: "KYC Tiers", href: "/admin/kyc-tiers", icon: "admin", roles: ["approver"] },
    ],
  },
  {
    label: "Team",
    items: [
      { label: "Team", href: "/team", icon: "team", roles: ["approver"] },
    ],
  },
];
