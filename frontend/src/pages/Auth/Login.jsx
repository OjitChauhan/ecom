import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../components/Loader";
import { useLoginMutation } from "../../redux/api/usersApiSlice";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { FaTimes } from "react-icons/fa";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [login, { isLoading }] = useLoginMutation();
  const { userInfo } = useSelector((state) => state.auth);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/";

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate(redirect);
      toast.success("Signed in successfully!");
    } catch (err) {
      toast.error(err?.data?.message || err.error || "Login failed");
    }
  };

  const closeHandler = () => {
    navigate(-1); // Navigate back on close, you can adjust as needed
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 px-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="relative w-full max-w-4xl bg-white rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row"
      >
        {/* Close button */}
        <button
          onClick={closeHandler}
          className="absolute top-4 right-4 text-[#EFAF76] hover:text-[#FFD700] text-2xl font-bold z-50 transition"
          aria-label="Close Login Modal"
        >
          <FaTimes />
        </button>

        {/* Left image/branding panel (hidden on mobile) */}
        <div className="hidden md:flex md:w-1/2 bg-gradient-to-b from-[#285570] to-[#3CBEAC] flex-col justify-center items-center py-12 px-8 text-center">
          <div className="w-16 h-16 rounded-full bg-[#EFAF76] flex items-center justify-center mb-6 text-3xl font-bold text-[#285570]">
            🚀
          </div>
          <h2 className="text-white text-2xl font-bold mb-2">Welcome Back!</h2>
          <p className="text-[#E3DED7] text-base max-w-xs mx-auto">
            Enter your credentials to access your account and continue your journey with shopX.
          </p>
        </div>

        {/* Right form panel */}
        <div className="w-full md:w-1/2 flex flex-col justify-center px-8 py-10 bg-[#FAF7F6] overflow-y-auto max-h-[90vh]">
          <h2 className="text-[#285570] text-2xl font-bold mb-7 text-center">
            Sign In
          </h2>

          <form className="space-y-6" onSubmit={submitHandler} autoComplete="off">
            <div>
              <label
                htmlFor="email"
                className="block text-[#333333] font-semibold mb-2"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                className="w-full px-4 py-3 border border-[#3CBEAC] rounded-lg text-[#333333] placeholder-[#999999] focus:outline-none focus:ring-2 focus:ring-[#3CBEAC]"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-[#333333] font-semibold mb-2"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                placeholder="Enter your password"
                className="w-full px-4 py-3 border border-[#3CBEAC] rounded-lg text-[#333333] placeholder-[#999999] focus:outline-none focus:ring-2 focus:ring-[#3CBEAC]"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              disabled={isLoading}
              type="submit"
              className="w-full bg-[#285570] text-[#FAF7F6] py-3 px-4 rounded-lg font-semibold text-lg shadow-md transition disabled:opacity-50"
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </button>

            {isLoading && <Loader />}
          </form>

          <div className="mt-6 text-center text-[#333333]">
            <span className="text-sm">
              New Customer?{" "}
              <Link
                to={redirect ? `/register?redirect=${redirect}` : "/register"}
                className="text-[#EFAF76] hover:underline font-semibold"
              >
                Register
              </Link>
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
