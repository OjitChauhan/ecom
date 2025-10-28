import { Outlet } from "react-router-dom";
import Navigation from "./pages/Auth/Navigation";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Footer from "./pages/Admin/Footer";

const App = () => {
  return (
    <div className="bg-[#E3DED7] min-h-screen">
      <ToastContainer />
      <Navigation />
      <main className="py-3 text-[#285570]">
        <Outlet />
        <Footer />
      </main>
    </div>
  );
};

export default App;

