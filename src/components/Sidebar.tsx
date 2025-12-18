export default function Sidebar({ contacts, selectedUser, onSelect }) {
  return (
    <aside className="w-64 border-r bg-white h-full flex flex-col">
      <h2 className="font-semibold mb-4">Contacts</h2>

      {contacts.map(u => (
        <div
          key={u.id ?? u._id}
          onClick={() => onSelect(u)}
          className={`p-2 rounded cursor-pointer mb-1
            ${selectedUser?.id === u.id
              ? "bg-blue-100"
              : "hover:bg-gray-100"}`}
        >
          {u.name}
        </div>
      ))}
    </aside>
  );
}
