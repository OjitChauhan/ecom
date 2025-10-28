import { useEffect, useState } from "react";
import { FaTrash, FaEdit, FaCheck, FaTimes } from "react-icons/fa";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import {
  useDeleteUserMutation,
  useGetUsersQuery,
  useUpdateUserMutation,
} from "../../redux/api/usersApiSlice";
import { toast } from "react-toastify";

const UserList = () => {
  const { data: users = [], refetch, isLoading, error } = useGetUsersQuery();
  const [deleteUser] = useDeleteUserMutation();
  const [updateUser] = useUpdateUserMutation();

  const [editableUserId, setEditableUserId] = useState(null);
  const [editableUserName, setEditableUserName] = useState("");
  const [editableUserEmail, setEditableUserEmail] = useState("");

  useEffect(() => {
    refetch();
  }, [refetch]);

  const deleteHandler = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteUser(id).unwrap();
        toast.success("User deleted successfully");
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  const toggleEdit = (id, username, email) => {
    setEditableUserId(id);
    setEditableUserName(username);
    setEditableUserEmail(email);
  };

  const updateHandler = async (id) => {
    if (!(editableUserName.trim() && editableUserEmail.trim())) {
      toast.error("Name and Email are required");
      return;
    }
    try {
      await updateUser({
        userId: id,
        username: editableUserName,
        email: editableUserEmail,
      }).unwrap();
      toast.success("User updated successfully");
      setEditableUserId(null);
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#F0F4F8]">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col min-w-[210px] max-w-[230px] bg-gradient-to-b from-[#285570] to-[#3CBEAC] text-[#E3DED7] shadow-xl px-7 py-8 rounded-tr-3xl">
        <div className="flex flex-col items-center gap-1">
          <span className="w-14 h-14 bg-[#EFAF76] rounded-full flex items-center justify-center text-3xl font-extrabold text-[#285570] mb-2">🚀</span>
          <h1 className="text-lg font-bold mb-4 tracking-tight">Admin Panel</h1>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8">
        <div className="max-w-5xl mx-auto mt-4 bg-white rounded-xl shadow-lg p-4 md:p-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-[#285570] tracking-wide flex items-center gap-3">
            <span>Users</span>
            <span className="bg-[#3CBEAC] text-white text-sm md:text-base px-2 md:px-3 py-1 rounded-full font-semibold">{users.length}</span>
          </h1>

          {isLoading ? (
            <Loader />
          ) : error ? (
            <Message variant="danger" className="text-red-600 bg-red-100 p-4 rounded">
              {error?.data?.message || error.error}
            </Message>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-[600px] md:min-w-full bg-white rounded-lg shadow border">
                <thead className="bg-[#285570] text-white text-sm md:text-base">
                  <tr>
                    <th className="py-2 px-2 md:py-3 md:px-4 text-left font-semibold">ID</th>
                    <th className="py-2 px-2 md:py-3 md:px-4 text-left font-semibold">Name</th>
                    <th className="py-2 px-2 md:py-3 md:px-4 text-left font-semibold">Email</th>
                    <th className="py-2 px-2 md:py-3 md:px-4 text-left font-semibold">Admin</th>
                    <th className="py-2 px-2 md:py-3 md:px-4"></th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr
                      key={user._id}
                      className="border-b last:border-none hover:bg-[#E3DED7] transition"
                    >
                      <td className="py-2 px-2 md:py-3 md:px-4 text-sm break-words">{user._id}</td>
                      <td className="py-2 px-2 md:py-3 md:px-4 text-sm">
                        {editableUserId === user._id ? (
                          <div className="flex flex-col md:flex-row items-center space-y-1 md:space-y-0 md:space-x-2">
                            <input
                              type="text"
                              value={editableUserName}
                              onChange={(e) => setEditableUserName(e.target.value)}
                              className="w-full p-2 border border-[#3CBEAC] rounded-md focus:outline-none focus:ring-2 focus:ring-[#285570]"
                            />
                            <button
                              onClick={() => updateHandler(user._id)}
                              className="p-2 bg-[#3CBEAC] text-white rounded hover:bg-[#285570] transition"
                              aria-label="Save Name"
                            >
                              <FaCheck />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between">
                            <span>{user.username}</span>
                            <button
                              onClick={() =>
                                toggleEdit(user._id, user.username, user.email)
                              }
                              className="ml-2 md:ml-4 text-[#3CBEAC] hover:text-[#285570] transition"
                              aria-label="Edit Name"
                            >
                              <FaEdit />
                            </button>
                          </div>
                        )}
                      </td>
                      <td className="py-2 px-2 md:py-3 md:px-4 text-sm">
                        {editableUserId === user._id ? (
                          <div className="flex flex-col md:flex-row items-center space-y-1 md:space-y-0 md:space-x-2">
                            <input
                              type="email"
                              value={editableUserEmail}
                              onChange={(e) => setEditableUserEmail(e.target.value)}
                              className="w-full p-2 border border-[#3CBEAC] rounded-md focus:outline-none focus:ring-2 focus:ring-[#285570]"
                            />
                            <button
                              onClick={() => updateHandler(user._id)}
                              className="p-2 bg-[#3CBEAC] text-white rounded hover:bg-[#285570] transition"
                              aria-label="Save Email"
                            >
                              <FaCheck />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between">
                            <a
                              href={`mailto:${user.email}`}
                              className="text-[#285570] hover:underline"
                            >
                              {user.email}
                            </a>
                            <button
                              onClick={() =>
                                toggleEdit(user._id, user.username, user.email)
                              }
                              className="ml-2 md:ml-4 text-[#3CBEAC] hover:text-[#285570] transition"
                              aria-label="Edit Email"
                            >
                              <FaEdit />
                            </button>
                          </div>
                        )}
                      </td>
                      <td className="py-2 px-2 md:py-3 md:px-4 text-center text-sm">
                        {user.isAdmin ? (
                          <span className="inline-flex items-center gap-1 text-green-600 font-bold">
                            <FaCheck /> Admin
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-red-500 font-bold">
                            <FaTimes /> User
                          </span>
                        )}
                      </td>
                      <td className="py-2 px-2 md:py-3 md:px-4 text-right text-sm">
                        {!user.isAdmin && (
                          <button
                            onClick={() => deleteHandler(user._id)}
                            className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-2 md:py-2 md:px-4 rounded transition"
                            aria-label="Delete User"
                          >
                            <FaTrash />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default UserList;
