import ResponsiveWidth from "@/components/shared/ResponsiveWidth";
import Footer from "../../components/HomeLayout/Footer";
import Navbar from "../../components/HomeLayout/Navbar/Navbar";

function HomeLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col justify-between">
      <Navbar />
      <div className="flex-1">
        <ResponsiveWidth>
          {children}
        </ResponsiveWidth>
      </div>
      <Footer />
    </div>
  );
}

export default HomeLayout;
