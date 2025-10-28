import { FaRegStar, FaStar, FaStarHalfAlt } from "react-icons/fa";

const Ratings = ({ value, text, color }) => {
  const fullStars = Math.floor(value);
  const halfStars = value - fullStars >= 0.5 ? 1 : 0;
  const emptyStars = 5 - fullStars - halfStars;

  // Tailwind color mapping for consistent theme palette
  const tailwindColor =
    color === "peach"
      ? "text-[#EFAF76]"
      : color === "aqua"
      ? "text-[#3CBEAC]"
      : color === "blue"
      ? "text-[#285570]"
      : "text-yellow-500"; // fallback color

  return (
    <div className="flex flex-wrap items-center justify-start gap-1 sm:gap-2">
      {/* Full Stars */}
      {[...Array(fullStars)].map((_, index) => (
        <FaStar
          key={`full-${index}`}
          className={`${tailwindColor} w-4 h-4 sm:w-5 sm:h-5`}
        />
      ))}

      {/* Half Star */}
      {halfStars === 1 && (
        <FaStarHalfAlt
          className={`${tailwindColor} w-4 h-4 sm:w-5 sm:h-5`}
        />
      )}

      {/* Empty Stars */}
      {[...Array(emptyStars)].map((_, index) => (
        <FaRegStar
          key={`empty-${index}`}
          className={`${tailwindColor} w-4 h-4 sm:w-5 sm:h-5 opacity-60`}
        />
      ))}

      {/* Optional text (like “4.5 out of 5”) */}
      {text && (
        <span className="ml-2 text-sm sm:text-base text-[#285570] font-semibold">
          {text}
        </span>
      )}
    </div>
  );
};

Ratings.defaultProps = {
  color: "peach",
};

export default Ratings;

