import Link from "next/link";
import React from "react";

function NavbarLinks() {
  const defaultRoutes = [
    {
      name: "HOME",
      path: "/",
    },
    {
      name: "OUR SERVICES",
      path: "/our-services",
      children: [
        {
          name: "Sell Device",
          path: "/our-services/sell-device",
          children: [
            { name: "Sell Phone", path: "/our-services/sell-device/phone" },
            { name: "Sell Laptop", path: "/our-services/sell-device/laptop" },
            { name: "Sell Tablet", path: "/our-services/sell-device/tablet" },
          ],
        },
        {
          name: "Buy Refurbished",
          path: "/our-services/buy",
          children: [
            { name: "Refurbished Phones", path: "/our-services/buy/phones" },
            { name: "Refurbished Laptops", path: "/our-services/buy/laptops" },
            { name: "Accessories", path: "/our-services/buy/accessories" },
          ],
        },
        {
          name: "Recycling",
          path: "/our-services/recycling",
          children: [
            {
              name: "How It Works",
              path: "/our-services/recycling/how-it-works",
            },
            {
              name: "Accepted Devices",
              path: "/our-services/recycling/accepted-devices",
            },
          ],
        },
      ],
    },
    {
      name: "SUSTAINABILITY",
      path: "/sustainability",
      children: [
        { name: "Environmental Impact", path: "/sustainability/environment" },
        { name: "Recycling Process", path: "/sustainability/process" },
        { name: "Our Green Mission", path: "/sustainability/mission" },
      ],
    },
    {
      name: "CAREERS",
      path: "/careers",
      children: [
        { name: "Be a Deliveryman", path: "/careers/deliveryman" },
        { name: "Be a Technician", path: "/careers/technician" },
      ],
    },
    {
      name: "ABOUT",
      path: "/about",
      children: [
        { name: "Our Story", path: "/about/story" },
        { name: "Partners", path: "/about/partners" },
        { name: "Contact Us", path: "/about/contact" },
      ],
    },
  ];
  return (
    <div className="hidden lg:flex">
      <ul className="flex gap-14 font-semibold">
        {defaultRoutes.map((route) => (
          <li key={route.path} className="hover:text-secondary">
            <Link href={route.path}>{route.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default NavbarLinks;
