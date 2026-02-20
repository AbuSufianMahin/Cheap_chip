import React from "react";

function Navbar() {
  const defaultRoutes = [
    {
      name: "Home",
      path: "/home",
    },
    {
      name: "Repaired Products",
      path: "/repaired-products",
    },
  ];

  return (
    <nav>
      <div className="max-w-7xl border mx-auto py-6">
        <ul className="flex gap-14">
          {defaultRoutes.map((route, index) => (
            <li key={index}>
              <a href={route.path}>{route.name}</a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
