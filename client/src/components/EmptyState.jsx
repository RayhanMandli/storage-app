// EmptyState - shows when no items present. Non-invasive.
export default function EmptyState({ visible }) {
  if (!visible) return null;
  return (
    <tr>
      <td colSpan={5} className="px-4 py-16">
        <div className="flex flex-col items-center justify-center text-center">
          <svg className="w-12 h-12 text-zinc-700 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
          </svg>
          <p className="text-sm text-zinc-400">No files or folders to display</p>
          <p className="text-xs text-zinc-600 mt-1">Upload files or create a folder to get started</p>
        </div>
      </td>
    </tr>
  );
}
