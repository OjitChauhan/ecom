import { useState } from "react";
import {
  AiOutlineHome,
  AiOutlineShopping,
  AiOutlineLogin,
  AiOutlineUserAdd,
  AiOutlineShoppingCart,
  AiOutlineMenu,
  AiOutlineClose,
} from "react-icons/ai";
import { FaHeart } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useLogoutMutation } from "../../redux/api/usersApiSlice";
import { logout } from "../../redux/features/auth/authSlice";
import FavoritesCount from "../Products/FavoritesCount";

const navItems = [
  { label: "Home", icon: AiOutlineHome, link: "/" },
  { label: "Shop", icon: AiOutlineShopping, link: "/shop" },
  { label: "Cart", icon: AiOutlineShoppingCart, link: "/cart", badge: true },
  { label: "Favorites", icon: FaHeart, link: "/favorite", favorites: true },
];

const Navigation = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  // Dropdown items
  const userMenu =
    userInfo && (
      <ul className="absolute right-0 top-full mt-2 min-w-[190px] bg-[#E3DED7] rounded shadow-lg py-2 z-50 border border-[#3CBEAC]">
        {userInfo.isAdmin && (
          <>
            <li>
              <Link
                to="/admin/dashboard"
                className="block px-4 py-2 hover:bg-[#3CBEAC] hover:text-[#FAF7F6]"
                onClick={() => setUserDropdown(false)}
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                to="/admin/productlist"
                className="block px-4 py-2 hover:bg-[#3CBEAC] hover:text-[#FAF7F6]"
                onClick={() => setUserDropdown(false)}
              >
                Products
              </Link>
            </li>
            <li>
              <Link
                to="/admin/categorylist"
                className="block px-4 py-2 hover:bg-[#3CBEAC] hover:text-[#FAF7F6]"
                onClick={() => setUserDropdown(false)}
              >
                Category
              </Link>
            </li>
            <li>
              <Link
                to="/admin/orderlist"
                className="block px-4 py-2 hover:bg-[#3CBEAC] hover:text-[#FAF7F6]"
                onClick={() => setUserDropdown(false)}
              >
                Orders
              </Link>
            </li>
            <li>
              <Link
                to="/admin/userlist"
                className="block px-4 py-2 hover:bg-[#3CBEAC] hover:text-[#FAF7F6]"
                onClick={() => setUserDropdown(false)}
              >
                Users
              </Link>
            </li>
          </>
        )}
        <li>
          <Link
            to="/profile"
            className="block px-4 py-2 hover:bg-[#3CBEAC] hover:text-[#FAF7F6]"
            onClick={() => setUserDropdown(false)}
          >
            Profile
          </Link>
        </li>
        <li>
          <button
            onClick={() => {
              setUserDropdown(false);
              logoutHandler();
            }}
            className="block w-full text-left px-4 py-2 hover:bg-[#3CBEAC] hover:text-[#FAF7F6]"
          >
            Logout
          </button>
        </li>
      </ul>
    );

  return (
    <nav className="w-full bg-[#FAF7F6] border-b border-[#E3DED7] z-50 shadow-sm">
      {/* First line: nav layout */}
      <div className="flex items-center justify-between px-3 md:px-8 py-3 relative">
        {/* Hamburger for mobile */}
        <button
          className="md:hidden p-2 rounded bg-white text-[#285570] flex items-center"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          <AiOutlineMenu size={28} />
        </button>

        {/* Centered Logo/Brand */}
        <div className="flex-1 flex justify-center">
          <span className="text-xl font-extrabold tracking-wider text-[#285570] select-none">
            SHOPX
          </span>
        </div>

        {/* Right side (user/login) */}
        <div className="absolute top-1/2 right-3 md:right-8 -translate-y-1/2 flex items-center gap-1">
          {userInfo ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setUserDropdown((prev) => !prev)}
                className="inline-flex items-center px-3 py-1 rounded text-[#285570] font-bold bg-[#E3DED7] focus:outline-none"
              >
                {userInfo.username}
                <svg
                  className={`ml-2 w-4 h-4 transition-transform ${userDropdown ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="#3CBEAC"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {userDropdown && userMenu}
            </div>
          ) : (
            <Link
              to="/login"
              className="inline-flex items-center px-3 py-1 rounded text-[#3CBEAC] font-bold hover:bg-[#EFAF76] hover:text-[#285570] transition"
            >
              <AiOutlineLogin className="mr-1" /> Login
            </Link>
          )}
        </div>
      </div>

      {/* Second line: Nav Tabs with increased space */}
      <div className="flex flex-nowrap overflow-x-auto no-scrollbar md:justify-center py-2 bg-[#FAF7F6] border-t border-[#E3DED7] gap-6 md:gap-16">
        {navItems.map(({ label, icon: Icon, link, badge, favorites }) => (
          <Link
            to={link}
            key={label}
            className="flex items-center gap-2 px-3 py-2 rounded-md text-[#285570] font-semibold hover:bg-[#EFAF76] hover:text-[#285570] whitespace-nowrap transition"
          >
            <Icon size={20} />
            <span className="text-base">{label}</span>
            {badge && cartItems.length > 0 && (
              <span className="ml-1 px-2 py-0.5 text-xs rounded-full bg-[#3CBEAC] text-white">
                {cartItems.reduce((a, c) => a + c.qty, 0)}
              </span>
            )}
            {/* {favorites && <span className="ml-1"><FavoritesCount /></span>} */}
          </Link>
        ))}
      </div>

      {/* Drawer for mobile nav */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40" onClick={() => setMobileOpen(false)}>
          <div
            onClick={(e) => e.stopPropagation()}
            className="absolute left-0 top-0 h-full w-64 bg-[#FAF7F6] flex flex-col shadow-2xl py-6 px-4"
          >
            <button
              className="self-end mb-4"
              onClick={() => setMobileOpen(false)}
              aria-label="Close navigation"
            >
              <AiOutlineClose size={28} className="text-[#285570]" />
            </button>
            {navItems.map(({ label, icon: Icon, link, badge, favorites }) => (
              <Link
                to={link}
                key={label}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-[#285570] hover:bg-[#E3DED7] transition font-semibold"
              >
                <Icon size={22} />
                <span>{label}</span>
                {badge && cartItems.length > 0 && (
                  <span className="ml-1 px-2 py-0.5 text-xs rounded-full bg-[#3CBEAC] text-white">
                    {cartItems.reduce((a, c) => a + c.qty, 0)}
                  </span>
                )}
                {favorites && <span className="ml-1"><FavoritesCount /></span>}
              </Link>
            ))}
            <hr className="my-4 border-[#E3DED7]" />
            {userInfo ? (
              <div className="relative">
                <button
                  type="button"
                  className="block w-full px-4 py-3 mt-2 rounded-lg text-[#285570] font-semibold bg-[#E3DED7] text-left focus:outline-none"
                  onClick={() => setUserDropdown((prev) => !prev)}
                >
                  {userInfo.username}
                  <svg
                    className={`ml-2 w-4 h-4 inline transition-transform ${userDropdown ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="#3CBEAC"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {userDropdown && (
                  <div className="absolute left-0 right-0 z-50 bg-[#E3DED7] rounded shadow mt-1 py-2 border border-[#3CBEAC]">
                    {userInfo.isAdmin && (
                      <>
                        <Link to="/admin/dashboard" className="block px-4 py-2 hover:bg-[#3CBEAC] hover:text-[#FAF7F6]" onClick={() => setUserDropdown(false)}>Dashboard</Link>
                        <Link to="/admin/productlist" className="block px-4 py-2 hover:bg-[#3CBEAC] hover:text-[#FAF7F6]" onClick={() => setUserDropdown(false)}>Products</Link>
                        <Link to="/admin/categorylist" className="block px-4 py-2 hover:bg-[#3CBEAC] hover:text-[#FAF7F6]" onClick={() => setUserDropdown(false)}>Category</Link>
                        <Link to="/admin/orderlist" className="block px-4 py-2 hover:bg-[#3CBEAC] hover:text-[#FAF7F6]" onClick={() => setUserDropdown(false)}>Orders</Link>
                        <Link to="/admin/userlist" className="block px-4 py-2 hover:bg-[#3CBEAC] hover:text-[#FAF7F6]" onClick={() => setUserDropdown(false)}>Users</Link>
                      </>
                    )}
                    <Link to="/profile" className="block px-4 py-2 hover:bg-[#3CBEAC] hover:text-[#FAF7F6]" onClick={() => setUserDropdown(false)}>
                      Profile
                    </Link>
                    <button onClick={() => { setUserDropdown(false); logoutHandler(); }} className="block w-full text-left px-4 py-2 hover:bg-[#3CBEAC] hover:text-[#FAF7F6]">
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-3 rounded-lg text-[#3CBEAC] font-semibold hover:bg-[#EFAF76] hover:text-[#285570] transition"
              >
                <AiOutlineLogin className="inline mr-1" />
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
