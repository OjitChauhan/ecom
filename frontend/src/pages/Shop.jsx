import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useGetFilteredProductsQuery } from "../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../redux/api/categoryApiSlice";
import { setCategories, setProducts, setChecked } from "../redux/features/shop/shopSlice";
import Loader from "../components/Loader";
import ProductCard from "./Products/ProductCard";
import { motion, AnimatePresence } from "framer-motion";
import { FaShoppingBag, FaSearch, FaFilter, FaSort, FaHeart, FaHome, FaShoppingCart } from "react-icons/fa";

import "@fontsource/poppins/400.css";
import "@fontsource/poppins/500.css";
import "@fontsource/poppins/700.css";

import "./User/scrollbar.css"; // Import the custom scrollbar CSS (defined below)

const Shop = () => {
  const dispatch = useDispatch();
  const { categories, products, checked, radio } = useSelector((state) => state.shop);

  const categoriesQuery = useFetchCategoriesQuery();
  const filteredProductsQuery = useGetFilteredProductsQuery({ checked, radio });

  // Filters and search states
  const [priceFilter, setPriceFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [sortOption, setSortOption] = useState("");

  // Highlight states for UI parts
  const [highlightFilter, setHighlightFilter] = useState(false);
  const [highlightSort, setHighlightSort] = useState(false);
  const [highlightSearch, setHighlightSearch] = useState(false);
  const [highlightPrice, setHighlightPrice] = useState(false);
  const [highlightVoice, setHighlightVoice] = useState(false);
  const [highlightFavorites, setHighlightFavorites] = useState(false);
  const [highlightHome, setHighlightHome] = useState(false);
  const [highlightCart, setHighlightCart] = useState(false);

  // AI Assistant state
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [assistantMessages, setAssistantMessages] = useState([]);
  const [userMessage, setUserMessage] = useState("");
  const [showFullHelp, setShowFullHelp] = useState(false);

  // Mobile modal states
  const [isBottomModalOpen, setIsBottomModalOpen] = useState(false);
  const [activeMobilePopup, setActiveMobilePopup] = useState(null);

  const poppins = "font-[Poppins]";

  const voiceButtonRef = useRef(null);
  const priceInputRef = useRef(null);

  // Initialize assistant with welcome message
  useEffect(() => {
    if (isAssistantOpen) {
      setShowFullHelp(false);
      setAssistantMessages([{ from: "bot", text: "Here's a quick guide. Click 'Help' to see all shopping questions." }]);
    }
  }, [isAssistantOpen]);

  // Fetch categories
  useEffect(() => {
    if (!categoriesQuery.isLoading && categoriesQuery.data) {
      dispatch(setCategories(categoriesQuery.data));
    }
  }, [categoriesQuery.data, dispatch]);

  // Fetch & filter products with sorting and search filters
  useEffect(() => {
    if (!filteredProductsQuery.isSuccess) return;

    let filtered = filteredProductsQuery.data || [];

    if (checked.length > 0) {
      filtered = filtered.filter((product) => checked.includes(product.category?._id));
    }

    if (priceFilter.trim()) {
      const targetPrice = parseInt(priceFilter, 10);
      if (!isNaN(targetPrice)) {
        filtered = filtered.filter((product) => product.price <= targetPrice);
      }
    }

    if (searchTerm.trim()) {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    switch (sortOption) {
      case "price-asc":
        filtered = [...filtered].sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        filtered = [...filtered].sort((a, b) => b.price - a.price);
        break;
      case "name-asc":
        filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        filtered = [...filtered].sort((a, b) => b.name.localeCompare(a.name));
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

  const startVoiceRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      toast.error("Voice recognition not supported. Use Chrome or Edge.");
      return;
    }

    setHighlightVoice(true);
    setTimeout(() => setHighlightVoice(false), 3000);

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.onstart = () => {
      toast.info("🎙️ Listening... Speak now!", { autoClose: 1500 });
    };

    recognition.onresult = (event) => {
      let voiceResult = event.results[0][0].transcript.trim().toLowerCase();
      voiceResult = voiceResult.replace(/[.,!?]/g, "");
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

  // Extended AI assistant logic with new highlights
  const handleAssistantSend = () => {
    if (!userMessage.trim()) return;

    const newMsg = { from: "user", text: userMessage };
    setAssistantMessages([...assistantMessages, newMsg]);
    setUserMessage("");

    setTimeout(() => {
      const msgLower = userMessage.toLowerCase();
      let reply = "I'm here to help! Try asking me about pricing, brands, shipping, returns, or how to use filters.";

      // Reset all highlights
      setHighlightFilter(false);
      setHighlightSort(false);
      setHighlightSearch(false);
      setHighlightPrice(false);
      setHighlightVoice(false);
      setHighlightFavorites(false);
      setHighlightHome(false);
      setHighlightCart(false);

      if (msgLower.includes("filter") || msgLower.includes("category")) {
        reply = "You can use the filter options on the left to refine your search.";
        setHighlightFilter(true);
        setTimeout(() => setHighlightFilter(false), 3000);
      }
      if (msgLower.includes("sort")) {
        reply = "Sort products by price or name using the Sort By dropdown.";
        setHighlightSort(true);
        setTimeout(() => setHighlightSort(false), 3000);
      }
      if (msgLower.includes("search")) {
        reply = "Use the search box or microphone icon to find products by name.";
        setHighlightSearch(true);
        setTimeout(() => setHighlightSearch(false), 3000);
      }
      if (msgLower.includes("price")) {
        reply = "💰 You can filter products by entering a max price in the Price filter.";
        setHighlightPrice(true);
        setTimeout(() => setHighlightPrice(false), 3000);
      }
      if (msgLower.includes("voice") || msgLower.includes("microphone") || msgLower.includes("speak")) {
        reply = "Click the microphone icon next to search to use voice commands.";
        setHighlightVoice(true);
        setTimeout(() => setHighlightVoice(false), 3000);
      }
      if (msgLower.includes("favorite") || msgLower.includes("wishlist") || msgLower.includes("save product")) {
        reply = "You can add products to your favorites by clicking the heart icon on each product card.";
        setHighlightFavorites(true);
        setTimeout(() => setHighlightFavorites(false), 3000);
      }
      if (msgLower.includes("home") || msgLower.includes("main page") || msgLower.includes("dashboard")) {
        reply = "Click the home icon to return to the main dashboard anytime.";
        setHighlightHome(true);
        setTimeout(() => setHighlightHome(false), 3000);
      }
      if (msgLower.includes("cart") || msgLower.includes("shopping cart") || msgLower.includes("checkout")) {
        reply = "Access your shopping cart by clicking the cart icon.";
        setHighlightCart(true);
        setTimeout(() => setHighlightCart(false), 3000);
      }
      if (msgLower.includes("brand")) reply = "🏷️ Select your favorite brand from the Brands filter section.";
      if (msgLower.includes("shipping")) reply = "🚚 We offer shipping options depending on your location. Check the shipping details on product pages.";
      if (msgLower.includes("return")) reply = "🔄 Returns are accepted within 30 days of purchase with a valid receipt.";
      if (msgLower.includes("help")) reply = "🆘 I'm here to assist! You can ask about filtering, sorting, searching, favorites, home, cart, or other shopping questions.";

      setAssistantMessages((prev) => [...prev, { from: "bot", text: reply }]);
    }, 700);
  };

  const handleHelpClick = () => {
    if (!showFullHelp) {
      setShowFullHelp(true);
      setAssistantMessages((prev) => [
        ...prev,
        { from: "bot", text: "Here are some common questions you can ask:" },
        { from: "bot", text: "• How do I filter by price or category?" },
        { from: "bot", text: "• How do I sort products?" },
        { from: "bot", text: "• How do I find products by brand?" },
        { from: "bot", text: "• How do I see shipping info?" },
        { from: "bot", text: "• How do I return a product?" },
        { from: "bot", text: "• How do I use voice search?" },
        { from: "bot", text: "• How do I save products to favorites?" },
        { from: "bot", text: "• How do I navigate the home/dashboard?" },
        { from: "bot", text: "• How do I view my cart or checkout?" },
      ]);
    }
  };

  const closeBottomModal = () => {
    setIsBottomModalOpen(false);
    setActiveMobilePopup(null);
  };

  return (
    <div className={`flex min-h-screen bg-gradient-to-br from-[#FAF7F6] via-[#E3DED7] to-[#FAF7F6] text-[#285570] ${poppins}`}>
      {/* Sidebar with attractive rounded scrollbar */}
      <div
        className={`fixed top-0 left-0 h-screen w-64 overflow-y-auto scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-[#3CBEAC] bg-[#FAF7F6]/70 backdrop-blur-md border-r border-[#3CBEAC]/40 p-4 hidden sm:block z-50
          ${highlightFilter ? "animate-pulse border-4 border-[#3CBEAC]" : ""}
          ${highlightFavorites ? "animate-pulse border-4 border-red-500" : ""}
          ${highlightHome ? "animate-pulse border-4 border-yellow-400" : ""}
          ${highlightCart ? "animate-pulse border-4 border-green-500" : ""}
        `}
      >
        {/* Search with highlight */}
        <div
          className={`relative mb-6 flex items-center border-b border-[#3CBEAC]/60 ${
            highlightSearch ? "animate-pulse border-4 border-[#3CBEAC] rounded" : ""
          }`}
        >
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full px-2 py-1 bg-transparent text-sm text-[#285570] placeholder-[#285570]/50 focus:outline-none"
          />
          <button
            onClick={startVoiceRecognition}
            className={`ml-2 text-[#3CBEAC] hover:text-[#285570] ${
              highlightVoice ? "animate-pulse border-2 border-[#3CBEAC] rounded-full" : ""
            }`}
            title="Speak"
            ref={voiceButtonRef}
          >
            🎤
          </button>
          {showSuggestions && searchTerm && (
            <ul className="absolute bg-white text-[#285570] mt-10 w-full rounded shadow-md max-h-40 overflow-y-auto text-sm z-50">
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
        <div className={`mb-6 p-3 rounded ${highlightFilter ? "animate-pulse border-4 border-[#3CBEAC]" : ""}`}>
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
        </div>

        {/* Brands */}
        <h3 className="text-xs uppercase tracking-wider mb-2 mt-4 font-semibold border-b border-[#3CBEAC]/60">
          Brands
        </h3>
        {uniqueBrands?.map((brand) => (
          <div key={brand} className="flex items-center mb-1">
            <input
              type="radio"
              name="brand"
              onChange={() => handleBrandClick(brand)}
              className="accent-[#3CBEAC]"
            />
            <label className="ml-2 text-sm">{brand}</label>
          </div>
        ))}

        {/* Price */}
        <h3 className="text-xs uppercase tracking-wider mb-2 mt-4 font-semibold border-b border-[#3CBEAC]/50">
          Price
        </h3>
        <input
          type="text"
          placeholder="Enter max price"
          value={priceFilter}
          onChange={(e) => setPriceFilter(e.target.value)}
          className={`w-full px-2 py-1 bg-transparent border-b border-[#3CBEAC]/50 text-sm placeholder-[#285570]/50 focus:outline-none ${
            highlightPrice ? "animate-pulse border-4 border-[#3CBEAC] rounded" : ""
          }`}
          ref={priceInputRef}
        />

        {/* Sort By */}
        <div
          className={`mt-4 rounded-md ${
            highlightSort ? "animate-pulse border-4 border-[#3CBEAC] p-3 bg-[#FAF7F6]/80" : ""
          }`}
        >
          <h3 className="text-xs uppercase tracking-wider mb-2 font-semibold border-b border-[#3CBEAC]/60">
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

        {/* Favorites UI hint (needs an actual favorites UI element) */}
        <div
          className={`mt-6 flex items-center space-x-2 cursor-pointer ${
            highlightFavorites ? "animate-pulse border-4 border-red-500 rounded p-2" : ""
          }`}
          title="Favorites"
          // Implement your favorite card/click here
        >
          <FaHeart className="text-red-500 w-6 h-6" />
          <span className="text-sm font-medium">Favorites</span>
        </div>

        {/* Home UI hint (if you have a home/dashboard nav) */}
        <div
          className={`mt-4 flex items-center space-x-2 cursor-pointer ${
            highlightHome ? "animate-pulse border-4 border-yellow-400 rounded p-2" : ""
          }`}
          title="Home"
          // Implement home navigation here if needed
        >
          <FaHome className="text-yellow-400 w-6 h-6" />
          <span className="text-sm font-medium">Home</span>
        </div>

        {/* Cart UI hint (if you have a cart nav) */}
        <div
          className={`mt-4 flex items-center space-x-2 cursor-pointer ${
            highlightCart ? "animate-pulse border-4 border-green-500 rounded p-2" : ""
          }`}
          title="Cart"
          // Implement cart navigation here if needed
        >
          <FaShoppingCart className="text-green-500 w-6 h-6" />
          <span className="text-sm font-medium">Cart</span>
        </div>
      </div>

      {/* Products Section */}
      <div className="sm:ml-64 flex-1 p-6">
        <h2 className="text-center text-lg font-semibold mb-4">{products?.length} Products Found</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.length === 0 ? <Loader /> : products.map((p) => <ProductCard key={p._id} p={p} />)}
        </div>
      </div>

      {/* AI Assistant */}
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
              <div className="bg-[#1E3A5F] px-4 py-2 flex justify-between items-center border-b border-[#3CBEAC]/30">
                <span className="font-semibold text-sm">AI Shopping Assistant</span>
                <button
                  onClick={handleHelpClick}
                  className="text-sm cursor-pointer px-2 py-1 rounded hover:bg-[#3CBEAC] bg-[#285570]"
                  aria-label="Show Help"
                >
                  Help
                </button>
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
    </div>
  );
};

export default Shop;
