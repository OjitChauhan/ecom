import { Link } from "react-router-dom";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/features/cart/cartSlice";
import { toast } from "react-toastify";
import HeartIcon from "./HeartIcon";

const ProductCard = ({ p }) => {
  const dispatch = useDispatch();

  const addToCartHandler = (product, qty) => {
    dispatch(addToCart({ ...product, qty }));
    toast.success("Item added successfully", {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 2000,
    });
  };

  return (
    <div className="bg-[#FAF7F6] rounded-xl shadow-lg border border-[#E3DED7] overflow-hidden transition hover:shadow-xl flex flex-col sm:flex-row max-w-md w-full">
      {/* Left image & badges */}
      <div className="relative sm:w-1/2 w-full bg-gradient-to-tr from-[#E3DED7] to-[#3CBEAC] flex items-center justify-center p-4">
        <Link to={`/product/${p._id}`} className="w-full flex justify-center">
          <img
            src={p.image}
            alt={p.name}
            className="rounded-lg shadow-lg object-contain w-full h-48 sm:h-52 md:h-56"
          />
        </Link>

        {/* Heart icon */}
        <div className="absolute top-3 right-4">
          <HeartIcon product={p} />
        </div>

        {/* Brand badge */}
        <span className="absolute bottom-3 right-4 bg-[#EFAF76] text-[#285570] text-xs font-semibold px-3 py-1 rounded-full shadow">
          {p?.brand}
        </span>
      </div>

      {/* Right side info */}
      <div className="sm:w-1/2 w-full flex flex-col justify-between px-4 py-5 space-y-3 text-center sm:text-left">
        <Link to={`/product/${p._id}`}>
          <h5 className="text-lg font-bold text-[#285570] line-clamp-2">
            {p?.name}
          </h5>
        </Link>

        <div className="text-xl font-semibold text-[#285570]">
          {p?.price?.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
          })}
        </div>

        <p className="text-[#333333] text-sm leading-relaxed line-clamp-2">
          {p?.description?.substring(0, 60)}...
        </p>

        <div className="flex justify-center sm:justify-between items-center pt-2">
          <Link
            to={`/product/${p._id}`}
            className="inline-flex items-center px-4 py-2 text-sm font-semibold text-white bg-[#285570] rounded-lg shadow-md hover:bg-[#3CBEAC] transition"
          >
            Read More
            <svg
              className="w-3.5 h-3.5 ml-2"
              aria-hidden="true"
              fill="none"
              viewBox="0 0 14 10"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M1 5h12m0 0L9 1m4 4L9 9"
              />
            </svg>
          </Link>

          <button
            className="p-2 rounded-full bg-[#EFAF76] hover:bg-[#3CBEAC] transition shadow ml-4"
            onClick={() => addToCartHandler(p, 1)}
            aria-label="Add to Cart"
          >
            <AiOutlineShoppingCart size={22} className="text-[#285570]" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
