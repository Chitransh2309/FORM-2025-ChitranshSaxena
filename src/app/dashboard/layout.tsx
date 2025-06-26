// src/app/dashboard/layout.tsx
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-screen w-full">{children}</div>;
}
