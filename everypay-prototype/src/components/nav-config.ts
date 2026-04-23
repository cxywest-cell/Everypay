export interface NavItem {
  label: string;
  href: string;
  icon: string;
  roles: ("buyer" | "seller" | "approver" | "admin")[];
}

export interface NavSection {
  label: string;
  items: NavItem[];
}

export const ALL_ROLES = ["buyer", "seller", "approver", "admin"] as const;

export const NAV_SECTIONS: NavSection[] = [
  {
    label: "Overview",
    items: [
      { label: "Dashboard", href: "/", icon: "dashboard", roles: [...ALL_ROLES] },
    ],
  },
  {
    label: "Trading",
    items: [
      { label: "Activities", href: "/trading", icon: "trading", roles: [...ALL_ROLES] },
    ],
  },
  {
    label: "Settlements",
    items: [
      { label: "Settlements", href: "/settlements", icon: "settlements", roles: [...ALL_ROLES] },
    ],
  },
  {
    label: "Finance",
    items: [
      { label: "Accounting", href: "/accounting", icon: "accounting", roles: [...ALL_ROLES] },
      { label: "Assets", href: "/assets", icon: "assets", roles: [...ALL_ROLES] },
    ],
  },
  {
    label: "Approvals",
    items: [
      { label: "Task Review", href: "/approvals", icon: "approvals", roles: [...ALL_ROLES] },
    ],
  },
  {
    label: "Organization",
    items: [
      { label: "Counterparties", href: "/counterparties", icon: "counterparties", roles: [...ALL_ROLES] },
      { label: "Approval Flow", href: "/approval-flow", icon: "approvalFlow", roles: [...ALL_ROLES] },
      { label: "Team", href: "/team", icon: "team", roles: [...ALL_ROLES] },
    ],
  },
];
