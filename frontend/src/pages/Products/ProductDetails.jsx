import React, { useState, useEffect } from "react";
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

import Sentiment from "sentiment";

import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const COLORS = {
  deepTeal: "#285570",
  vibrantAqua: "#3CBEAC",
  golden: "#EFAF76",
  darkGolden: "#DDAA33",
  charcoalGray: "#333333",
  warmCream: "#FAF7F6",
  white: "#ffffff",
};

const sentimentAnalyzer = new Sentiment();

const ProductDetails = () => {
  const { id: productId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const { data: product, isLoading, refetch, error } = useGetProductDetailsQuery(productId);

  const { userInfo } = useSelector((state) => state.auth);

  const [createReview, { isLoading: loadingProductReview }] = useCreateReviewMutation();

  const [productReviews, setProductReviews] = useState([]);
  const [sentimentChartData, setSentimentChartData] = useState(null);
  const [sentimentSegments, setSentimentSegments] = useState(null);
  const [showChartModal, setShowChartModal] = useState(false);

  useEffect(() => {
    if (product && product.reviews && product.reviews.length > 0) {
      setProductReviews(product.reviews);

      // Analyze sentiments on comment text
      const sentimentScores = product.reviews.map(r => {
        const text = r.comment || "";
        return sentimentAnalyzer.analyze(text).score;
      });

      // Define bins for score distribution (5 bins)
      const bins = [0, 0, 0, 0, 0]; // Negative, Slightly Negative, Neutral, Slightly Positive, Positive
      sentimentScores.forEach(score => {
        if (score < -1) bins[0]++;
        else if (score >= -1 && score < 0) bins[1]++;
        else if (score === 0) bins[2]++;
        else if (score > 0 && score <= 1) bins[3]++;
        else bins[4]++;
      });

      const labels = [
        "Negative (< -1)",
        "Slightly Negative (-1 to 0)",
        "Neutral (0)",
        "Slightly Positive (0 to 1)",
        "Positive (> 1)",
      ];

      setSentimentChartData({
        labels,
        datasets: [
          {
            label: "Sentiment Score Distribution",
            backgroundColor: COLORS.vibrantAqua,
            borderColor: COLORS.deepTeal,
            borderWidth: 1,
            data: bins,
          }
        ]
      });

      setSentimentSegments({
        Negative: bins[0],
        "Slightly Negative": bins[1],
        Neutral: bins[2],
        "Slightly Positive": bins[3],
        Positive: bins[4],
      });
    }
  }, [product]);

  const submitHandler = async e => {
    e.preventDefault();
    try {
      await createReview({ productId, rating, comment }).unwrap();
      refetch();
      toast.success("Review created successfully");
      setRating(0);
      setComment("");
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
        <Link to="/" className="text-[#3CBEAC] font-semibold hover:underline inline-block mb-6">
          ← Go Back
        </Link>

        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error?.data?.message || error.message}</Message>
        ) : (
          <>
            <div
              className="flex flex-col lg:flex-row items-center lg:items-start justify-center gap-10 bg-white shadow-md rounded-2xl p-6 md:p-8"
              style={{ backgroundColor: COLORS.white }}
            >
              <div
                className="rounded-xl p-4 shadow-md relative w-full max-w-sm sm:max-w-md"
                style={{ backgroundColor: COLORS.warmCream }}
              >
                <img src={product.image} alt={product.name} className="w-full rounded-xl object-cover" />
                <div className="absolute top-4 right-4">
                  <HeartIcon product={product} />
                </div>
              </div>

              <div className="flex flex-col justify-between w-full max-w-lg text-[#285570]" style={{ color: COLORS.deepTeal }}>
                <h2 className="text-2xl sm:text-3xl font-extrabold mb-3 text-center lg:text-left">
                  {product.name}
                </h2>

                <p className="text-base opacity-80 mb-5 text-center lg:text-left leading-relaxed break-words whitespace-normal overflow-hidden text-ellipsis">
                  {product.description}
                </p>

                <span className="text-3xl sm:text-4xl font-black text-[#3CBEAC] mb-5 text-center lg:text-left">
                  Rs. {product.price}
                </span>

                <div className="grid grid-cols-2 gap-4 text-sm sm:text-base mb-6">
                  <div className="flex flex-col gap-2">
                    <span className="flex items-center gap-2">
                      <FaStore style={{ color: COLORS.vibrantAqua }} /> {product.brand}
                    </span>
                    <span className="flex items-center gap-2">
                      <FaClock style={{ color: COLORS.golden }} /> Added: {moment(product.createAt).fromNow()}
                    </span>
                    <span className="flex items-center gap-2">
                      <FaStar style={{ color: COLORS.golden }} /> Reviews: {product.numReviews}
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="flex items-center gap-2">
                      <FaStar style={{ color: COLORS.golden }} /> Rating: {product.rating.toFixed(1)}
                    </span>
                    <span className="flex items-center gap-2">
                      <FaShoppingCart style={{ color: COLORS.vibrantAqua }} /> Quantity: {product.quantity}
                    </span>
                    <span className="flex items-center gap-2">
                      <FaBox style={{ color: COLORS.vibrantAqua }} /> In Stock: {product.countInStock}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap justify-center lg:justify-start items-center gap-4 mb-4">
                  <Ratings value={product.rating} text={`${product.numReviews} reviews`} />
                  {product.countInStock > 0 && (
                    <select
                      value={qty}
                      onChange={e => setQty(Number(e.target.value))}
                      className="p-2 w-[6rem] rounded-lg border"
                      style={{ borderColor: COLORS.vibrantAqua, color: COLORS.deepTeal }}
                    >
                      {[...Array(product.countInStock).keys()].map(x => (
                        <option key={x + 1} value={x + 1}>{x + 1}</option>
                      ))}
                    </select>
                  )}
                  <button
                    onClick={addToCartHandler}
                    disabled={product.countInStock === 0}
                    className={`w-full md:w-auto mx-auto lg:mx-0 py-3 px-10 rounded-xl font-semibold text-lg shadow-md transition ${
                      product.countInStock === 0 ? "bg-gray-200 text-gray-400 cursor-not-allowed" : `bg-[${COLORS.golden}] text-[${COLORS.deepTeal}] hover:bg-[${COLORS.vibrantAqua}] hover:text-white`
                    }`}
                  >
                    Add To Cart
                  </button>
                </div>

                <div className="mt-4 text-center">
                  {sentimentChartData && (
                    <button
                      onClick={() => setShowChartModal(true)}
                      className="mt-2 px-4 py-2 rounded-lg font-semibold"
                      style={{ backgroundColor: COLORS.vibrantAqua, color: COLORS.warmCream, transition: "background-color 0.3s" }}
                      onMouseEnter={e => (e.currentTarget.style.backgroundColor = COLORS.deepTeal)}
                      onMouseLeave={e => (e.currentTarget.style.backgroundColor = COLORS.vibrantAqua)}
                    >
                      Show Sentiment Chart
                    </button>
                  )}
                </div>
              </div>
            </div>

            {showChartModal && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50" onClick={() => setShowChartModal(false)}>
                <div className="bg-white rounded-xl p-6 shadow-lg relative max-w-lg w-full" onClick={e => e.stopPropagation()}>
                  <button
                    className="absolute top-4 right-4 text-4xl font-bold cursor-pointer"
                    onClick={() => setShowChartModal(false)}
                    aria-label="Close chart modal"
                    style={{ color: COLORS.golden }}
                    onMouseEnter={e => e.currentTarget.style.color = COLORS.darkGolden}
                    onMouseLeave={e => e.currentTarget.style.color = COLORS.golden}
                  >
                    &times;
                  </button>
                  <h3 className="text-xl font-semibold mb-4" style={{ color: COLORS.deepTeal }}>
                    Sentiment Score Distribution
                  </h3>
                  <Bar
                    data={sentimentChartData}
                    options={{
                      responsive: true,
                      scales: {
                        y: {
                          beginAtZero: true,
                          ticks: { stepSize: 1 }
                        }
                      },
                      plugins: { legend: { display: false } }
                    }}
                  />
                </div>
              </div>
            )}

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

              {sentimentSegments && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg shadow-inner">
                  <h4 className="text-lg font-semibold mb-2" style={{ color: COLORS.deepTeal }}>Review Sentiment Breakdown</h4>
                  <ul className="list-disc list-inside text-sm" style={{ color: COLORS.charcoalGray }}>
                    {Object.entries(sentimentSegments).map(([segment, count]) => (
                      <li key={segment}>
                        {segment}: {count} review{count !== 1 ? "s" : ""}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default ProductDetails;
