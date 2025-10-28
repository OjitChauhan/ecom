import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  useGetProductDetailsQuery,
  useCreateReviewMutation,
} from "../../redux/api/productApiSlice";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import {
  FaBox,
  FaClock,
  FaShoppingCart,
  FaStar,
  FaStore,
} from "react-icons/fa";
import moment from "moment";
import HeartIcon from "./HeartIcon";
import Ratings from "./Ratings";
import ProductTabs from "./ProductTabs";
import { addToCart } from "../../redux/features/cart/cartSlice";

const ProductDetails = () => {
  const { id: productId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const {
    data: product,
    isLoading,
    refetch,
    error,
  } = useGetProductDetailsQuery(productId);

  const { userInfo } = useSelector((state) => state.auth);

  const [createReview, { isLoading: loadingProductReview }] =
    useCreateReviewMutation();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await createReview({
        productId,
        rating,
        comment,
      }).unwrap();
      refetch();
      toast.success("Review created successfully");
    } catch (error) {
      toast.error(error?.data || error.message);
    }
  };

  const addToCartHandler = () => {
    dispatch(addToCart({ ...product, qty }));
    navigate("/cart");
  };

  return (
    <>
      <div className="max-w-[1200px] mx-auto px-4 md:px-8 py-8">
        <Link
          to="/"
          className="text-[#3CBEAC] font-semibold hover:underline inline-block mb-6"
        >
          ← Go Back
        </Link>

        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">
            {error?.data?.message || error.message}
          </Message>
        ) : (
          <>
            {/* Product Section */}
            <div className="flex flex-col lg:flex-row items-center lg:items-start justify-center gap-10 bg-white shadow-md rounded-2xl p-6 md:p-8">
              {/* Image Section */}
              <div className="bg-[#FAF7F6] rounded-xl p-4 shadow-md relative w-full max-w-sm sm:max-w-md">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full rounded-xl object-cover"
                />
                <div className="absolute top-4 right-4">
                  <HeartIcon product={product} />
                </div>
              </div>

              {/* Product Info */}
              <div className="flex flex-col justify-between w-full max-w-lg text-[#285570]">
                <h2 className="text-2xl sm:text-3xl font-extrabold mb-3 text-center lg:text-left">
                  {product.name}
                </h2>

                {/* ✅ Fixed description overflow */}
                <p className="text-base opacity-80 mb-5 text-center lg:text-left leading-relaxed break-words whitespace-normal overflow-hidden text-ellipsis">
                  {product.description}
                </p>

                <span className="text-3xl sm:text-4xl font-black text-[#3CBEAC] mb-5 text-center lg:text-left">
                  ${product.price}
                </span>

                {/* Product Stats */}
                <div className="grid grid-cols-2 gap-4 text-sm sm:text-base mb-6">
                  <div className="flex flex-col gap-2">
                    <span className="flex items-center gap-2">
                      <FaStore className="text-[#3CBEAC]" /> {product.brand}
                    </span>
                    <span className="flex items-center gap-2">
                      <FaClock className="text-[#EFAF76]" />
                      Added: {moment(product.createAt).fromNow()}
                    </span>
                    <span className="flex items-center gap-2">
                      <FaStar className="text-[#EFAF76]" />
                      Reviews: {product.numReviews}
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="flex items-center gap-2">
                      <FaStar className="text-[#EFAF76]" />
                      Rating: {product.rating}
                    </span>
                    <span className="flex items-center gap-2">
                      <FaShoppingCart className="text-[#3CBEAC]" />
                      Quantity: {product.quantity}
                    </span>
                    <span className="flex items-center gap-2">
                      <FaBox className="text-[#3CBEAC]" />
                      In Stock: {product.countInStock}
                    </span>
                  </div>
                </div>

                {/* Ratings and Quantity */}
                <div className="flex flex-wrap justify-center lg:justify-start items-center gap-4 mb-4">
                  <Ratings
                    value={product.rating}
                    text={`${product.numReviews} reviews`}
                  />
                  {product.countInStock > 0 && (
                    <select
                      value={qty}
                      onChange={(e) => setQty(Number(e.target.value))}
                      className="p-2 w-[6rem] rounded-lg border border-[#3CBEAC] text-[#285570]"
                    >
                      {[...Array(product.countInStock).keys()].map((x) => (
                        <option key={x + 1} value={x + 1}>
                          {x + 1}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={addToCartHandler}
                  disabled={product.countInStock === 0}
                  className={`w-full md:w-auto mx-auto lg:mx-0 py-3 px-10 rounded-xl font-semibold text-lg shadow-md transition
                    ${
                      product.countInStock === 0
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : "bg-[#EFAF76] text-[#285570] hover:bg-[#3CBEAC] hover:text-white"
                    }`}
                >
                  Add To Cart
                </button>
              </div>
            </div>

            {/* Tabs / Reviews Section */}
            <div className="mt-10">
              <ProductTabs
                loadingProductReview={loadingProductReview}
                userInfo={userInfo}
                submitHandler={submitHandler}
                rating={rating}
                setRating={setRating}
                comment={comment}
                setComment={setComment}
                product={product}
              />
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default ProductDetails;
