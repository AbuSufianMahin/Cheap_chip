import ResponsiveWidth from "../shared/ResponsiveWidth";
import Logo from "../shared/Logo";
import { MdKeyboardArrowRight, MdSecurityUpdateGood } from "react-icons/md";
import { GrUserWorker } from "react-icons/gr";
import { FiLink } from "react-icons/fi";
import { IoIosSend } from "react-icons/io";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Input } from "../ui/input";

function Footer() {
  const services = [
    { name: "Sell Device", path: "/our-services/sell-device" },
    { name: "Track product", path: "/our-services/track-product" },
    { name: "Buy Refurbished", path: "/our-services/buy" },
    { name: "Recycling", path: "/our-services/recycling" },
    { name: "Device Collection", path: "/our-services/sell-device" },
  ];

  const quickLinks = [
    { name: "About Us", path: "/about/about-us" },
    { name: "Our team", path: "/about/out-team" },
    { name: "Refund and Returns", path: "/refund-and-returns" },
    { name: "Contact Us", path: "/about/contact" },
  ];

  return (
    <footer className="bg-primary text-white">
      <ResponsiveWidth>
        <div className="py-12 md:py-16 grid xl:grid-cols-3 gap-8 md:gap-14 xl:gap-24">
          <div className="space-y-4">
            <div className="pb-4 border-b border-secondary/20">
              <Logo logoSize={48} />
              <p className="mt-4">
                Sell old tech, recycle responsibly, and buy quality refurbished
                devices. Simple, transparent, and eco-friendly.
              </p>
            </div>

            <div className="flex flex-col xs:flex-row gap-4 xs:gap-14">
              <div>
                <h4 className="text-secondary font-bold text-xl">Call Us</h4>
                <p>+880 1234-567890</p>
              </div>
              <div>
                <h4 className="text-secondary font-bold text-xl">
                  Our Location
                </h4>
                <p>Uttara, Dhaka, Bangladesh</p>
              </div>
            </div>
          </div>

          <div className="grid gap-8 xl:col-span-2 xs:grid-cols-2 md:grid-cols-3">
            <div className="flex-1">
              <h2 className="mb-4 text-2xl flex items-center gap-1 font-bold text-secondary">
                <GrUserWorker className="" />
                <span>Our Services</span>
              </h2>
              <ul className="space-y-2">
                {services.map((service) => (
                  <li
                    key={service.name}
                    className="flex items-center hover:text-secondary"
                  >
                    <MdKeyboardArrowRight size={20} />
                    <Link href={service.path}>{service.name}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex-1">
              <h2 className="mb-4 text-2xl flex items-center gap-1 font-bold text-secondary">
                <FiLink />
                <span>Quick Links</span>
              </h2>
              <ul className="space-y-2">
                {quickLinks.map((quickLink) => (
                  <li
                    key={quickLink.name}
                    className="flex items-center hover:text-secondary"
                  >
                    <MdKeyboardArrowRight size={20} />
                    <Link href={quickLink.path}>{quickLink.name}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex-1 space-y-4">
              <div className="w-full sm:w-8/10 lg:w-full space-y-2">
                <h2 className="text-2xl flex items-center gap-1 font-bold text-secondary">
                  <MdSecurityUpdateGood />
                  <span>Get Updates</span>
                </h2>

                <p>
                  Sign up for our newsletter to get updates on recycling, eco
                  tips, and services.
                </p>
              </div>

              <ButtonGroup className={"lg:w-full"}>
                <Input
                  id="input-button-group"
                  placeholder="Email Address"
                  className={
                    "border-secondary/40 focus-visible:border-secondary focus-visible:ring-0"
                  }
                />
                <Button
                  className={"bg-secondary border-secondary"}
                  variant="outline"
                >
                  <IoIosSend />
                </Button>
              </ButtonGroup>
            </div>
          </div>
        </div>
      </ResponsiveWidth>
    </footer>
  );
}

export default Footer;
