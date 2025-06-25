function Published({ forms = [] }){
    return (
        <div className="flex-1 flex flex-col mx-5 mb-10 min-h-0">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 px-2">Published</h2>
            <div className="flex-1 border-2 border-dashed border-gray-300 overflow-y-auto">
                {forms.length === 0 ? (
                    <div className="flex flex-col justify-center items-center h-full gap-6 px-8 py-7">
                        <h1 className="text-xl font-semibold text-gray-600">All your published forms here!</h1>
                    </div>
                ) : (
                    <div className="p-4 grid grid-cols-2 gap-4">
                        {forms.map((form) => (
                            <div key={form.id} className="bg-gray-200 rounded-lg aspect-square flex flex-col">
                                <div className="flex-1 bg-gray-300 rounded-t-lg"></div>
                                <div className="p-2 flex gap-2">
                                    <button className="bg-[#61A986] text-white px-3 py-1 rounded text-sm">
                                        Edit Form
                                    </button>
                                    <button className="bg-gray-600 text-white px-3 py-1 rounded text-sm">
                                        View Response
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Published 