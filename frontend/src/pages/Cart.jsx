import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaTrash } from "react-icons/fa";
import { addToCart, removeFromCart } from "../redux/features/cart/cartSlice";

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  const addToCartHandler = (product, qty) => {
    dispatch(addToCart({ ...product, qty }));
  };

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  };

  const checkoutHandler = () => {
    navigate("/login?redirect=/shipping");
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-10 mt-8 min-h-screen">
      {cartItems.length === 0 ? (
        <div className="text-center text-xl text-[#285570]">
          Your cart is empty.{" "}
          <Link to="/shop" className="text-[#3CBEAC] hover:underline">
            Go To Shop
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left section - cart items */}
          <div className="flex-1">
            <h1 className="text-2xl font-semibold mb-6 text-[#285570]">
              Shopping Cart
            </h1>

            <div className="space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item._id}
                  className="flex flex-col sm:flex-row items-center sm:items-start gap-4 border rounded-lg p-4 bg-white shadow hover:shadow-lg transition-all"
                >
                  {/* Product Image */}
                  <div className="w-28 h-28 flex items-center justify-center bg-[#FAF7F6] rounded-lg border border-[#E3DED7]">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="object-contain w-full h-full rounded-md"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 text-center sm:text-left">
                    <Link
                      to={`/product/${item._id}`}
                      className="text-[#3CBEAC] font-semibold hover:underline text-lg block"
                    >
                      {item.name}
                    </Link>
                    <p className="text-[#285570] text-sm">{item.brand}</p>
                    <p className="font-bold text-[#285570] text-lg mt-1">
                      ${item.price}
                    </p>
                  </div>

                  {/* Quantity & Remove */}
                  <div className="flex items-center gap-3">
                    <select
                      className="w-20 p-2 border rounded text-[#285570] bg-white"
                      value={item.qty}
                      onChange={(e) =>
                        addToCartHandler(item, Number(e.target.value))
                      }
                    >
                      {[...Array(item.countInStock).keys()].map((x) => (
                        <option key={x + 1} value={x + 1}>
                          {x + 1}
                        </option>
                      ))}
                    </select>

                    <button
                      className="text-red-600 hover:text-red-700 p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-red-400"
                      onClick={() => removeFromCartHandler(item._id)}
                      aria-label={`Remove ${item.name} from cart`}
                    >
                      <FaTrash size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right section - summary */}
          <div className="w-full lg:w-1/3 bg-white rounded-lg shadow p-6 flex flex-col mt-6 lg:mt-0">
            <h2 className="text-xl font-semibold mb-4 text-[#285570]">
              Order Summary
            </h2>

            <p className="mb-2 text-[#333333] font-semibold">
              Items:{" "}
              <span className="text-[#3CBEAC]">
                {cartItems.reduce((acc, item) => acc + item.qty, 0)}
              </span>
            </p>

            <p className="text-2xl font-bold mb-6 text-[#285570]">
              Total: $
              {cartItems
                .reduce((acc, item) => acc + item.qty * item.price, 0)
                .toFixed(2)}
            </p>

            <button
              className="w-full bg-gradient-to-r from-[#EFAF76] to-[#3CBEAC] text-[#285570] font-bold py-3 rounded-lg shadow-lg hover:from-[#3CBEAC] hover:to-[#285570] hover:text-white transition transform hover:scale-105"
              disabled={cartItems.length === 0}
              onClick={checkoutHandler}
            >
              Proceed To Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
