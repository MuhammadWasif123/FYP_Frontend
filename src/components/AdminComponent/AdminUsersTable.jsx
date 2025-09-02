
const fmt = (d) => (d ? new Date(d).toLocaleString() : "-");

const AdminUsersTable = ({ users = [],onDeleteUser }) => {
  if (!users || users.length === 0) {
    return (
      <div className="text-center text-gray-600 py-8">No users found.</div>
    );
  }

  return (
    <>
    <div className="pt-6">
        <h1 className="text-center text-2xl">All Registered Users for Admin</h1>
    <div className="overflow-x-auto border rounded-lg mt-6">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="text-left p-3">ID</th>
            <th className="text-left p-3">Name</th>
            <th className="text-left p-3">Email</th>
            <th className="text-left p-3">Role</th>
            <th className="text-left p-3">Registered At</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr
              key={u.id}
              className="border-t hover:bg-gray-50"
            >
              <td className="p-3">{u.id}</td>
              <td className="p-3">{u.name}</td>
              <td className="p-3">{u.email}</td>
              <td className="p-3">{u.role}</td>
              <td className="p-3">{fmt(u.createdAt)}</td>
              <td className="p-3">
                <button
                  onClick={() => onDeleteUser?.(u.id)}
                  className="px-3 py-1 bg-[#2b303a] text-white rounded cursor-pointer hover:bg-red-700"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </div>
    </>
  );
};

export default AdminUsersTable;
