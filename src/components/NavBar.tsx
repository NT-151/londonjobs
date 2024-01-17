import React from "react";
import Logo from "../../public/images/logo.png";
import Image from "next/image";
import Link from "next/link";

const NavBar = () => {
  return (
    <main className="w-full flex-row pt-5 mb-4 px-4 sm:px-10 md:px-20 lg:px-40 flex justify-between items-center">
      <Link href="/" className="flex items-center">
        <Image
          src={Logo}
          alt="Retail Jobs London"
          className="w-auto h-7 md:h-10 hover:opacity-50 transition-all"
        />
      </Link>
      <div className="flex flex-row items-center gap-4">
        <div className="flex flex-row gap-5 text-gray-800">
          {/* <p>CV & Cover Letter</p> */}
          <Link href="/contact">
            <p className="hover:opacity-50 text-[13px] md:text-sm hidden md:flex transition-all">
              Contact
            </p>
          </Link>
          <Link href="/blog">
            <p className="hover:opacity-50 transition-all text-[13px] md:text-sm">
              Blog
            </p>
          </Link>
        </div>
        <Link href="/postJob">
          <div className="px-2 py-1 bg-yellow-400 text-[13px] md:text-sm rounded font-medium hover:opacity-50 transition-all">
            Post a Job
          </div>
        </Link>
      </div>
    </main>
  );
};

export default NavBar;
