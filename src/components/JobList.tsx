import React, { useRef, useState } from "react";
import PlaceHolder from "../../public/images/placeholder.png";
import Link from "next/link";
import { categories } from "@/data/categories";
import { FaAngleRight, FaWalking } from "react-icons/fa";
import { MdOutlineLocationOn } from "react-icons/md";
import { IoTimeOutline } from "react-icons/io5";
import { LiaMoneyBillWaveSolid } from "react-icons/lia";
import { locations } from "@/data/locations";
import { IoIosClose } from "react-icons/io";
import { jobTitles } from "@/data/jobTitles";
import { formatPostedDate } from "../functions/functions";

import axios from "axios";

const JobList = ({ data }: any) => {
  const sortedData = data.sort((a: any, b: any) => {
    const dateA: any = new Date(a.postedOn);
    const dateB: any = new Date(b.postedOn);

    return dateB - dateA;
  });

  const [selectedCategory, setSelectedCategory] = useState<any>("");
  const [selectedLocation, setSelectedLocation] = useState<any>("");
  const [userPostcode, setUserPostcode] = useState<any>("");
  const [selectedJobTitle, setSelectedJobTitle] = useState<any>("");

  const [closestJobs, setClosestJobs] = useState<any>([]);

  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const filteredJobListings = selectedCategory
    ? sortedData?.filter((job: any) =>
        job?.category?.includes(selectedCategory)
      )
    : sortedData;

  const filteredJobListingsWithLocation = selectedLocation
    ? filteredJobListings?.filter((job: any) =>
        job?.location?.includes(selectedLocation)
      )
    : filteredJobListings;

  const filteredJobListingsWithLocationAndJobTitle =
    filteredJobListingsWithLocation?.filter(
      (job: any) =>
        !selectedJobTitle || job?.jobTitle?.includes(selectedJobTitle)
    );

  const handleCategoryClick = (category: any) => {
    const categoryNameWithoutEmoji = category
      .replace(/[^a-zA-Z0-9 ]/g, "")
      .trim();

    if (selectedCategory === categoryNameWithoutEmoji) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(categoryNameWithoutEmoji);
    }
  };

  const removeEmojis = (str: any) => str?.replace(/[^a-zA-Z0-9 ]/g, "").trim();

  const containerRef: any = useRef(null);

  const handleShowMore = () => {
    if (containerRef.current) {
      const scrollAmount = 200;
      containerRef.current.scrollLeft += scrollAmount;
    }
  };

  const handlePostcodeChange = (e: any) => {
    const enteredPostcode = e.target.value.toUpperCase();
    setUserPostcode(enteredPostcode);
  };

  const isValidLondonPostcode = (postcode: any) => {
    const londonPostcodeRegex =
      /^(EC[1-4]|WC[1-2]|E\d|N\d|NW\d|SE\d|SW\d|W\d|BR\d|CR\d)/;
    return londonPostcodeRegex.test(postcode);
  };

  function calculateDistance(userLocation: any, jobLocation: any) {
    const R = 6371;
    const lat1 = userLocation?.latitude;
    const lon1 = userLocation?.longitude;
    const lat2 = jobLocation?.latitude;
    const lon2 = jobLocation?.longitude;

    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c;

    return distance;
  }

  const geocode = async (postcode: string) => {
    const apiKey = "AIzaSyBbPwrO-qqKuCxf74_GFy6m-vm9NDzGLzA";
    const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${postcode}&key=${apiKey}`;

    try {
      const response = await axios.get(apiUrl);
      const location = response.data.results[0]?.geometry.location;
      return { latitude: location?.lat, longitude: location?.lng };
    } catch (error: any) {
      throw new Error(`Geocoding error: ${error.message}`);
    }
  };

  const getJobsSortedByDistance = async (jobs: any, userCoordinates: any) => {
    const jobsWithCoordinates = await Promise.all(
      jobs.map(async (job: any) => {
        if (job.postcode) {
          try {
            const jobCoordinates = await geocode(job.postcode);
            console.log("Job:", job.jobTitle, "Coordinates:", jobCoordinates);

            return {
              ...job,
              distance: calculateDistance(userCoordinates, jobCoordinates),
            };
          } catch (error: any) {
            console.error(
              "Error geocoding job:",
              job.title,
              "Error:",
              error.message
            );
          }
        }
        return job;
      })
    );

    return jobsWithCoordinates.sort((a, b) => a.distance - b.distance);
  };

  const handleSearchJobs = async (event: any) => {
    event.preventDefault();

    setErrorMessage("");

    if (!isValidLondonPostcode(userPostcode)) {
      setErrorMessage("Please enter a valid London postcode.");
      return;
    }

    try {
      const userCoordinates = await geocode(userPostcode);

      const sortedJobs = getJobsSortedByDistance(sortedData, userCoordinates);

      setClosestJobs(await (await sortedJobs)?.slice(0, 20));
    } catch (error: any) {
      console.error(error.message);
    }
  };

  return (
    <main className="w-full bg-[#faf8f4] pb-20">
      <div className="w-full px-4 md:px-40 md:pt-6 pt-3">
        <div className="flex flex-col gap-2 mt-4">
          <form
            onSubmit={handleSearchJobs}
            className="flex flex-row gap-3 md:mb-1"
          >
            <input
              value={userPostcode}
              required
              onChange={handlePostcodeChange}
              className="flex-grow rounded-full shadow border border-gray-200 py-2 md:py-3 px-4 text-[13px] md:text-sm"
              placeholder="🧭  Enter your Postcode to find jobs closest to you"
            />
            <button
              type="submit"
              className="bg-white w-max rounded-full shadow border border-gray-200 py-2 md:py-3 px-4 text-[13px] md:text-sm hover:opacity-70 flex flex-row items-center gap-1 transition-all"
            >
              <p className="md:flex hidden">🔍</p> <p>Search</p>
            </button>
          </form>
          {errorMessage && (
            <p className="text-sm -mb-1 text-red-400 ml-3">{errorMessage}</p>
          )}
          {closestJobs.length === 0 && (
            <div>
              {/* <CategoryBar /> */}
              <div className="w-full hidden md:flex flex-row items-center justify-center">
                <div>
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className={`flex w-max mr-1 md:-mr-2 py-2 px-4 shadow border rounded-full text-gray-800 text-[12px] md:text-sm bg-white cursor-pointer hover:opacity-50 transition-all ${
                      !selectedCategory && `border-green-600 text-green-600`
                    } `}
                  >
                    All Results
                  </button>
                </div>
                <div
                  ref={containerRef}
                  className="flex space-x-1 md:space-x-2 overflow-x-auto md:px-4 py-2 transition-transform duration-500 ease-in-out"
                  style={{ whiteSpace: "nowrap", scrollBehavior: "smooth" }}
                >
                  {categories.map((item, i) => (
                    <div
                      className={`${
                        selectedCategory === removeEmojis(item) &&
                        "border-green-600"
                      } py-2 px-4 shadow border border-gray-200 rounded-full bg-white cursor-pointer hover:opacity-50 transition-all`}
                      key={i}
                      onClick={() => handleCategoryClick(item)}
                    >
                      <p
                        className={` ${
                          selectedCategory === removeEmojis(item) &&
                          `text-green-600`
                        } w-max text-gray-800 text-[12px] md:text-sm`}
                      >
                        {item}
                      </p>
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
            </div>
          )}
        </div>
        <div className="flex flex-row items-center gap-4 py-2">
          {selectedCategory && (
            <div className="relative">
              <button
                onClick={() => setSelectedCategory("")}
                className="absolute -top-2 -left-1.5 w-5 h-5 flex items-center justify-center bg-white shadow-sm border border-gray-200 rounded-full transition-all hover:opacity-40 focus:outline-none z-10"
              >
                <IoIosClose size={16} />
              </button>
              <div
                onClick={() => setSelectedCategory("")}
                className="py-2 text-gray-900 bg-white font-medium text-sm px-3 shadow-sm border border-gray-200 rounded cursor-pointer"
              >
                {selectedCategory}
              </div>
            </div>
          )}
          {selectedLocation && (
            <div className="relative">
              <button
                onClick={() => setSelectedLocation("")}
                className="absolute -top-2 -left-1.5 w-5 h-5 flex items-center justify-center bg-white shadow-sm border border-gray-200 rounded-full transition-all hover:opacity-40 focus:outline-none z-10"
              >
                <IoIosClose size={16} />
              </button>
              <div
                onClick={() => setSelectedLocation("")}
                className="py-2 text-gray-900 bg-white font-medium text-sm px-3 shadow-sm border border-gray-200 rounded cursor-pointer"
              >
                {selectedLocation}
              </div>
            </div>
          )}
          {selectedJobTitle && (
            <div className="relative">
              <button
                onClick={() => setSelectedJobTitle("")}
                className="absolute -top-2 -left-1.5 w-5 h-5 flex items-center justify-center bg-white shadow-sm border border-gray-200 rounded-full transition-all hover:opacity-40 focus:outline-none z-10"
              >
                <IoIosClose size={16} />
              </button>
              <div
                onClick={() => setSelectedJobTitle("")}
                className="py-2 text-gray-900 bg-white font-medium text-sm px-3 shadow-sm border border-gray-200 rounded cursor-pointer"
              >
                {selectedJobTitle}
              </div>
            </div>
          )}
        </div>
        {closestJobs.length > 0 ? (
          <div className="flex flex-row gap-2 -mt-1 mb-1 ml-2 items-center">
            <p className="text-sm text-gray-600">Closest jobs to: </p>
            <div className="relative">
              <button
                onClick={() => setClosestJobs([])}
                className="absolute -top-2 -left-1.5 w-5 h-5 flex items-center justify-center bg-white shadow-sm border border-gray-200 rounded-full transition-all hover:opacity-40 focus:outline-none z-10"
              >
                <IoIosClose size={16} />
              </button>
              <div
                onClick={() => setSelectedCategory("")}
                className="py-2 text-gray-900 bg-white font-medium text-sm px-3 shadow-sm border border-gray-200 rounded cursor-pointer"
              >
                {userPostcode.toUpperCase()}
              </div>
            </div>
          </div>
        ) : null}
        <div className="flex flex-col md:flex-row w-full bg-[#faf8f4]">
          <div className="w-full md:w-2/3 pt-2 flex flex-col gap-5">
            {closestJobs.length > 0
              ? closestJobs.map((item: any, i: any) => (
                  <Link
                    href={`/jobs/${item.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    key={i}
                  >
                    <div className="w-full bg-white flex rounded-lg shadow-md flex-col transition-all hover:opacity-70">
                      <div className="w-full flex flex-row justify-between items-center p-4">
                        <div className="flex flex-col h-full gap-4 justify-between">
                          <div>
                            <p className="text-[13px] text-gray-700">
                              {formatPostedDate(item.postedOn)}
                            </p>
                          </div>
                          <div>
                            {item?.logoUrl ? (
                              <div className="logo-container border p-2 rounded shadow-sm flex md:hidden">
                                <div
                                  className="logo-image"
                                  style={{
                                    backgroundImage: `url(${item.logoUrl})`,
                                  }}
                                ></div>
                              </div>
                            ) : (
                              <div className="logo-container p-5 border rounded border-gray-100 flex md:hidden">
                                <div
                                  className="logo-image"
                                  style={{
                                    backgroundImage: `url(${
                                      item.logoUrl || PlaceHolder.src
                                    })`,
                                  }}
                                ></div>
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="text-gray-800 text-lg tracking-tight sm:text-xl pr-2 mb-1 font-semibold">
                              {item.adTitle}{" "}
                            </p>{" "}
                            <p className="text-gray-800 text-sm md:text-base  -mt-1 mb-1">
                              {item.companyName}{" "}
                            </p>
                          </div>
                        </div>
                        <div>
                          {item?.logoUrl ? (
                            <div className="logo-container border p-2 rounded shadow-sm hidden md:flex">
                              <div
                                className="logo-image"
                                style={{
                                  backgroundImage: `url(${item.logoUrl})`,
                                }}
                              ></div>
                            </div>
                          ) : (
                            <div className="logo-container p-5 border rounded border-gray-100 hidden md:flex">
                              <div
                                className="logo-image"
                                style={{
                                  backgroundImage: `url(${
                                    item.logoUrl || PlaceHolder.src
                                  })`,
                                }}
                              ></div>
                            </div>
                          )}
                        </div>
                      </div>
                      <hr className="mx-4" />
                      <div className="p-4 flex flex-col gap-1">
                        {item.salary ? (
                          <p className="flex flex-row items-center gap-1 text-gray-800 text-sm">
                            {" "}
                            <LiaMoneyBillWaveSolid /> £{item.salary}{" "}
                            {item.payType}{" "}
                          </p>
                        ) : (
                          <p className="flex flex-row items-center gap-1 text-gray-800 text-sm">
                            {" "}
                            <LiaMoneyBillWaveSolid /> Competitive
                          </p>
                        )}

                        <p className="flex flex-row items-center gap-1 text-gray-800 text-sm">
                          {" "}
                          <MdOutlineLocationOn /> {item.location},{" "}
                          {item.postcode}{" "}
                        </p>
                        <p className="flex flex-row items-center gap-1 text-gray-800 text-sm">
                          {" "}
                          <IoTimeOutline /> {item.type}
                        </p>

                        <p className="flex flex-row items-center gap-1 mt-8 text-gray-800 text-sm">
                          {" "}
                          <FaWalking />
                          {item.distance.toFixed(1)}km
                        </p>
                      </div>
                    </div>
                  </Link>
                ))
              : filteredJobListingsWithLocationAndJobTitle.map(
                  (item: any, i: any) => (
                    <Link
                      href={`/jobs/${item.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      key={i}
                    >
                      <div className="w-full bg-white flex rounded-lg shadow-md flex-col transition-all hover:opacity-70">
                        <div className="w-full flex flex-row justify-between items-center p-4">
                          <div className="flex flex-col h-full gap-4 justify-between">
                            <div>
                              <p className="text-[13px] text-gray-700">
                                {formatPostedDate(item.postedOn)}
                              </p>
                            </div>
                            <div>
                              {item?.logoUrl ? (
                                <div className="logo-container border p-2 rounded shadow-sm flex md:hidden">
                                  <div
                                    className="logo-image"
                                    style={{
                                      backgroundImage: `url(${item.logoUrl})`,
                                    }}
                                  ></div>
                                </div>
                              ) : (
                                <div className="logo-container p-5 border rounded border-gray-100 flex md:hidden">
                                  <div
                                    className="logo-image"
                                    style={{
                                      backgroundImage: `url(${
                                        item.logoUrl || PlaceHolder.src
                                      })`,
                                    }}
                                  ></div>
                                </div>
                              )}
                            </div>
                            <div>
                              <p className="text-gray-800 text-lg tracking-tight sm:text-xl pr-2 mb-1 font-semibold">
                                {item.adTitle}{" "}
                              </p>{" "}
                              <p className="text-gray-800 text-sm md:text-base  -mt-1 mb-1">
                                {item.companyName}{" "}
                              </p>
                            </div>
                          </div>
                          <div>
                            {item?.logoUrl ? (
                              <div className="logo-container border p-2 rounded shadow-sm hidden md:flex">
                                <div
                                  className="logo-image"
                                  style={{
                                    backgroundImage: `url(${item.logoUrl})`,
                                  }}
                                ></div>
                              </div>
                            ) : (
                              <div className="logo-container p-5 border rounded border-gray-100 hidden md:flex">
                                <div
                                  className="logo-image"
                                  style={{
                                    backgroundImage: `url(${
                                      item.logoUrl || PlaceHolder.src
                                    })`,
                                  }}
                                ></div>
                              </div>
                            )}
                          </div>
                        </div>
                        <hr className="mx-4" />
                        <div className="p-4 flex flex-col gap-1">
                          {item.salary ? (
                            <p className="flex flex-row items-center gap-1 text-gray-800 text-sm">
                              {" "}
                              <LiaMoneyBillWaveSolid /> £{item.salary}{" "}
                              {item.payType}{" "}
                            </p>
                          ) : (
                            <p className="flex flex-row items-center gap-1 text-gray-800 text-sm">
                              {" "}
                              <LiaMoneyBillWaveSolid /> Competitive
                            </p>
                          )}

                          <p className="flex flex-row items-center gap-1 text-gray-800 text-sm">
                            {" "}
                            <MdOutlineLocationOn /> {item.location},{" "}
                            {item.postcode}{" "}
                          </p>
                          <p className="flex flex-row items-center gap-1 text-gray-800 text-sm">
                            {" "}
                            <IoTimeOutline /> {item.type}
                          </p>
                        </div>
                      </div>
                    </Link>
                  )
                )}
          </div>
          {/* Sidebar */}
          <div className="w-1/3 mt-2 px-8 hidden md:block">
            <div>
              <p className="text-sm text-gray-800 font-semibold">
                Popular Locations
              </p>
              <div className="flex flex-col gap-2 pt-1">
                {locations.map((location, i) => (
                  <p
                    onClick={() => setSelectedLocation(location)}
                    key={i}
                    className={` ${
                      selectedLocation === location && `text-green-600`
                    } text-sm text-gray-700 hover:opacity-75 cursor-pointer transition-all`}
                  >
                    {location}
                  </p>
                ))}
              </div>
            </div>
            <div className="mt-6">
              <p className="text-sm text-gray-800 font-semibold">
                Popular Roles
              </p>
              <div className="flex flex-col gap-2 pt-1">
                {jobTitles.map((job, i) => (
                  <p
                    onClick={() => setSelectedJobTitle(job)}
                    key={i}
                    className={` ${
                      selectedJobTitle === job && `text-green-600`
                    } text-sm text-gray-700 hover:opacity-75 cursor-pointer transition-all`}
                  >
                    {job}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default JobList;
