// EmptyState - shows when no items present. Non-invasive.
export default function EmptyState({ visible }) {
  if (!visible) return null;
  return (
    <tr>
      <td colSpan={5} style={{ textAlign: "center", padding: 16 }}>
        No files or folders to display.
      </td>
    </tr>
  );
}
