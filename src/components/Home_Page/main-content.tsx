// App.tsx or UserHome.tsx
export default function UserHome() {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-[20%] bg-green-600 text-white p-4 flex flex-col gap-6">
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

      {/* Main Content */}
      <main className="w-[80%] p-6 bg-gradient-to-br from-green-50 to-white text-black">
        {/* Top bar */}
        <div className="flex justify-between items-center mb-4">
          <select className="bg-green-500 text-white px-3 py-1 rounded">
            <option>My Workspace</option>
          </select>

          <div className="flex gap-4 items-center">
            <button className="bg-black text-white px-3 py-1 rounded">
              + New Form
            </button>
            <span className="toggle-switch">🌙/☀️</span>
            <span>❓</span>
            <span>👤</span>
          </div>
        </div>

        {/* Form Sections */}
        <div className="grid grid-cols-2 gap-6">
          {/* Drafts */}
          <div>
            <h2 className="font-semibold mb-2">Drafts</h2>
            <div className="grid grid-cols-2 gap-4 border border-dashed p-4">
              {[1, 2].map((_, i) => (
                <div
                  key={i}
                  className="bg-gray-300 h-32 flex flex-col items-center justify-end gap-2 p-2"
                >
                  <button className="bg-green-600 text-white px-2 py-1 rounded">
                    Edit Form
                  </button>
                  <button className="bg-black text-white px-2 py-1 rounded">
                    Discard Draft
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Published */}
          <div>
            <h2 className="font-semibold mb-2">Published</h2>
            <div className="grid grid-cols-2 gap-4 border border-dashed p-4">
              {[1, 2].map((_, i) => (
                <div
                  key={i}
                  className="bg-gray-300 h-32 flex flex-col items-center justify-end gap-2 p-2"
                >
                  <button className="bg-green-600 text-white px-2 py-1 rounded">
                    Edit Form
                  </button>
                  <button className="bg-black text-white px-2 py-1 rounded">
                    View Response
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
