export default function DeletePopup({
  open,
  title = "Are you sure?",
  message = "This action cannot be undone.",
  onConfirm,
  onCancel,
  username
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[1000] bg-black/60 flex items-center justify-center">
      <div className="w-[360px] max-w-full rounded-lg bg-white shadow-2xl p-5">
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        <p className="mt-2 text-sm text-gray-600">{message}</p>
        <p className="mt-2 text-sm text-gray-700">User : {username}</p>
        <div className="mt-4 flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="h-9 px-4 rounded bg-gray-200 text-gray-800 text-sm font-semibold hover:bg-gray-300"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="h-9 px-4 rounded bg-red-600 text-white text-sm font-semibold hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
