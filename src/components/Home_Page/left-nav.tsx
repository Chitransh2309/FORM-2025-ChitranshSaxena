function LeftNav() {
  return (
    <aside className="w-[20%] bg-green-600 text-black p-4 flex flex-col gap-6">
      <h1 className="text-xl font-bold">F.O.R.M</h1>
      <nav className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Search"
          className="p-2 rounded bg-white text-black"
        />
        <span>Shared with me</span>
        <span>Drafts</span>
        <span>Starred</span>
        <span>Trash</span>
      </nav>
    </aside>
  );
}

export default LeftNav;
