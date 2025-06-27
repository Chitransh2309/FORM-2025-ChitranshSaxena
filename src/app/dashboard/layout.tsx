// src/app/dashboard/layout.tsx
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-gradient-to-r from-green-100/50 via-[#f1f8f5] to-green-100/50  min-h-screen w-full">
      {children}
    </div>
  );
}
