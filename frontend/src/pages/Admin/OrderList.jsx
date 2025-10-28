import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { Link } from "react-router-dom";
import { useGetOrdersQuery } from "../../redux/api/orderApiSlice";
import AdminMenu from "./AdminMenu";

const OrderList = () => {
  const { data: orders, isLoading, error } = useGetOrdersQuery();

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50 p-4">
      {/* Sidebar */}
      <div className="md:w-1/5 mb-4 md:mb-0">
        <AdminMenu />
      </div>

      {/* Orders Table */}
      <div className="md:w-4/5 overflow-x-auto">
        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">
            {error?.data?.message || error.error}
          </Message>
        ) : (
          <table className="w-full min-w-[700px] md:min-w-full border border-gray-200 bg-white rounded-lg">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="text-left px-2 py-2">ITEMS</th>
                <th className="text-left px-2 py-2">ID</th>
                <th className="text-left px-2 py-2">USER</th>
                <th className="text-left px-2 py-2">DATE</th>
                <th className="text-left px-2 py-2">TOTAL</th>
                <th className="text-left px-2 py-2">PAID</th>
                <th className="text-left px-2 py-2">DELIVERED</th>
                <th className="px-2 py-2">ACTION</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="border-b hover:bg-gray-50">
                  <td className="px-2 py-2">
                    <img
                      src={order.orderItems[0].image}
                      alt={order._id}
                      className="w-16 h-16 object-cover rounded"
                    />
                  </td>
                  <td className="px-2 py-2 text-sm break-words">{order._id}</td>
                  <td className="px-2 py-2 text-sm">{order.user ? order.user.username : "N/A"}</td>
                  <td className="px-2 py-2 text-sm">
                    {order.createdAt ? order.createdAt.substring(0, 10) : "N/A"}
                  </td>
                  <td className="px-2 py-2 text-sm">$ {order.totalPrice}</td>
                  <td className="px-2 py-2">
                    {order.isPaid ? (
                      <span className="p-1 text-center bg-green-400 w-20 rounded-full block text-white text-xs">
                        Completed
                      </span>
                    ) : (
                      <span className="p-1 text-center bg-red-400 w-20 rounded-full block text-white text-xs">
                        Pending
                      </span>
                    )}
                  </td>
                  <td className="px-2 py-2">
                    {order.isDelivered ? (
                      <span className="p-1 text-center bg-green-400 w-20 rounded-full block text-white text-xs">
                        Completed
                      </span>
                    ) : (
                      <span className="p-1 text-center bg-red-400 w-20 rounded-full block text-white text-xs">
                        Pending
                      </span>
                    )}
                  </td>
                  <td className="px-2 py-2">
                    <Link to={`/order/${order._id}`}>
                      <button className="bg-[#3CBEAC] hover:bg-[#285570] text-white text-xs font-semibold py-1 px-2 rounded transition">
                        More
                      </button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default OrderList;
