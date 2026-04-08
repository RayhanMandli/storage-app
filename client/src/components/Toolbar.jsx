// Pure presentational toolbar component.
// Receives only UI related props & callbacks. All logic/state lives in parent.
export default function Toolbar({
    nameArray=[],
    idArray=[],
}) {
    
    return (
        <div className="sticky top-0 z-10 flex items-center justify-between gap-3 bg-zinc-900 border-b border-zinc-800 px-6 py-3">
            {/* Breadcrumb */}
            <div className="flex-1 flex items-center gap-2 text-sm text-zinc-400">
                <svg className="w-4 h-4 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
                {nameArray.map((segment, index) => {
                    return (
                        <a key={idArray[index]} href={`/directory/${idArray[index]}`} className="text-zinc-300 font-medium">{index===0 ? "root >":segment+" > "}</a>
                    )
                })}
            </div>

            {/* Right Actions - Minimal */}
            <div className="flex items-center gap-2">
                <button className="p-2 rounded-lg text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </button>
                <button className="p-2 rounded-lg text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                </button>
            </div>
        </div>
    );
}
