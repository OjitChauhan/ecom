// import { Link } from "react-router-dom";
// import HeartIcon from "./HeartIcon";

// const SmallProduct = ({ product }) => {
//   return (
//     <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-transform duration-300 hover:scale-[1.02] overflow-hidden">
//       {/* Image Section */}
//       <div className="relative w-full h-56 bg-[#FAF7F6] flex items-center justify-center">
//         <img
//           src={product.image}
//           alt={product.name}
//           className="object-contain h-full w-full p-4 transition-transform duration-300 hover:scale-105"
//         />
//         <div className="absolute top-3 right-3">
//           <HeartIcon product={product} />
//         </div>
//       </div>

//       {/* Info Section */}
//       <div className="p-4">
//         <Link to={`/product/${product._id}`}>
//           <h2 className="text-[#285570] font-semibold text-base md:text-lg truncate mb-2">
//             {product.name}
//           </h2>
//         </Link>
//         <div className="flex justify-between items-center">
//           <span className="text-[#285570] font-bold">${product.price}</span>
//           <span className="bg-[#EFAF76] text-[#285570] text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
//             {product.brand || "Brand"}
//           </span>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SmallProduct;
import React from 'react'

const SmallProduct = () => {
  return (
    <div> </div>
  )
}

export default SmallProduct
