// app/layout.tsx
import "../globals.css";
import LeftNav from "@/components/Home_Page/left-nav";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen font-[Outfit]">
      {/* Sidebar */}
      <LeftNav />

      {/* Main page content */}
      <main className="w-[80%] bg-gradient-to-br from-green-50 to-white text-black">
        {children}
      </main>
    </div>
  );
}
