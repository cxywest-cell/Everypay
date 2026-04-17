"use client";

import { useRouter, useSearchParams } from "next/navigation";

const DEMO_USERS = [
  { id: "user-1", label: "Carlos (Buyer)" },
  { id: "user-2", label: "Wei (Seller)" },
  { id: "user-3", label: "Li (CFO)" },
];

export function DemoUserSwitcher() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const current = searchParams.get("userId") || "user-1";

  const handleChange = (userId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("userId", userId);
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-gray-400 hidden sm:inline">Demo:</span>
      <select
        value={current}
        onChange={(e) => handleChange(e.target.value)}
        className="text-xs rounded-md border border-gray-300 px-2 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-everypay-500"
      >
        {DEMO_USERS.map((u) => (
          <option key={u.id} value={u.id}>{u.label}</option>
        ))}
      </select>
    </div>
  );
}
