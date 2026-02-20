import Footer from "../../components/HomeLayout/Footer";
import Navbar from "../../components/HomeLayout/Navbar";
import React from "react";

function HomeLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col justify-between">
      <Navbar />
      <div className="flex-1">
        <div className="max-w-7xl border mx-auto">{children}</div>
      </div>
      <Footer />
    </div>
  );
}

export default HomeLayout;
