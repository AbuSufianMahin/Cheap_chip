"use client"
import Link from "next/link";
import { FaUser } from "react-icons/fa";

function VisitorState() {
  return (
    <div className="flex items-center gap-2">
      <FaUser size={26} className="text-secondary" />
      <div className="text-sm leading-tight">
        <h3 className="font-medium">Account</h3>
        <div className="space-x-1 text-xs">
          <Link
            href={"/login"}
            className="hover:text-green-600 hover:underline"
          >
            Login
          </Link>
          <span>or</span>
          <Link
            href={"/register"}
            className="hover:text-green-600 hover:underline"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  )
}

export default VisitorState