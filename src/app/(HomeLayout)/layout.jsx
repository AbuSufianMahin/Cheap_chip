import Footer from "../../components/HomeLayout/Footer";
import Navbar from "../../components/HomeLayout/Navbar/Navbar";

function HomeLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col justify-between">
      <Navbar />
      <div className="flex-1 bg-linear-to-br from-white via-green-50 to-emerald-100">
          {children}
      </div>
      <Footer />
    </div>
  );
}

export default HomeLayout;
