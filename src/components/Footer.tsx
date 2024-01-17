import React from "react";
import Logo from "../../public/images/logoWhite.png";
import Image from "next/image";
import { BsFacebook } from "react-icons/bs";
import { MdEmail } from "react-icons/md";
import Link from "next/link";

const Footer = () => {
  return (
    <div className="w-full py-10 md:px-40 flex items-center justify-between bottom-0 flex-col md:flex-row gap-3 bg-gray-800">
      <div className="flex justify-center items-center flex-col gap-3">
        <div className="w-full flex justify-center items-center md:w-2/3 md:px-4">
          <Link href="/">
            <Image
              src={Logo}
              alt="Retail Jobs London"
              className="w-auto h-10 -mb-2 md:h-10 hover:opacity-50 transition-all"
            />
          </Link>
        </div>
        <div>
          <p className="text-[13px] font-light text-white px-4">
            © 2023 retailjobslondon.co.uk - All rights reserved
          </p>
        </div>
        <div className="px-4 flex flex-row gap-4">
          <Link
            href="https://www.facebook.com/people/London-Jobs/61555088631046/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="rounded-full p-2 bg-gray-600 hover:opacity-50">
              <BsFacebook className="text-gray-200" />
            </div>
          </Link>
          <Link href="/contact">
            <div className="rounded-full p-2 bg-gray-600 hover:opacity-50">
              <MdEmail className="text-gray-200 " />
            </div>
          </Link>
        </div>
      </div>
      <div className="flex-row hidden md:flex gap-12 text-white">
        <div className="flex flex-col gap-4">
          <p className="font-medium">Employers</p>
          <Link href="/postJob">
            <p className="text-sm font-light hover:opacity-50">Post a job</p>
          </Link>
          <Link href="/contact">
            <p className="text-sm font-light hover:opacity-50">Contact</p>
          </Link>
        </div>
        <div className="flex flex-col gap-4">
          <p className="font-medium">Job Seekers</p>
          <Link
            href="https://www.aimhire.ai/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <p className="text-sm font-light hover:opacity-50">Help with CV</p>
          </Link>
          <Link
            href="https://www.aimhire.ai/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <p className="text-sm font-light hover:opacity-50">
              Help with Cover Letter
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Footer;
