import SectionSidebar from "./components/SectionSidebar";

export default function HomePage() {
  return (
    <div className="flex">
      <SectionSidebar />
      <main className="flex-1 p-6">{/* Your form builder canvas */}</main>
    </div>
    
  );
}
