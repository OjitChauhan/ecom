import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { FaTimes } from "react-icons/fa";
import Loader from "../../components/Loader";
import { useProfileMutation } from "../../redux/api/usersApiSlice";
import { setCredentials } from "../../redux/features/auth/authSlice";

const Profile = () => {
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { userInfo } = useSelector((state) => state.auth);
  const [updateProfile, { isLoading: loadingUpdateProfile }] = useProfileMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (userInfo) {
      setUserName(userInfo.username);
      setEmail(userInfo.email);
    }
  }, [userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    try {
      const res = await updateProfile({
        _id: userInfo._id,
        username,
        email,
        password,
      }).unwrap();
      dispatch(setCredentials({ ...res }));
      toast.success("Profile updated successfully");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const closeHandler = () => navigate(-1);

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-4 sm:p-6 md:p-8">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="
          relative 
          w-full 
          max-w-sm sm:max-w-md md:max-w-lg 
          bg-[#FAF7F6] 
          rounded-3xl 
          shadow-2xl 
          p-5 sm:p-6 md:p-10 
          overflow-y-auto 
          max-h-[90vh]
        "
      >
        {/* Close Button */}
        <button
          onClick={closeHandler}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 text-[#EFAF76] hover:text-[#FFD700] text-2xl font-bold transition"
          aria-label="Close Profile Modal"
        >
          <FaTimes />
        </button>

        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#285570] mb-6 sm:mb-8 text-center">
          Update Profile
        </h2>

        <form onSubmit={submitHandler} className="space-y-5 sm:space-y-6">
          <div>
            <label
              htmlFor="username"
              className="block text-[#285570] font-semibold mb-1 text-sm sm:text-base"
            >
              Name
            </label>
            <input
              id="username"
              type="text"
              placeholder="Enter name"
              value={username}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full p-3 sm:p-4 rounded-xl border border-[#3CBEAC] focus:ring-2 focus:ring-[#EFAF76] text-[#285570] bg-white text-sm sm:text-base"
              required
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-[#285570] font-semibold mb-1 text-sm sm:text-base"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 sm:p-4 rounded-xl border border-[#3CBEAC] focus:ring-2 focus:ring-[#EFAF76] text-[#285570] bg-white text-sm sm:text-base"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-[#285570] font-semibold mb-1 text-sm sm:text-base"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 sm:p-4 rounded-xl border border-[#3CBEAC] focus:ring-2 focus:ring-[#EFAF76] text-[#285570] bg-white text-sm sm:text-base"
            />
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-[#285570] font-semibold mb-1 text-sm sm:text-base"
            >
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-3 sm:p-4 rounded-xl border border-[#3CBEAC] focus:ring-2 focus:ring-[#EFAF76] text-[#285570] bg-white text-sm sm:text-base"
            />
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-4">
            <button
              type="submit"
              className="
                w-full sm:w-auto 
                bg-gradient-to-r from-[#EFAF76] to-[#3CBEAC] 
                hover:from-[#3CBEAC] hover:to-[#285570] 
                text-[#285570] font-extrabold 
                py-3 px-6 sm:px-8 
                rounded-xl shadow-lg 
                transition transform hover:scale-105 
                disabled:opacity-50
              "
              disabled={loadingUpdateProfile}
            >
              {loadingUpdateProfile ? <Loader /> : "Update"}
            </button>

            <Link
              to="/user-orders"
              className="
                w-full sm:w-auto 
                bg-[#285570] hover:bg-[#3CBEAC] 
                text-[#FAF7F6] 
                py-3 px-6 sm:px-8 
                rounded-xl font-extrabold 
                shadow-lg text-center 
                transition transform hover:scale-105
              "
            >
              My Orders
            </Link>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default Profile;
