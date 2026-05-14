import { useEffect, useState } from "react";
import api from "../../api/axios.js";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);

  // 🔥 PASSWORD MODAL
  const [passwordOpen, setPasswordOpen] = useState(false);

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    confirmCurrentPassword: "",
    newPassword: "",
  });

  // 🔥 USER FORM
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const token = localStorage.getItem("token");

  const currentUser = JSON.parse(
    localStorage.getItem("user")
  );

  // ================= FETCH USERS =================
  const fetchUsers = () => {
    api
      .get("admin/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {

  // ✅ superadmin sees all
  if (currentUser?.role === "superadmin") {
    setUsers(res.data);
  }

  // ✅ normal admin sees only own account
  else {
    const mine = res.data.filter(
      (u) => u.email === currentUser?.email
    );

    setUsers(mine);
  }
});
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ================= CREATE / UPDATE USER =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.name ||
      !form.email ||
      (!editUser && !form.password)
    ) {
      alert("All fields are required");
      return;
    }

    const payload = {
      ...form,
      role: "admin",
    };

    try {
      if (editUser) {
        await api.put(
          `admin/users/${editUser._id}`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else {
        await api.post(
          `admin/users`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      setOpen(false);

      setEditUser(null);

      setForm({
        name: "",
        email: "",
        password: "",
      });

      fetchUsers();

    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Something went wrong"
      );
    }
  };

  // ================= DELETE USER =================
  const handleDelete = async (user) => {
    if (user.email === currentUser?.email) {
      alert("You cannot delete your own account");
      return;
    }

    if (!confirm("Delete this user?")) return;

    try {
      await api.delete(
        `admin/users/${user._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchUsers();

    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Delete failed"
      );
    }
  };

  // ================= CHANGE PASSWORD =================
  const handlePasswordChange = async (e) => {
    e.preventDefault();

    try {
      await api.put(
        "/admin/change-password",
        passwordForm,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Password changed successfully ✅");

      setPasswordOpen(false);

      setPasswordForm({
        currentPassword: "",
        confirmCurrentPassword: "",
        newPassword: "",
      });

      fetchUsers();

    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Password change failed"
      );
    }
  };

  // ================= RESET PASSWORD =================
  const handleResetPassword = async (userId) => {
    if (!confirm("Reset this user's password?"))
      return;

    try {
      const res = await api.put(
        `/admin/users/${userId}/reset-password`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(
        `Temporary Password: ${res.data.tempPassword}`
      );

    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Reset failed"
      );
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">

      {/* ================= HEADER ================= */}
      <div className="flex justify-between items-center mb-8">

        <h1 className="text-3xl font-bold text-gray-800">
          User Management
        </h1>

        <div className="flex gap-3">

          {/* CHANGE PASSWORD */}
          <button
            onClick={() => setPasswordOpen(true)}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg"
          >
            Change Password
          </button>

          {/* ADD USER */}
          {/* <button
            onClick={() => {
              setEditUser(null);

              setForm({
                name: "",
                email: "",
                password: "",
              });

              setOpen(true);
            }}
            className="bg-black text-white px-5 py-2 rounded-lg"
          >
            + Add User
          </button> */}

        </div>
      </div>

      {/* ================= USERS ================= */}
      <div className="space-y-4">

        {users.map((u) => (
          <div
            key={u._id}
            className="bg-white p-5 rounded-xl shadow flex justify-between items-center"
          >

            {/* LEFT */}
            <div>
              <p className="font-semibold">
                {u.name}
              </p>

              <p className="text-sm text-gray-500">
                {u.email}
              </p>

              <p className="text-xs text-purple-600 mt-1">
                {u.role}
              </p>

              <p className="text-xs text-gray-400 mt-1">
                Password Changed:
                {" "}
                {u.lastPasswordChanged
                  ? new Date(
                      u.lastPasswordChanged
                    ).toLocaleString()
                  : "Never"}
              </p>
            </div>

            {/* RIGHT */}
            <div className="flex gap-3 items-center">

              {/* RESET PASSWORD */}
              {currentUser?.role ===
                "superadmin" && (
                <button
                  onClick={() =>
                    handleResetPassword(u._id)
                  }
                  className="bg-purple-600 text-white px-4 py-1 rounded-lg text-sm hover:bg-purple-700"
                >
                  Reset
                </button>
              )}

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
                className="bg-orange-500 text-white px-4 py-1 rounded-lg text-sm hover:bg-orange-600"
              >
                Edit
              </button>

              {/* DELETE */}
              <button
                onClick={() => handleDelete(u)}
                disabled={
                  u.email === currentUser?.email
                }
                className={`bg-red-500 text-white px-4 py-1 rounded-lg text-sm hover:bg-red-600 ${
                  u.email === currentUser?.email
                    ? "opacity-40 cursor-not-allowed"
                    : ""
                }`}
              >
                Delete
              </button>

            </div>
          </div>
        ))}

      </div>

      {/* ================= ADD / EDIT MODAL ================= */}
      {open && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">

          <div className="bg-white p-6 rounded-xl w-[350px]">

            <h2 className="text-xl mb-4">
              {editUser
                ? "Edit User"
                : "Add User"}
            </h2>

            <form
              onSubmit={handleSubmit}
              className="space-y-3"
            >

              <input
                placeholder="Name"
                className="w-full border p-2 rounded"
                value={form.name}
                onChange={(e) =>
                  setForm({
                    ...form,
                    name: e.target.value,
                  })
                }
              />

              <input
                placeholder="Email"
                className="w-full border p-2 rounded"
                value={form.email}
                onChange={(e) =>
                  setForm({
                    ...form,
                    email: e.target.value,
                  })
                }
              />

              {!editUser && (
                <input
                  placeholder="Password"
                  type="password"
                  className="w-full border p-2 rounded"
                  onChange={(e) =>
                    setForm({
                      ...form,
                      password: e.target.value,
                    })
                  }
                />
              )}

              <div className="text-sm text-gray-500">
                Role:
                {" "}
                <span className="font-semibold text-purple-600">
                  Admin
                </span>
              </div>

              <button className="w-full bg-black text-white py-2 rounded">
                Save
              </button>

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

      {/* ================= CHANGE PASSWORD MODAL ================= */}
      {passwordOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">

          <div className="bg-white p-6 rounded-2xl w-[400px]">

            <h2 className="text-2xl font-bold mb-5">
              Change Password
            </h2>

            <form
              onSubmit={handlePasswordChange}
              className="space-y-4"
            >

              <input
                type="password"
                placeholder="Current Password"
                className="w-full border p-3 rounded-lg"
                onChange={(e) =>
                  setPasswordForm({
                    ...passwordForm,
                    currentPassword:
                      e.target.value,
                  })
                }
              />

              <input
                type="password"
                placeholder="Confirm Current Password"
                className="w-full border p-3 rounded-lg"
                onChange={(e) =>
                  setPasswordForm({
                    ...passwordForm,
                    confirmCurrentPassword:
                      e.target.value,
                  })
                }
              />

              <input
                type="password"
                placeholder="New Password"
                className="w-full border p-3 rounded-lg"
                onChange={(e) =>
                  setPasswordForm({
                    ...passwordForm,
                    newPassword:
                      e.target.value,
                  })
                }
              />

              <button className="w-full bg-black text-white py-3 rounded-lg">
                Update Password
              </button>

            </form>

            <button
              onClick={() =>
                setPasswordOpen(false)
              }
              className="mt-4 text-sm text-gray-500"
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