import { useEffect, useState } from "react";
import api from "../../api/axios.js";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const token = localStorage.getItem("token");
   const currentUser = JSON.parse(localStorage.getItem("user"));

  const fetchUsers = () => {
    api
      .get("admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUsers(res.data));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 🔥 SAVE USER (CREATE / UPDATE)
  const handleSubmit = async (e) => {
    e.preventDefault();

    // ❌ validation
    if (!form.name || !form.email || (!editUser && !form.password)) {
      alert("All fields are required");
      return;
    }

    const payload = {
      ...form,
      role: "admin",
    };

    if (editUser) {
      await api.put(`admin/users/${editUser._id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } else {
      await api.post(`admin/users`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
    }

    setOpen(false);
    setEditUser(null);
    setForm({ name: "", email: "", password: "" });
    fetchUsers();
  };

  const handleDelete = async (user) => {
    if (user.email === currentUser?.email) {
      alert("You cannot delete your own account");
      return;
    }

    if (!confirm("Delete this user?")) return;

    await api.delete(`admin/users/${user._id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    fetchUsers();
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">User Management</h1>

        {/* ADD BUTTON */}
        <button
          onClick={() => setOpen(true)}
          className="bg-black text-white px-5 py-2 rounded-lg"
        >
          + Add User
        </button>
      </div>

      {/* USERS */}
      <div className="space-y-4">
        {users.map((u) => (
          <div
            key={u._id}
            className="bg-white p-5 rounded-xl shadow flex justify-between items-center"
          >
            <div>
              <p className="font-semibold">{u.email}</p>
              <p className="text-sm text-gray-500">{u.role}</p>
            </div>

          <div className="flex gap-3">

  {/* EDIT */}
  <button
    onClick={() => {
      setEditUser(u);
      setForm({
        name: u.name || "",
        email: u.email,
        password: "",
      });
      setOpen(true);
    }}
    className="bg-orange-500 text-white px-4 py-1 rounded-lg text-sm shadow hover:bg-orange-600"
  >
    Edit
  </button>

  {/* DELETE */}
  <button
    onClick={() => handleDelete(u)}
    className={`bg-red-500 text-white px-4 py-1 rounded-lg text-sm shadow hover:bg-orange-600 cursor-pointer ${
      u.email === currentUser?.email
        ? "opacity-40 cursor-not-allowed"
        : ""
    }`}
    disabled={u.email === currentUser?.email}
  >
    Delete
  </button>

</div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {open && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-[350px]">
            <h2 className="text-xl mb-4">
              {editUser ? "Edit User" : "Add User"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                placeholder="Name"
                className="w-full border p-2"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />

              <input
                placeholder="Email"
                className="w-full border p-2"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />

              {!editUser && (
                <input
                  placeholder="Password"
                  type="password"
                  className="w-full border p-2"
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                />
              )}

              <div className="text-sm text-gray-500">
                Role:{" "}
                <span className="font-semibold text-purple-600">Admin</span>
              </div>

              <button className="w-full bg-black text-white py-2">Save</button>
            </form>

            <button
              onClick={() => setOpen(false)}
              className="mt-3 text-sm text-gray-500"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
