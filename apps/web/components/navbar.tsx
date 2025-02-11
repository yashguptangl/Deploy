"use client";
import { useState } from "react";
import logo from "../assets/logo.png";
import userIcon from "../assets/user-icon.png";
import { useRouter } from "next/router";
import Link from "next/link";

function redirect(path: string) {
  const router = useRouter();
  router.push(path);
}

export default function Navbar() {
  const [showDropdown, setShowDropdown] = useState(false);

  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };

  return (
    <div className="flex h-16 w-full max-w-full bg-blue-400 justify-between p-3 ">
      <img
        src={logo.src}
        className="h-8 mt-2 pl-3"
        alt="logo"
        onClick={() => {
          redirect("/");
        }}
      />
      
      <div className="relative">
        <img
          src={userIcon.src}
          className="h-8 mt-2 pr-8 cursor-pointer"
          alt="user-logo"
          onClick={toggleDropdown}
        />
        
        {showDropdown && (
          <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-md">
            <ul className="text-black">
              <li
                className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
              ><Link href="/user/signin">User Login</Link>
              </li>
              <li
                className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
              >
                <Link href="/owner/signin">Owner Login</Link>
              </li>
              <li
                className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
              >
                <Link href="/agent/signup">Agent Login</Link>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
