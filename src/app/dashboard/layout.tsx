// src/app/dashboard/layout.tsx
import { insertUser } from "../action/user";
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await insertUser(); // Ensure user is inserted on layout load
  return (
    <div className="bg-gradient-to-r from-green-100/50 via-[#f1f8f5] to-green-100/50  min-h-screen w-full dark:bg-none dark:bg-[#2B2A2A]">
      {children}
    </div>
  );
}
