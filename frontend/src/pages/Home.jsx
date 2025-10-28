import { useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { useGetProductsQuery } from "../redux/api/productApiSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Header from "../components/Header";

const SmallProductCard = ({ product }) => (
  <div className="w-[160px] sm:w-[200px] md:w-[220px] flex-shrink-0 bg-white rounded-xl shadow-lg p-4 sm:p-5 flex flex-col gap-3 transition-transform duration-300 hover:scale-[1.05] hover:shadow-2xl cursor-pointer">
    {/* Image Container */}
    <div className="w-full h-32 sm:h-36 md:h-40 flex items-center justify-center overflow-hidden bg-gray-50 rounded-lg">
      <img
        src={product.image}
        alt={product.name}
        className="max-h-full max-w-full object-contain"
      />
    </div>

    {/* Product Details */}
    <h2 className="text-sm sm:text-base font-semibold text-[#285570] mt-1">
      {product.name}
    </h2>

    <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">
      {product.description}
    </p>

    <p className="text-sm sm:text-base font-bold text-[#EFAF76]">
      ${product.price.toFixed(2)}
    </p>

    <Link
      to={`/product/${product._id}`}
      className="mt-auto text-xs sm:text-sm text-[#3CBEAC] font-semibold hover:underline"
    >
      View Details
    </Link>
  </div>
);

const Home = () => {
  const { keyword = "" } = useParams();
  const { data, isLoading, isError } = useGetProductsQuery({ keyword });
  const sliderRef = useRef(null);

  // Filter products for recommendations
  const recommendedProducts =
    data?.products
      ?.filter(
        (p) =>
          p.name.toLowerCase().includes(keyword.toLowerCase()) ||
          p.description.toLowerCase().includes(keyword.toLowerCase())
      )
      .slice(0, 10) || [];

  return (
    <>
      {!keyword && <Header />}

      {isLoading ? (
        <Loader />
      ) : isError ? (
        <Message variant="danger">
          {isError?.data?.message || isError.error}
        </Message>
      ) : (
        <main className="px-3 sm:px-5 md:px-10 xl:px-[10rem] py-6 sm:py-10 min-h-screen bg-[#FAF7F6] overflow-y-auto">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 sm:mb-8 gap-4 text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#285570]">
              Special Products
            </h1>
            <Link
              to="/shop"
              className="bg-gradient-to-r from-[#EFAF76] via-[#FFC978] to-[#EFAF76] px-5 sm:px-6 py-2 rounded-full text-[#285570] font-bold shadow-md hover:from-[#3CBEAC] hover:to-[#285570] hover:text-white transition"
            >
              Shop
            </Link>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6 pb-10">
            {data?.products?.map((product) => (
              <SmallProductCard key={product._id} product={product} />
            ))}
          </div>

          {/* Recommended Section */}
          <section className="mt-8 sm:mt-10">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-[#285570]">
              Recommended for "{keyword ? keyword : "You"}"
            </h2>
            <div
              ref={sliderRef}
              className="flex overflow-x-auto gap-4 sm:gap-6 pb-4 no-scrollbar scroll-smooth"
              tabIndex={0}
              role="list"
              aria-label="Recommended products"
              style={{ scrollbarWidth: "none" }}
            >
              {recommendedProducts.length === 0 ? (
                <p className="text-[#285570] text-sm sm:text-base">
                  No recommendations found for your search.
                </p>
              ) : (
                recommendedProducts.map((product) => (
                  <SmallProductCard key={product._id} product={product} />
                ))
              )}
            </div>
          </section>
        </main>
      )}
    </>
  );
};

export default Home;

