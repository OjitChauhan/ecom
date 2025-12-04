import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaTrash } from "react-icons/fa";
import { addToCart, removeFromCart } from "../redux/features/cart/cartSlice";
import { setBudget, addTransaction, resetBudget } from "../redux/features/budget/budgetSlice";
import { useFetchCategoriesQuery } from "../redux/api/categoryApiSlice";

// Theme colors
const THEME = {
  deepTeal: "#285570",
  softBeige: "#E3DED7",
  warmCream: "#FAF7F6",
  vibrantAqua: "#3CBEAC",
  charcoalGray: "#333333",
};

const BudgetTracker = () => {
  const dispatch = useDispatch();
  const { data: categoriesData } = useFetchCategoriesQuery();

  const categories = categoriesData?.map(c => c.name) || ["Other", "Food", "Travel", "Shopping", "Bills"];
  const budget = useSelector(state => state.budget.budget);
  const transactions = useSelector(state => state.budget.transactions);

  const [isEditing, setIsEditing] = useState(false);
  const [inputBudget, setInputBudget] = useState(budget);
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState(categories[0] || "Other");
  const [description, setDescription] = useState("");
  const [filterCategory, setFilterCategory] = useState(null);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    if (categories.length > 0) setCategory(categories[0]);
  }, [categories]);

  useEffect(() => {
    setInputBudget(budget);
  }, [budget]);

  const spent = transactions.reduce((acc, t) => acc + Number(t.amount), 0);
  const remaining = budget - spent;
  const percentUsed = budget ? Math.round((spent / budget) * 100) : 0;

  const filteredTransactions = filterCategory
    ? transactions.filter(tx => tx.category === filterCategory)
    : transactions;

  const handleAddTransaction = () => {
    if (!amount || isNaN(amount) || amount <= 0) {
      alert("Please enter a valid amount");
      return;
    }
    dispatch(
      addTransaction({
        id: Date.now(),
        amount: Number(amount),
        category,
        description,
      })
    );
    setAmount("");
    setCategory(categories[0]);
    setDescription("");
  };

  const handleEditBudget = () => {
    if (!inputBudget || isNaN(inputBudget) || Number(inputBudget) < 0) {
      alert("Please enter a valid budget amount");
      return;
    }
    dispatch(setBudget(Number(inputBudget)));
    setIsEditing(false);
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset the budget and all transactions?")) {
      dispatch(resetBudget());
      setFilterCategory(null);
      setShowHistory(false);
      setIsEditing(false);
      setInputBudget(0);
    }
  };

  const handleDownloadCSV = () => {
    if (transactions.length === 0) {
      alert("No transactions to download");
      return;
    }

    const headers = "Date,Amount,Category,Description,Items Purchased\n";
    const rows = transactions.map(t =>
      `${new Date(t.id).toLocaleDateString()},${t.amount},${t.category},"${t.description || ''}","${t.itemsPurchased?.join('; ') || ''}"`
    ).join("\n");

    const csvContent = "data:text/csv;charset=utf-8," + encodeURIComponent(headers + rows);
    const anchor = document.createElement("a");
    anchor.setAttribute("href", csvContent);
    anchor.setAttribute("download", `transactions_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
  };

  return (
    <div
      className="rounded-2xl shadow-lg p-6 max-w-2xl mx-auto mb-12 transition-all"
      style={{ backgroundColor: THEME.warmCream }}
    >
      <h2
        className="text-3xl mb-6 font-bold"
        style={{ color: THEME.deepTeal }}
      >
        💰 Budget Tracker
      </h2>

      {/* Budget Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="p-4 rounded-lg" style={{ backgroundColor: "#ffffff", borderLeft: `4px solid ${THEME.deepTeal}` }}>
          <p className="text-sm font-medium" style={{ color: THEME.charcoalGray }}>
            Total Budget
          </p>
          <p className="text-xl font-bold" style={{ color: THEME.deepTeal }}>
            ₹{budget}
          </p>
        </div>

        <div className="p-4 rounded-lg" style={{ backgroundColor: "#ffffff", borderLeft: `4px solid ${THEME.vibrantAqua}` }}>
          <p className="text-sm font-medium" style={{ color: THEME.charcoalGray }}>
            Spent
          </p>
          <p className="text-xl font-bold" style={{ color: THEME.vibrantAqua }}>
            ₹{spent}
          </p>
        </div>

        <div className="p-4 rounded-lg" style={{ backgroundColor: "#ffffff", borderLeft: `4px solid ${percentUsed > 80 ? "#EF4444" : "#10B981"}` }}>
          <p className="text-sm font-medium" style={{ color: THEME.charcoalGray }}>
            Remaining
          </p>
          <p className="text-xl font-bold" style={{ color: remaining < 0 ? "#EF4444" : "#10B981" }}>
            ₹{remaining}
          </p>
        </div>

        <div className="p-4 rounded-lg" style={{ backgroundColor: "#ffffff", borderLeft: `4px solid ${percentUsed > 80 ? "#EF4444" : THEME.deepTeal}` }}>
          <p className="text-sm font-medium" style={{ color: THEME.charcoalGray }}>
            Used
          </p>
          <p className="text-xl font-bold" style={{ color: percentUsed > 80 ? "#EF4444" : THEME.deepTeal }}>
            {percentUsed}%
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <p className="font-semibold" style={{ color: THEME.deepTeal }}>
            Budget Progress
          </p>
          <p className="text-sm font-medium" style={{ color: THEME.charcoalGray }}>
            ₹{spent} / ₹{budget}
          </p>
        </div>
        <div className="w-full h-4 rounded-full overflow-hidden" style={{ backgroundColor: THEME.softBeige }}>
          <div
            className="h-full transition-all duration-300 rounded-full"
            style={{
              width: `${Math.min(percentUsed, 100)}%`,
              backgroundColor: percentUsed > 100 ? "#EF4444" : percentUsed > 80 ? "#F97316" : THEME.vibrantAqua,
            }}
          />
        </div>
        {remaining < 0 && (
          <p className="text-sm font-semibold mt-2" style={{ color: "#EF4444" }}>
            ⚠️ Budget exceeded by ₹{Math.abs(remaining)}
          </p>
        )}
      </div>

      {/* Category Filter Buttons */}
      <div className="mb-6">
        <p className="font-semibold mb-3" style={{ color: THEME.deepTeal }}>
          Filter by Category
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            className="px-4 py-2 rounded-full cursor-pointer font-medium transition-all transform hover:scale-105"
            style={{
              backgroundColor: filterCategory === null ? THEME.deepTeal : THEME.softBeige,
              color: filterCategory === null ? "#ffffff" : THEME.deepTeal,
            }}
            onClick={() => setFilterCategory(null)}
          >
            All
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              className="px-4 py-2 rounded-full cursor-pointer font-medium transition-all transform hover:scale-105"
              style={{
                backgroundColor: filterCategory === cat ? THEME.vibrantAqua : THEME.softBeige,
                color: filterCategory === cat ? "#ffffff" : THEME.charcoalGray,
              }}
              onClick={() => setFilterCategory(filterCategory === cat ? null : cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          className="px-4 py-2 rounded-lg text-white font-medium transition-all transform hover:scale-105"
          style={{ backgroundColor: THEME.deepTeal }}
          onClick={() => setShowHistory(!showHistory)}
        >
          {showHistory ? "📊 Hide History" : "📊 Show History"}
        </button>
        <button
          className="px-4 py-2 rounded-lg text-white font-medium transition-all transform hover:scale-105"
          style={{ backgroundColor: THEME.vibrantAqua }}
          onClick={handleDownloadCSV}
        >
          📥 Download CSV
        </button>
        <button
          className="px-4 py-2 rounded-lg text-white font-medium transition-all transform hover:scale-105 ml-auto"
          style={{ backgroundColor: "#EF4444" }}
          onClick={handleReset}
        >
          🔄 Reset All
        </button>
      </div>

      {/* Transaction History */}
      {showHistory && (
        <div
          className="mb-6 max-h-64 overflow-y-auto rounded-lg p-4 shadow-inner"
          style={{ backgroundColor: THEME.softBeige }}
        >
          <h3 className="font-bold mb-3 text-lg" style={{ color: THEME.deepTeal }}>
            Transaction History
          </h3>
          {transactions.length === 0 ? (
            <p style={{ color: THEME.charcoalGray }}>No transactions recorded</p>
          ) : (
            <div className="space-y-2">
              {transactions.map(tx => (
                <div
                  key={tx.id}
                  className="p-3 rounded-lg"
                  style={{ backgroundColor: "#ffffff", borderLeft: `3px solid ${THEME.vibrantAqua}` }}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-semibold" style={{ color: THEME.deepTeal }}>
                        ₹{tx.amount} - {tx.category}
                      </p>
                      {tx.description && (
                        <p className="text-sm" style={{ color: THEME.charcoalGray }}>
                          {tx.description}
                        </p>
                      )}
                      {tx.itemsPurchased && tx.itemsPurchased.length > 0 && (
                        <div className="text-xs mt-2" style={{ color: THEME.charcoalGray }}>
                          <p className="font-medium">Items:</p>
                          <ul className="list-disc ml-5">
                            {tx.itemsPurchased.map((item, idx) => (
                              <li key={idx}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                    <p className="text-xs font-medium" style={{ color: THEME.charcoalGray }}>
                      {new Date(tx.id).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Budget Edit Section */}
      <div className="mb-6 p-4 rounded-lg" style={{ backgroundColor: "#ffffff", border: `1px solid ${THEME.softBeige}` }}>
        <h3 className="font-semibold mb-3" style={{ color: THEME.deepTeal }}>
          💵 Manage Budget
        </h3>
        {isEditing ? (
          <div className="flex gap-2">
            <input
              type="number"
              className="p-3 flex-1 rounded-lg focus:outline-none transition-all"
              style={{
                backgroundColor: THEME.warmCream,
                color: THEME.deepTeal,
                border: `2px solid ${THEME.vibrantAqua}`,
              }}
              value={inputBudget}
              onChange={e => setInputBudget(e.target.value)}
              min={0}
              placeholder="Enter budget amount"
            />
            <button
              className="px-6 py-3 rounded-lg text-white font-medium transition-all transform hover:scale-105"
              style={{ backgroundColor: "#10B981" }}
              onClick={handleEditBudget}
            >
              ✓ Save
            </button>
            <button
              className="px-6 py-3 rounded-lg text-white font-medium transition-all transform hover:scale-105"
              style={{ backgroundColor: THEME.charcoalGray }}
              onClick={() => {
                setIsEditing(false);
                setInputBudget(budget);
              }}
            >
              ✕ Cancel
            </button>
          </div>
        ) : (
          <button
            className="w-full px-6 py-3 rounded-lg text-white font-medium transition-all transform hover:scale-105"
            style={{ backgroundColor: THEME.deepTeal }}
            onClick={() => setIsEditing(true)}
          >
            ✏️ Edit Budget (Current: ₹{budget})
          </button>
        )}
      </div>

      {/* Add Transaction Section */}
      <div className="p-4 rounded-lg" style={{ backgroundColor: "#ffffff", border: `1px solid ${THEME.softBeige}` }}>
        <h3 className="font-semibold mb-4" style={{ color: THEME.deepTeal }}>
          ➕ Add New Transaction
        </h3>
        <div className="space-y-3">
          <div className="flex gap-2 flex-col md:flex-row">
            <input
              type="number"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              placeholder="Amount (₹)"
              className="p-3 rounded-lg flex-1 focus:outline-none transition-all"
              style={{
                backgroundColor: THEME.warmCream,
                color: THEME.deepTeal,
                border: `1px solid ${THEME.softBeige}`,
              }}
              min={0}
            />
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="p-3 rounded-lg font-medium transition-all"
              style={{
                backgroundColor: THEME.vibrantAqua,
                color: "#ffffff",
                border: "none",
              }}
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <input
            type="text"
            placeholder="Description (optional)"
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="w-full p-3 rounded-lg focus:outline-none transition-all"
            style={{
              backgroundColor: THEME.warmCream,
              color: THEME.deepTeal,
              border: `1px solid ${THEME.softBeige}`,
            }}
          />
          <button
            className="w-full px-5 py-3 rounded-lg text-white font-bold transition-all transform hover:scale-105"
            style={{
              background: `linear-gradient(135deg, ${THEME.vibrantAqua} 0%, ${THEME.deepTeal} 100%)`,
            }}
            onClick={handleAddTransaction}
          >
            ➕ Add Transaction
          </button>
        </div>
      </div>

      {/* Recent Transactions */}
      {filteredTransactions.length > 0 && !showHistory && (
        <div className="mt-6 p-4 rounded-lg" style={{ backgroundColor: THEME.softBeige }}>
          <h3 className="font-semibold mb-3" style={{ color: THEME.deepTeal }}>
            📋 Recent Transactions
          </h3>
          <div className="space-y-2">
            {filteredTransactions.slice(-5).reverse().map(tx => (
              <div
                key={tx.id}
                className="p-3 rounded-lg flex justify-between items-center"
                style={{ backgroundColor: "#ffffff" }}
              >
                <div>
                  <p className="font-medium" style={{ color: THEME.deepTeal }}>
                    {tx.category}
                  </p>
                  {tx.description && (
                    <p className="text-sm" style={{ color: THEME.charcoalGray }}>
                      {tx.description}
                    </p>
                  )}
                </div>
                <p className="font-bold text-lg" style={{ color: THEME.vibrantAqua }}>
                  ₹{tx.amount}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cart = useSelector((state) => state.cart);
  const budget = useSelector((state) => state.budget.budget);
  const transactions = useSelector((state) => state.budget.transactions);

  const { cartItems } = cart;

  const [showBudgetExceeded, setShowBudgetExceeded] = useState(false);
  const [exceedAmount, setExceedAmount] = useState(0);

  const spent = transactions.reduce((acc, t) => acc + Number(t.amount), 0);
  const remainingBudget = budget - spent;

  const addToCartHandler = (product, qty) => {
    const newCost = qty * product.price;
    if (newCost > remainingBudget) {
      setExceedAmount(newCost - remainingBudget);
      setShowBudgetExceeded(true);
      return;
    }
    dispatch(addToCart({ ...product, qty }));
  };

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  };

  const checkoutHandler = () => {
    const itemsByCategory = cartItems.reduce((acc, item) => {
      if (!acc[item.category]) acc[item.category] = [];
      acc[item.category].push(item.name);
      return acc;
    }, {});

    Object.entries(itemsByCategory).forEach(([category, products]) => {
      const amount = cartItems
        .filter((i) => i.category === category)
        .reduce((a, c) => a + c.qty * c.price, 0);

      dispatch(
        addTransaction({
          id: Date.now() + Math.random(),
          amount,
          category,
          description: "Checkout purchase",
          itemsPurchased: products,
        })
      );
    });

    navigate("/login?redirect=/shipping");
  };

  const cartTotal = cartItems.reduce((acc, item) => acc + item.qty * item.price, 0);
  const cartItemCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#fafafa" }}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-10 mt-8 pb-12">
        {/* Budget Exceeded Modal */}
        {showBudgetExceeded && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 p-4">
            <div
              className="rounded-2xl p-8 max-w-sm text-center shadow-2xl transform transition-all"
              style={{ backgroundColor: THEME.warmCream }}
            >
              <div className="text-4xl mb-4">⚠️</div>
              <p className="mb-2 font-bold text-xl" style={{ color: "#EF4444" }}>
                Budget Limit Exceeded!
              </p>
              <p className="mb-4 font-medium" style={{ color: THEME.charcoalGray }}>
                You need ₹{exceedAmount.toFixed(2)} more to add this product.
              </p>
              <p className="text-sm mb-6" style={{ color: THEME.deepTeal }}>
                Current Budget: ₹{budget} | Spent: ₹{spent} | Remaining: ₹{remainingBudget}
              </p>
              <div className="flex gap-3">
                <button
                  className="flex-1 text-white rounded-lg px-6 py-3 font-bold transition-all transform hover:scale-105"
                  style={{ backgroundColor: THEME.deepTeal }}
                  onClick={() => setShowBudgetExceeded(false)}
                >
                  Close
                </button>
                <button
                  className="flex-1 rounded-lg px-6 py-3 font-bold transition-all transform hover:scale-105"
                  style={{ backgroundColor: THEME.softBeige, color: THEME.deepTeal }}
                  onClick={() => {
                    setShowBudgetExceeded(false);
                    navigate("/cart");
                  }}
                >
                  Update Budget
                </button>
              </div>
            </div>
          </div>
        )}

        {cartItems.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🛒</div>
            <p className="text-2xl font-bold mb-2" style={{ color: THEME.deepTeal }}>
              Your cart is empty
            </p>
            <p className="mb-6 font-medium" style={{ color: THEME.charcoalGray }}>
              Explore our products and add items to your cart.
            </p>
            <Link
              to="/shop"
              className="inline-block px-8 py-3 rounded-lg text-white font-bold transition-all transform hover:scale-105"
              style={{
                background: `linear-gradient(135deg, ${THEME.vibrantAqua} 0%, ${THEME.deepTeal} 100%)`,
              }}
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Cart Item List */}
            <div className="flex-1">
              <div className="mb-6">
                <h1 className="text-4xl font-bold" style={{ color: THEME.deepTeal }}>
                  🛍️ Shopping Cart
                </h1>
                <p className="text-sm font-medium mt-1" style={{ color: THEME.charcoalGray }}>
                  {cartItems.length} item{cartItems.length !== 1 ? "s" : ""} in your cart
                </p>
              </div>

              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item._id}
                    className="flex flex-col sm:flex-row items-center sm:items-start gap-4 border rounded-2xl p-4 shadow-md hover:shadow-xl transition-all"
                    style={{ backgroundColor: THEME.warmCream, borderColor: THEME.softBeige }}
                  >
                    {/* Product Image */}
                    <div
                      className="w-32 h-32 flex-shrink-0 flex items-center justify-center rounded-xl border-2"
                      style={{ backgroundColor: "#ffffff", borderColor: THEME.softBeige }}
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="object-contain w-full h-full p-2 rounded-lg"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 text-center sm:text-left w-full ">
                      <Link
                        to={`/product/${item._id}`}
                        className="font-bold text-lg hover:underline transition-colors block mb-1"
                        style={{ color: THEME.vibrantAqua }}
                      >
                        {item.name}
                      </Link>
                      <p className="text-sm font-medium mb-2" style={{ color: THEME.charcoalGray }}>
                        Brand: {item.brand}
                      </p>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                        <div>
                          <p className="text-2xl font-bold" style={{ color: THEME.deepTeal }}>
                            ₹{item.price}
                          </p>
                          <p className="text-xs font-medium" style={{ color: THEME.charcoalGray }}>
                            per unit
                          </p>
                        </div>
                        <div className="text-sm font-semibold" style={{ color: THEME.vibrantAqua }}>
                          Subtotal: ₹{(item.qty * item.price).toFixed(2)}
                        </div>
                      </div>
                    </div>

                    {/* Quantity & Delete */}
                    <div className="flex items-center gap-4 flex-shrink-0">
                      <div className="flex flex-col items-center">
                        <label className="text-xs font-medium mb-1" style={{ color: THEME.charcoalGray }}>
                          Qty
                        </label>
                        <select
                          className="p-2 border-2 rounded-lg font-bold"
                          style={{
                            backgroundColor: "#ffffff",
                            color: THEME.deepTeal,
                            borderColor: THEME.softBeige,
                          }}
                          value={item.qty}
                          onChange={(e) => addToCartHandler(item, Number(e.target.value))}
                        >
                          {[...Array(Math.min(item.countInStock, 10)).keys()].map((x) => (
                            <option key={x + 1} value={x + 1}>
                              {x + 1}
                            </option>
                          ))}
                        </select>
                      </div>
                      <button
                        className="p-3 rounded-full transition-all transform hover:scale-110"
                        style={{ color: "#EF4444", backgroundColor: "#FFE8E8" }}
                        onClick={() => removeFromCartHandler(item._id)}
                        aria-label={`Remove ${item.name} from cart`}
                        title="Remove from cart"
                      >
                        <FaTrash size={20} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary Sidebar */}
            <div className="w-full lg:w-96">
              <div
                className="rounded-2xl shadow-lg p-6 sticky top-8 transition-all"
                style={{ backgroundColor: THEME.warmCream }}
              >
                <h2 className="text-2xl font-bold mb-6" style={{ color: THEME.deepTeal }}>
                  📋 Order Summary
                </h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between font-semibold">
                    <span style={{ color: THEME.charcoalGray }}>Items:</span>
                    <span style={{ color: THEME.deepTeal }}>{cartItemCount}</span>
                  </div>

                  <div className="flex justify-between font-semibold">
                    <span style={{ color: THEME.charcoalGray }}>Subtotal:</span>
                    <span style={{ color: THEME.deepTeal }}>
                      ₹{cartTotal.toFixed(2)}
                    </span>
                  </div>

                  <div
                    className="h-px"
                    style={{ backgroundColor: THEME.softBeige }}
                  />
                </div>

                {/* Budget Info */}
                <div
                  className="p-4 rounded-xl mb-6 border-l-4"
                  style={{
                    backgroundColor: THEME.softBeige,
                    borderColor: remainingBudget >= cartTotal ? THEME.vibrantAqua : "#EF4444",
                  }}
                >
                  <p className="text-xs font-medium mb-2" style={{ color: THEME.charcoalGray }}>
                    💰 Budget Info
                  </p>
                  <div className="space-y-1">
                    <p className="text-sm" style={{ color: THEME.charcoalGray }}>
                      Remaining:{" "}
                      <span className="font-bold" style={{ color: remainingBudget >= cartTotal ? THEME.vibrantAqua : "#EF4444" }}>
                        ₹{remainingBudget}
                      </span>
                    </p>
                    <p className="text-sm" style={{ color: THEME.charcoalGray }}>
                      Cart Total: <span className="font-bold" style={{ color: THEME.deepTeal }}>₹{cartTotal.toFixed(2)}</span>
                    </p>
                    {remainingBudget < cartTotal && (
                      <p className="text-xs font-semibold mt-2" style={{ color: "#EF4444" }}>
                        ⚠️ Exceeds budget
                      </p>
                    )}
                  </div>
                </div>

                <button
                  className="w-full font-bold py-4 rounded-xl shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed text-white text-lg"
                  style={{
                    background: `linear-gradient(135deg, ${THEME.vibrantAqua} 0%, ${THEME.deepTeal} 100%)`,
                  }}
                  disabled={cartItems.length === 0 || remainingBudget < cartTotal}
                  onClick={checkoutHandler}
                >
                  ✓ Proceed To Checkout
                </button>

                <Link
                  to="/shop"
                  className="w-full block text-center py-3 rounded-xl mt-3 font-semibold transition-all transform hover:scale-105"
                  style={{
                    backgroundColor: THEME.softBeige,
                    color: THEME.deepTeal,
                  }}
                >
                  ← Continue Shopping
                </Link>

                {remainingBudget < cartTotal && (
                  <div
                    className="mt-4 p-3 rounded-lg text-center text-sm font-semibold"
                    style={{ backgroundColor: "#FFE8E8", color: "#EF4444" }}
                  >
                    Please increase your budget or remove items
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Budget Tracker Section */}
      <div className="mt-12">
        <BudgetTracker />
      </div>
    </div>
  );
};

export default Cart;
