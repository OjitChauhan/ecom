import Chart from "react-apexcharts";
import { useGetUsersQuery } from "../../redux/api/usersApiSlice";
import {
  useGetTotalOrdersQuery,
  useGetTotalSalesByDateQuery,
  useGetTotalSalesQuery,
} from "../../redux/api/orderApiSlice";
import { useState, useEffect } from "react";
import AdminMenu from "./AdminMenu";
import OrderList from "./OrderList";
import Loader from "../../components/Loader";

const AdminDashboard = () => {
  const { data: sales, isLoading } = useGetTotalSalesQuery();
  const { data: customers, isLoading: loading } = useGetUsersQuery();
  const { data: orders, isLoading: loadingTwo } = useGetTotalOrdersQuery();
  const { data: salesDetail } = useGetTotalSalesByDateQuery();

  const [state, setState] = useState({
    options: {
      chart: { type: "line", background: "#FAF7F6" },
      tooltip: { theme: "light" },
      colors: ["#3CBEAC"],
      dataLabels: {
        enabled: true,
        style: { fontWeight: 600, fontFamily: "Poppins, Inter, Montserrat" },
      },
      stroke: { curve: "smooth" },
      title: {
        text: "Sales Trend",
        align: "left",
        style: { color: "#285570", fontFamily: "Poppins, Inter, Montserrat" },
      },
      grid: { borderColor: "#E3DED7" },
      markers: { size: 4, colors: ["#3CBEAC"] },
      xaxis: {
        categories: [],
        title: { text: "Date", style: { fontWeight: 500, color: "#285570" } },
        labels: { style: { colors: "#333333" } },
      },
      yaxis: {
        title: { text: "Sales", style: { fontWeight: 500, color: "#285570" } },
        min: 0,
        labels: { style: { colors: "#333333" } },
      },
      legend: {
        position: "top",
        horizontalAlign: "right",
        floating: true,
        offsetY: -25,
        offsetX: -5,
        labels: { colors: "#333333" },
      },
    },
    series: [{ name: "Sales", data: [] }],
  });

  useEffect(() => {
    if (salesDetail) {
      const formattedSalesDate = salesDetail.map((item) => ({
        x: item._id,
        y: item.totalSales,
      }));
      setState((prevState) => ({
        ...prevState,
        options: {
          ...prevState.options,
          xaxis: {
            ...prevState.options.xaxis,
            categories: formattedSalesDate.map((item) => item.x),
          },
        },
        series: [{ name: "Sales", data: formattedSalesDate.map((item) => item.y) }],
      }));
    }
  }, [salesDetail]);

  return (
    <div className="min-h-screen bg-[#FAF7F6] flex flex-col xl:flex-row">
      {/* Optional AdminMenu */}
      {/* <AdminMenu /> */}
      <section className="flex-1 px-2 py-6 xl:ml-[4rem]">
        {/* Stats Cards */}
        <div className="flex flex-wrap gap-7 justify-center md:justify-start">
          {/* Sales */}
          <div className="rounded-2xl shadow-lg bg-gradient-to-br from-[#FAF7F6] via-[#E3DED7] to-[#FAF7F6] p-6 sm:p-7 w-full sm:w-[18rem] min-w-[14rem] transition-all hover:scale-105 hover:shadow-xl flex flex-col items-center">
            <div className="font-bold rounded-full w-12 h-12 bg-[#3CBEAC] flex items-center justify-center text-2xl text-white shadow mb-2">
              $
            </div>
            <p className="mt-1 mb-1 text-[#285570] tracking-widest font-semibold text-center">
              Sales
            </p>
            <h1 className="text-2xl font-bold text-[#333333]">
              {isLoading ? <Loader /> : `$${sales?.totalSales?.toFixed(2)}`}
            </h1>
          </div>

          {/* Customers */}
          <div className="rounded-2xl shadow-lg bg-gradient-to-br from-[#FAF7F6] via-[#E3DED7] to-[#FAF7F6] p-6 sm:p-7 w-full sm:w-[18rem] min-w-[14rem] transition-all hover:scale-105 hover:shadow-xl flex flex-col items-center">
            <div className="font-bold rounded-full w-12 h-12 bg-[#3CBEAC] flex items-center justify-center text-2xl text-white shadow mb-2">
              <span role="img" aria-label="Users">👤</span>
            </div>
            <p className="mt-1 mb-1 text-[#285570] tracking-widest font-semibold text-center">
              Customers
            </p>
            <h1 className="text-2xl font-bold text-[#333333]">
              {loading ? <Loader /> : customers?.length}
            </h1>
          </div>

          {/* Orders */}
          <div className="rounded-2xl shadow-lg bg-gradient-to-br from-[#FAF7F6] via-[#E3DED7] to-[#FAF7F6] p-6 sm:p-7 w-full sm:w-[18rem] min-w-[14rem] transition-all hover:scale-105 hover:shadow-xl flex flex-col items-center">
            <div className="font-bold rounded-full w-12 h-12 bg-[#3CBEAC] flex items-center justify-center text-2xl text-white shadow mb-2">
              <span role="img" aria-label="Orders">📦</span>
            </div>
            <p className="mt-1 mb-1 text-[#285570] tracking-widest font-semibold text-center">
              All Orders
            </p>
            <h1 className="text-2xl font-bold text-[#333333]">
              {loadingTwo ? <Loader /> : orders?.totalOrders}
            </h1>
          </div>
        </div>

        {/* Chart Section */}
        <div className="flex justify-center mt-12">
          <div className="bg-white rounded-3xl shadow-lg px-4 pt-7 pb-12 w-full max-w-full sm:max-w-4xl">
            <h2 className="text-xl font-bold mb-8 text-[#285570] tracking-wide text-center">
              Sales Trend
            </h2>
            <Chart options={state.options} series={state.series} type="bar" width="100%" height="350" />
          </div>
        </div>

        {/* Orders List */}
        <div className="mt-12 px-2">
          <OrderList />
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
