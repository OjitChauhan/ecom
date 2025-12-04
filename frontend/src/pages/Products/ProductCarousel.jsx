// ProductCarousel.tsx
import { useGetTopProductsQuery } from "../../redux/api/productApiSlice";
import Message from "../../components/Message";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaHeart, FaStar, FaStore } from "react-icons/fa";
import "./ProductCarousel3DEffect.css";

const ProductCarousel = () => {
  const { data: products = [], isLoading, error } = useGetTopProductsQuery();

  const settings = {
    dots: true,
    infinite: true,
    speed: 300, // Fast animation speed
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 2500,
    centerMode: true,
    centerPadding: "0px",
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          centerMode: false,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          centerMode: false,
          arrows: false,
          centerPadding: "0px",
        },
      },
    ],
  };

  return (
    <div className="w-full bg-[#E3DED7] py-8 min-h-[500px] flex items-center justify-center px-2 sm:px-4">
      {isLoading ? null : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <Slider
          {...settings}
          className="product-carousel-3d w-full max-w-[1100px] mx-auto"
        >
          {products.map((product) => (
            <div key={product._id} className="px-2 sm:px-4">
              <div className="carousel-card-3d bg-white rounded-2xl shadow-2xl border border-[#3CBEAC] p-4 sm:p-6 flex flex-col items-center relative w-full min-h-[410px] hover:scale-105 duration-200">
                {/* Favorite Icon */}
                <div className="absolute top-3 right-3 sm:top-4 sm:right-4 cursor-pointer z-10">
                  <FaHeart className="text-[#EFAF76] text-xl sm:text-2xl" />
                </div>

                {/* Product Image (Full view) */}
                <div className="w-full flex justify-center">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="rounded-xl w-full h-[230px] sm:h-[230px] object-contain object-center mb-4 shadow"
                  />
                </div>

                {/* Product Name */}
                <h2 className="text-lg sm:text-xl font-extrabold text-[#285570] text-center mb-2 uppercase truncate w-full">
                  {product.name}
                </h2>

                {/* Price (INR) */}
                <div className="text-base sm:text-lg font-semibold text-[#EFAF76] mb-2 text-center">
                  ₹{product.price?.toLocaleString("en-IN")}
                </div>

                {/* Brand & Rating */}
                <div className="flex justify-between w-full text-[#3CBEAC] font-semibold text-sm sm:text-md mb-2">
                  <span className="flex items-center gap-1 sm:gap-2">
                    <FaStore /> {product.brand}
                  </span>
                  <span className="flex items-center gap-1 sm:gap-2">
                    <FaStar /> {Math.round(product.rating)}/5
                  </span>
                </div>

                {/* Description */}
                <p className="text-center text-[#333333] text-sm opacity-90 truncate max-w-[90%] mx-auto">
                  {product.description}
                </p>
              </div>
            </div>
          ))}
        </Slider>
      )}
    </div>
  );
};

export default ProductCarousel;
