import { useState } from "react";
import { Link } from "react-router-dom";
import Ratings from "./Ratings";
import { useGetTopProductsQuery } from "../../redux/api/productApiSlice";
import SmallProduct from "./SmallProduct";
import Loader from "../../components/Loader";

const ProductTabs = ({
  loadingProductReview,
  userInfo,
  submitHandler,
  rating,
  setRating,
  comment,
  setComment,
  product,
}) => {
  const { data, isLoading } = useGetTopProductsQuery();
  const [activeTab, setActiveTab] = useState(1);

  if (isLoading) {
    return <Loader />;
  }

  const handleTabClick = (tabNumber) => {
    setActiveTab(tabNumber);
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 md:gap-6 mt-6 md:mt-8 w-full">
      {/* --- Tab Navigation --- */}
      <section className="flex flex-wrap md:flex-col w-full md:w-1/4 justify-center md:justify-start gap-3 px-2 sm:px-0">
        {[
          { id: 1, label: "Write Your Review" },
          { id: 2, label: "All Reviews" },
          { id: 3, label: "Related Products" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            className={`flex-1 md:flex-none text-center px-4 py-2 sm:px-5 sm:py-3 rounded-lg text-sm sm:text-base md:text-lg font-semibold transition-all ${
              activeTab === tab.id
                ? "bg-[#3CBEAC] text-white shadow-md scale-[1.02]"
                : "bg-[#E3DED7] text-[#285570] hover:bg-[#3CBEAC] hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </section>

      {/* --- Tab Content --- */}
      <section className="flex-1 bg-white rounded-xl shadow-md p-4 sm:p-6 md:p-8 border border-[#E3DED7] w-full">
        {/* --- Write Review Tab --- */}
        {activeTab === 1 && (
          <div className="w-full max-w-md sm:max-w-lg mx-auto">
            {userInfo ? (
              <form
                onSubmit={submitHandler}
                className="flex flex-col gap-5 sm:gap-6"
              >
                {/* Rating */}
                <div>
                  <label
                    htmlFor="rating"
                    className="block text-base sm:text-lg font-semibold text-[#285570] mb-2"
                  >
                    Rating
                  </label>
                  <select
                    id="rating"
                    required
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    className="p-2 sm:p-3 border border-[#3CBEAC] rounded-lg w-full text-[#285570] focus:ring-[#3CBEAC] focus:ring-2"
                  >
                    <option value="">Select</option>
                    <option value="1">Inferior</option>
                    <option value="2">Decent</option>
                    <option value="3">Great</option>
                    <option value="4">Excellent</option>
                    <option value="5">Exceptional</option>
                  </select>
                </div>

                {/* Comment */}
                <div>
                  <label
                    htmlFor="comment"
                    className="block text-base sm:text-lg font-semibold text-[#285570] mb-2"
                  >
                    Comment
                  </label>
                  <textarea
                    id="comment"
                    rows="4"
                    required
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="p-3 border border-[#3CBEAC] rounded-lg w-full text-[#285570] focus:ring-[#3CBEAC] focus:ring-2 resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={loadingProductReview}
                  className="w-full sm:w-auto bg-[#EFAF76] text-[#285570] py-2 px-6 rounded-lg font-semibold shadow-md hover:bg-[#3CBEAC] hover:text-white transition transform hover:scale-105"
                >
                  Submit
                </button>
              </form>
            ) : (
              <p className="text-[#285570] text-center text-sm sm:text-base">
                Please{" "}
                <Link
                  to="/login"
                  className="text-[#3CBEAC] hover:underline font-semibold"
                >
                  sign in
                </Link>{" "}
                to write a review.
              </p>
            )}
          </div>
        )}

        {/* --- All Reviews Tab --- */}
        {activeTab === 2 && (
          <div className="mt-2 space-y-4 sm:space-y-5">
            {product.reviews.length === 0 ? (
              <p className="text-[#285570] text-center text-sm sm:text-base">
                No Reviews
              </p>
            ) : (
              product.reviews.map((review) => (
                <div
                  key={review._id}
                  className="bg-[#FAF7F6] p-4 sm:p-5 rounded-lg shadow border border-[#E3DED7]"
                >
                  <div className="flex flex-col sm:flex-row justify-between mb-2">
                    <strong className="text-[#285570]">{review.name}</strong>
                    <span className="text-[#3CBEAC] text-sm mt-1 sm:mt-0">
                      {review.createdAt.substring(0, 10)}
                    </span>
                  </div>
                  <p className="text-[#333333] mb-2 text-sm sm:text-base">
                    {review.comment}
                  </p>
                  <Ratings value={review.rating} />
                </div>
              ))
            )}
          </div>
        )}

        {/* --- Related Products Tab --- */}
        {activeTab === 3 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6 mt-2">
            {!data ? (
              <Loader />
            ) : (
              data.map((prod) => (
                <SmallProduct product={prod} key={prod._id} />
              ))
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default ProductTabs;

