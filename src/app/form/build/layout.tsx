export default function BuildLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-neutral-100 text-black w-screen h-[92vh] flex">
      <div className="w-full h-full overflow-auto">
        {children}
      </div>
    </div>
  );
}
