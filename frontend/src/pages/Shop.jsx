import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useGetFilteredProductsQuery } from "../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../redux/api/categoryApiSlice";
import { setCategories, setProducts, setChecked } from "../redux/features/shop/shopSlice";
import Loader from "../components/Loader";
import ProductCard from "./Products/ProductCard";
import { motion, AnimatePresence } from "framer-motion";
import { FaShoppingBag, FaSearch, FaFilter, FaSort, FaMicrophone } from "react-icons/fa";

import "@fontsource/poppins/400.css";
import "@fontsource/poppins/500.css";
import "@fontsource/poppins/700.css";

const Shop = () => {
  const dispatch = useDispatch();
  const { categories, products, checked, radio } = useSelector((state) => state.shop);

  const categoriesQuery = useFetchCategoriesQuery();
  const filteredProductsQuery = useGetFilteredProductsQuery({ checked, radio });

  const [priceFilter, setPriceFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [sortOption, setSortOption] = useState("");

  // 🤖 Chatbot Assistant
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [assistantMessages, setAssistantMessages] = useState([
    { from: "bot", text: "👋 Hello! I’m your AI shopping assistant. How can I help?" },
  ]);
  const [userMessage, setUserMessage] = useState("");

  // 📱 Mobile modal states
  const [isBottomModalOpen, setIsBottomModalOpen] = useState(false);
  const [activeMobilePopup, setActiveMobilePopup] = useState(null); // "search" | "filter" | "sort"

  const poppins = "font-[Poppins]";

  // Fetch categories
  useEffect(() => {
    if (!categoriesQuery.isLoading && categoriesQuery.data) {
      dispatch(setCategories(categoriesQuery.data));
    }
  }, [categoriesQuery.data, dispatch]);

  // Fetch & filter products
  useEffect(() => {
    if (!filteredProductsQuery.isSuccess) return;

    let filtered = filteredProductsQuery.data || [];

    if (checked.length > 0) {
      filtered = filtered.filter((product) => checked.includes(product.category?._id));
    }

    if (priceFilter.trim()) {
      filtered = filtered.filter(
        (product) =>
          product.price.toString().includes(priceFilter) ||
          product.price === parseInt(priceFilter, 10)
      );
    }

    if (searchTerm.trim()) {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    switch (sortOption) {
      case "price-asc":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "name-asc":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        break;
    }

    dispatch(setProducts(filtered));
  }, [
    checked,
    radio,
    filteredProductsQuery.data,
    priceFilter,
    searchTerm,
    sortOption,
    dispatch,
  ]);

  const handleCheck = (value, id) => {
    const updatedChecked = value ? [...checked, id] : checked.filter((c) => c !== id);
    dispatch(setChecked(updatedChecked));
  };

  const handleBrandClick = (brand) => {
    const productsByBrand = filteredProductsQuery.data?.filter((p) => p.brand === brand);
    dispatch(setProducts(productsByBrand));
  };

  const uniqueBrands = [
    ...new Set(
      filteredProductsQuery.data?.map((p) => p.brand).filter((b) => b !== undefined)
    ),
  ];

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (name) => {
    setSearchTerm(name);
    setShowSuggestions(false);
  };

  // 🎤 Voice Assistant
  const startVoiceRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      toast.error("Voice recognition not supported. Use Chrome or Edge.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.onstart = () => {
      toast.info("🎙️ Listening... Speak now!", { autoClose: 1500 });
    };

    recognition.onresult = (event) => {
      const voiceResult = event.results[0][0].transcript.trim();
      setSearchTerm(voiceResult);
      setShowSuggestions(true);
      toast.success(`You said: "${voiceResult}"`);
    };

    recognition.onerror = (event) => {
      toast.error(`Voice error: ${event.error}`);
    };

    recognition.start();
  };

  const suggestions = filteredProductsQuery.data?.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 💬 Chatbot
  const handleAssistantSend = () => {
    if (!userMessage.trim()) return;
    const newMsg = { from: "user", text: userMessage };
    setAssistantMessages([...assistantMessages, newMsg]);
    setUserMessage("");

    setTimeout(() => {
      let reply = "I'm here to help!";
      if (userMessage.toLowerCase().includes("price")) reply = "💰 You can filter by price in the sidebar.";
      else if (userMessage.toLowerCase().includes("brand")) reply = "🏷️ Select your favorite brand from filters.";
      else if (userMessage.toLowerCase().includes("search"))
        reply = "🔍 Try the search bar or use the mic icon.";
      else if (userMessage.toLowerCase().includes("sort")) reply = "📊 You can sort products by name or price.";

      setAssistantMessages((prev) => [...prev, { from: "bot", text: reply }]);
    }, 700);
  };

  const closeBottomModal = () => {
    setIsBottomModalOpen(false);
    setActiveMobilePopup(null);
  };

  return (
    <div className={`flex min-h-screen bg-gradient-to-br from-[#FAF7F6] via-[#E3DED7] to-[#FAF7F6] text-[#285570] ${poppins}`}>
      {/* 🖥️ Desktop Sidebar */}
      <div className="fixed top-0 left-0 h-screen w-64 bg-[#FAF7F6]/70 backdrop-blur-md border-r border-[#3CBEAC]/40 p-4 hidden sm:block">
        {/* Search */}
        <div className="relative mb-6">
          <div className="flex items-center border-b border-[#3CBEAC]/60">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full px-2 py-1 bg-transparent text-sm text-[#285570] placeholder-[#285570]/50 focus:outline-none"
            />
            <button
              onClick={startVoiceRecognition}
              className="ml-2 text-[#3CBEAC] hover:text-[#285570]"
              title="Speak"
            >
              🎤
            </button>
          </div>

          {showSuggestions && searchTerm && (
            <ul className="absolute bg-white text-[#285570] mt-1 w-full rounded shadow-md max-h-40 overflow-y-auto text-sm">
              {suggestions?.length > 0 ? (
                suggestions.map((s) => (
                  <li
                    key={s._id}
                    className="px-3 py-2 hover:bg-[#E3DED7]/70 cursor-pointer"
                    onClick={() => handleSuggestionClick(s.name)}
                  >
                    {s.name}
                  </li>
                ))
              ) : (
                <li className="px-3 py-2 text-gray-400">No results</li>
              )}
            </ul>
          )}
        </div>

        {/* Filters */}
        <h3 className="text-xs uppercase tracking-wider mb-2 font-semibold border-b border-[#3CBEAC]/60">
          Categories
        </h3>
        {categories?.map((c) => (
          <div key={c._id} className="flex items-center mb-1">
            <input
              type="checkbox"
              checked={checked.includes(c._id)}
              onChange={(e) => handleCheck(e.target.checked, c._id)}
              className="accent-[#3CBEAC]"
            />
            <label className="ml-2 text-sm">{c.name}</label>
          </div>
        ))}

        <h3 className="text-xs uppercase tracking-wider mb-2 mt-4 font-semibold border-b border-[#3CBEAC]/60">
          Brands
        </h3>
        {uniqueBrands?.map((brand) => (
          <div key={brand} className="flex items-center mb-1">
            <input type="radio" name="brand" onChange={() => handleBrandClick(brand)} className="accent-[#3CBEAC]" />
            <label className="ml-2 text-sm">{brand}</label>
          </div>
        ))}

        <h3 className="text-xs uppercase tracking-wider mb-2 mt-4 font-semibold border-b border-[#3CBEAC]/60">
          Price
        </h3>
        <input
          type="text"
          placeholder="Enter price"
          value={priceFilter}
          onChange={(e) => setPriceFilter(e.target.value)}
          className="w-full px-2 py-1 bg-transparent border-b border-[#3CBEAC]/50 text-sm placeholder-[#285570]/50 focus:outline-none"
        />

        <h3 className="text-xs uppercase tracking-wider mb-2 mt-4 font-semibold border-b border-[#3CBEAC]/60">
          Sort By
        </h3>
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="w-full bg-transparent border-b border-[#3CBEAC]/50 text-sm focus:outline-none"
        >
          <option value="">Default</option>
          <option value="price-asc">Price: Low → High</option>
          <option value="price-desc">Price: High → Low</option>
          <option value="name-asc">Name: A → Z</option>
          <option value="name-desc">Name: Z → A</option>
        </select>
      </div>

      {/* 🛍️ Products Section */}
      <div className="sm:ml-64 flex-1 p-6">
        <h2 className="text-center text-lg font-semibold mb-4">{products?.length} Products Found</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.length === 0 ? <Loader /> : products.map((p) => <ProductCard key={p._id} p={p} />)}
        </div>
      </div>

      {/* 💬 Desktop AI Assistant */}
      <div className="fixed bottom-6 right-6 z-50 hidden sm:block">
        <button
          onClick={() => setIsAssistantOpen(!isAssistantOpen)}
          className="w-14 h-14 bg-[#285570] hover:bg-[#3CBEAC] rounded-full shadow-lg flex items-center justify-center text-white text-2xl transition-transform hover:scale-105"
          aria-label="Open AI Assistant"
        >
          🤖
        </button>

        <AnimatePresence>
          {isAssistantOpen && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              transition={{ duration: 0.3 }}
              className="absolute bottom-16 right-0 w-80 h-96 bg-[#13293D] text-white rounded-md shadow-2xl flex flex-col border border-[#3CBEAC]/40"
            >
              <div className="bg-[#1E3A5F] px-4 py-2 font-semibold text-sm border-b border-[#3CBEAC]/30">
                AI Shopping Assistant
              </div>
              <div className="flex-1 p-3 overflow-y-auto text-sm space-y-2">
                {assistantMessages.map((msg, i) => (
                  <div key={i} className={`${msg.from === "bot" ? "text-[#3CBEAC]" : "text-right text-[#E3DED7]"}`}>
                    {msg.text}
                  </div>
                ))}
              </div>
              <div className="flex border-t border-[#3CBEAC]/30">
                <input
                  type="text"
                  value={userMessage}
                  onChange={(e) => setUserMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 px-3 py-2 bg-transparent text-white placeholder-gray-400 focus:outline-none text-sm"
                  onKeyDown={(e) => e.key === "Enter" && handleAssistantSend()}
                />
                <button onClick={handleAssistantSend} className="px-4 bg-[#3CBEAC] text-[#13293D] font-semibold hover:bg-[#4DDDC1] transition">
                  Send
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* =========================
          MOBILE: Floating Button + Bottom Modal
         ========================= */}
      <div className="sm:hidden">
        {/* Floating Shop Button */}
        <button
          onClick={() => setIsBottomModalOpen(true)}
          aria-label="Open shop tools"
          className="fixed bottom-6 right-4 z-50 w-14 h-14 bg-[#285570] rounded-full shadow-lg flex items-center justify-center text-white text-xl transition-transform active:scale-95"
        >
          🛍️
        </button>

        {/* Floating AI Assistant Button */}
        <button
          onClick={() => setIsAssistantOpen(!isAssistantOpen)}
          aria-label="Open AI Assistant"
          className="fixed bottom-24 right-4 z-50 w-14 h-14 bg-[#3CBEAC] rounded-full shadow-lg flex items-center justify-center text-white text-2xl transition-transform active:scale-95"
        >
          🤖
        </button>

        {/* Mobile AI Assistant Modal */}
        <AnimatePresence>
          {isAssistantOpen && (
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 100, damping: 15 }}
              className="fixed bottom-0 left-0 right-0 z-50 bg-[#13293D] text-white rounded-t-3xl shadow-2xl p-4"
            >
              <div className="flex justify-between items-center border-b border-[#3CBEAC]/40 pb-2 mb-2">
                <h2 className="text-base font-semibold">AI Assistant</h2>
                <button onClick={() => setIsAssistantOpen(false)} className="text-gray-400 hover:text-white">
                  ✕
                </button>
              </div>

              <div className="h-64 overflow-y-auto space-y-2 text-sm">
                {assistantMessages.map((msg, i) => (
                  <div key={i} className={`${msg.from === "bot" ? "text-[#3CBEAC]" : "text-right text-[#E3DED7]"}`}>
                    {msg.text}
                  </div>
                ))}
              </div>

              <div className="flex mt-2 border-t border-[#3CBEAC]/30 pt-2">
                <input
                  type="text"
                  value={userMessage}
                  onChange={(e) => setUserMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 px-3 py-2 bg-[#1E3A5F] text-white placeholder-gray-400 rounded-l-md focus:outline-none text-sm"
                  onKeyDown={(e) => e.key === "Enter" && handleAssistantSend()}
                />
                <button
                  onClick={handleAssistantSend}
                  className="px-4 bg-[#3CBEAC] text-[#13293D] font-semibold rounded-r-md hover:bg-[#4DDDC1] transition"
                >
                  Send
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Modal Backdrop */}
        <AnimatePresence>
          {isBottomModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-40"
              onClick={closeBottomModal}
            />
          )}
        </AnimatePresence>

        {/* Bottom Sheet */}
        <AnimatePresence>
          {isBottomModalOpen && (
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 90, damping: 14 }}
              className="fixed bottom-0 left-0 right-0 z-50 bg-gray-900 text-white rounded-t-3xl shadow-2xl p-6 pb-10"
              role="dialog"
              aria-modal="true"
            >
              <div className="flex justify-between items-center border-b border-gray-700 pb-3 mb-4">
                <div className="flex items-center space-x-2">
                  <FaShoppingBag className="text-[#3CBEAC]" />
                  <h2 className="text-lg font-semibold">Shop Tools</h2>
                </div>
                <button
                  onClick={closeBottomModal}
                  className="text-gray-400 hover:text-white"
                  aria-label="Close shop tools"
                >
                  ✕
                </button>
              </div>

              {/* Toolbar */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                {[
                  { icon: <FaSearch />, label: "Search", key: "search" },
                  { icon: <FaFilter />, label: "Filter", key: "filter" },
                  { icon: <FaSort />, label: "Sort", key: "sort" },
                ].map((item) => (
                  <button
                    key={item.key}
                    onClick={() => setActiveMobilePopup(item.key)}
                    className="flex flex-col items-center bg-[#1E3A5F] p-4 rounded-2xl hover:bg-[#3CBEAC] transition-all duration-300"
                  >
                    <div className="text-2xl mb-1">{item.icon}</div>
                    <span className="text-xs">{item.label}</span>
                  </button>
                ))}
              </div>

              {/* Active Popup */}
              <AnimatePresence>
                {activeMobilePopup && (
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 30 }}
                    className="bg-[#1E3A5F] rounded-xl p-4 text-sm"
                  >
                    {activeMobilePopup === "search" && (
                      <>
                        <h3 className="text-base mb-2 font-medium">Search</h3>
                        <div className="flex items-center">
                          <input
                            type="text"
                            value={searchTerm}
                            onChange={handleSearchChange}
                            placeholder="Search products..."
                            className="flex-1 px-3 py-2 bg-gray-800 text-white rounded-l-md focus:outline-none text-sm"
                          />
                          <button
                            onClick={startVoiceRecognition}
                            className="px-4 bg-[#3CBEAC] text-[#13293D] font-semibold rounded-r-md hover:bg-[#4DDDC1] transition"
                          >
                            🎤
                          </button>
                        </div>
                      </>
                    )}

                    {activeMobilePopup === "filter" && (
                      <>
                        <h3 className="text-base mb-2 font-medium">Filter by Category</h3>
                        {categories?.map((c) => (
                          <div key={c._id} className="flex items-center mb-1">
                            <input
                              type="checkbox"
                              checked={checked.includes(c._id)}
                              onChange={(e) => handleCheck(e.target.checked, c._id)}
                              className="accent-[#3CBEAC]"
                            />
                            <label className="ml-2 text-sm">{c.name}</label>
                          </div>
                        ))}
                      </>
                    )}

                    {activeMobilePopup === "sort" && (
                      <>
                        <h3 className="text-base mb-2 font-medium">Sort By</h3>
                        <select
                          value={sortOption}
                          onChange={(e) => setSortOption(e.target.value)}
                          className="w-full bg-gray-800 text-white rounded-md p-2 focus:outline-none text-sm"
                        >
                          <option value="">Default</option>
                          <option value="price-asc">Price: Low → High</option>
                          <option value="price-desc">Price: High → Low</option>
                          <option value="name-asc">Name: A → Z</option>
                          <option value="name-desc">Name: Z → A</option>
                        </select>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Shop;
