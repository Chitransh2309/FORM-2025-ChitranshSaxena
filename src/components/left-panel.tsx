function LeftPanel() {
  return (
    <nav className="flex flex-col bg-[#fefefe] text-black w-1/5 h-screen p-4 box-border font-[Outfit]">
      <div className="text-sm">
        <h4>SECTIONS</h4>
        <div className="border-t-2 border-black my-2"></div>
        <div className="h-80 overflow-y-auto scrollbar-hidden"></div>
      </div>

      <div className="text-sm my-5">
        <h4>ENDINGS</h4>
        <div className="border-t-2 border-black my-2"></div>
        <div className="h-20 overflow-y-auto scrollbar-hidden"></div>
      </div>
      <footer className="fixed-bottom text-xs">UserName</footer>
    </nav>
  );
}

export default LeftPanel;
