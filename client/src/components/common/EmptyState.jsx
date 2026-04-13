export function EmptyState({ title, description, action }) {
  return (
    <div className="glass rounded-2xl p-10 text-center">
      <h3 className="mb-2 text-xl font-semibold">{title}</h3>
      <p className="mx-auto mb-5 max-w-md text-sm text-zinc-400">{description}</p>
      {action}
    </div>
  );
}
