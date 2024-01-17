import React, { useState, useRef } from "react";
import { categories } from "@/data/categories";
import { FaAngleRight } from "react-icons/fa";

const CategoryBar = () => {
  const [selectedCategory, setSelectedCategory] = useState<any>("");

  const handleCategoryClick = (category: any) => {
    const categoryNameWithoutEmoji = category
      .replace(/[^a-zA-Z0-9 ]/g, "")
      .trim();

    const jobListSection: any = document.getElementById("jobListSection");

    if (selectedCategory === categoryNameWithoutEmoji) {
      // If the clicked category is already selected, reset the filter
      setSelectedCategory(null);
    } else {
      // Otherwise, update the selected category
      setSelectedCategory(categoryNameWithoutEmoji);
      //   scroll.scrollTo(jobListSection.offsetTop - 100, {
      //     smooth: true,
      //   });
    }
  };

  const removeEmojis = (str: any) => str?.replace(/[^a-zA-Z0-9 ]/g, "").trim();

  const containerRef: any = useRef(null);

  const handleShowMore = () => {
    if (containerRef.current) {
      const scrollAmount = 200; // Adjust this value based on your needs
      containerRef.current.scrollLeft += scrollAmount;
    }
  };

  return (
    <div className="w-full flex flex-row items-center justify-center">
      <div>
        <button className="flex w-max py-2 px-4 shadow-sm border border-green-600 text-green-600 rounded-full bg-white cursor-pointer hover:opacity-50 transition-all">
          All Results
        </button>
      </div>
      <div
        ref={containerRef}
        className="flex space-x-4 overflow-x-auto p-4 transition-transform duration-500 ease-in-out"
        style={{ whiteSpace: "nowrap", scrollBehavior: "smooth" }}
      >
        {categories.map((item, i) => (
          <div
            className={`${
              selectedCategory === removeEmojis(item) && "bg-blue-200"
            } py-2 px-4 shadow-sm border border-gray-200 rounded-full bg-white cursor-pointer hover:opacity-50 transition-all`}
            key={i}
            onClick={() => handleCategoryClick(item)}
          >
            <p className="text-gray-900 w-max font-medium text-sm">{item}</p>
          </div>
        ))}
      </div>

      <button
        onClick={handleShowMore}
        className="bg-white w-max text-sm p-2 border border-gray-100 shadow rounded-full opacity-60 hover:opacity-100 transition-all"
      >
        <FaAngleRight />
      </button>
    </div>
  );
};

export default CategoryBar;
