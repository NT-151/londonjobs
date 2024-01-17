import { getDoc, doc, deleteDoc } from "firebase/firestore";
import { database } from "@/firebase/config";
import NavBar from "@/components/NavBar";
import Link from "next/link";
import PlaceHolder from "../../../public/images/placeholder.png";
import Head from "next/head";
import { useEffect, useState } from "react";
import Footer from "@/components/Footer";
import { MdOutlineLocationOn } from "react-icons/md";
import { IoTimeOutline } from "react-icons/io5";
import { LiaMoneyBillWaveSolid } from "react-icons/lia";
import { MdOutlineWorkOutline } from "react-icons/md";
import { useRouter } from "next/router";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { MdClose } from "react-icons/md";

function formatPostedDate(postedDate: any) {
  const currentDate: any = new Date();
  const postDate: any = new Date(postedDate);
  const timeDifference = currentDate - postDate;
  const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

  if (daysDifference === 0) {
    return "Posted today";
  } else if (daysDifference === 1) {
    return "Posted yesterday";
  } else {
    return `Posted ${daysDifference} days ago`;
  }
}

function JobDescription({ content }: any) {
  return (
    <div
      className="text-gray-800 text-sm md:text-base font-light mb-10 pb-4"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}

const JobPage = ({ jobData }: any) => {
  const htmlContent = jobData?.description;

  const [isSticky, setIsSticky] = useState(false);

  const router = useRouter();
  const { id }: any = router.query;

  const handleDeleteClick = async (id: string | undefined) => {
    if (!id) {
      console.error("Invalid document ID");
      return;
    }

    const documentRef = doc(database, "jobs", id);

    try {
      await deleteDoc(documentRef);
      router.push("/");
      console.log("Document deleted successfully");
    } catch (error) {
      console.error("Error deleting document:", error);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const footer: any = document.getElementById("footer");
      const offset =
        window.innerHeight + window.scrollY - document.body.offsetHeight;

      setIsSticky(offset > 0 && offset < footer.offsetHeight);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const [isOpen, setIsOpen] = useState(false);

  const onClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      <Head>
        <title>{`${jobData.jobTitle} at ${jobData.companyName} | London Retail Jobs`}</title>
        <meta
          name="description"
          content={`${jobData.jobTitle} at ${jobData.companyName}. The lastest and best retail jobs in London. Updated daily`}
        />
        <meta property="og:image" content={jobData?.logoUrl} />
      </Head>
      <NavBar />
      <div className="">
        <div className="box w-full">
          <div className="px-4 md:px-20 lg:px-40 pt-6 md:pt-10">
            <div className="w-full flex flex-row justify-between items-center">
              <div className="flex flex-col h-full md:gap-8 gap-4 justify-between">
                <div>
                  <p className="md:text-sm text-[13px]  text-gray-700">
                    {formatPostedDate(jobData.postedOn)}
                  </p>
                </div>
                <div>
                  {jobData?.logoUrl ? (
                    <div className="logo-container bg-white p-2 rounded shadow-sm flex md:hidden">
                      <div
                        className="logo-image"
                        style={{
                          backgroundImage: `url(${jobData.logoUrl})`,
                        }}
                      ></div>
                    </div>
                  ) : (
                    <div className="logo-container p-5 shadow-sm rounded border-gray-100 flex md:hidden">
                      <div
                        className="logo-image"
                        style={{
                          backgroundImage: `url(${
                            jobData.logoUrl || PlaceHolder.src
                          })`,
                        }}
                      ></div>
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-gray-800 text-xl tracking-tight sm:text-4xl md:pr-40 mb-2 font-semibold">
                    {jobData.adTitle}{" "}
                  </p>{" "}
                  <p className="text-gray-800 text-base md:text-lg -mt-1 mb-1">
                    {jobData.companyName}{" "}
                  </p>
                </div>
              </div>
              <div>
                {jobData?.logoUrl ? (
                  <div className="logo-container-post bg-white p-2 rounded shadow hidden md:flex">
                    <div
                      className="logo-image"
                      style={{
                        backgroundImage: `url(${jobData.logoUrl})`,
                      }}
                    ></div>
                  </div>
                ) : (
                  <div className="logo-container-post p-5 shadow rounded border-gray-100 hidden md:flex">
                    <div
                      className="logo-image"
                      style={{
                        backgroundImage: `url(${
                          jobData.logoUrl || PlaceHolder.src
                        })`,
                      }}
                    ></div>
                  </div>
                )}
              </div>
            </div>
            <hr className="mt-4 mb-4 md:w-1/2" />
            <div className="flex flex-col gap-2">
              <p className="flex flex-row items-center gap-2 text-gray-800 text-sm  md:text-base">
                <MdOutlineWorkOutline /> {jobData.jobTitle}
              </p>
              {jobData.salary ? (
                <p className="flex flex-row items-center gap-2 text-gray-800 text-sm md:text-base">
                  {" "}
                  <LiaMoneyBillWaveSolid /> £{jobData.salary} {jobData.payType}{" "}
                </p>
              ) : (
                <p className="flex flex-row items-center gap-2 text-gray-800 text-sm  md:text-base">
                  {" "}
                  <LiaMoneyBillWaveSolid /> Competitive
                </p>
              )}

              <p className="flex flex-row items-center gap-2 text-gray-800 text-sm  md:text-base">
                {" "}
                <MdOutlineLocationOn /> {jobData.location}, {jobData.postcode}{" "}
              </p>
              <p className="flex flex-row items-center gap-2 text-gray-800 text-sm  md:text-base">
                {" "}
                <IoTimeOutline /> {jobData.type}
              </p>
            </div>
            <hr className="mt-4 mb-4 md:w-1/2" />
          </div>
          <div className="px-4 md:px-20 lg:px-40">
            <p className="mt-1 mb-1 font-semibold text-gray-800">
              Job Description
            </p>
            <JobDescription content={htmlContent} />
          </div>
          <div className="px-4 md:px-20 py-5 lg:px-40">
            <p
              onClick={() => setIsOpen(true)}
              className="text-xs text-gray-400 underline hover:opacity-70 cursor-pointer "
            >
              Is this job no longer active? Delete it now
            </p>
          </div>
          <div className="sticky gap-8 flex-row bottom-0 left-0 right-0 w-full flex items-center justify-center bg-[#faf8f4] py-4 shadow border-t">
            <Link href={jobData.link} target="_blank" rel="noopener noreferrer">
              <button className="px-5 border-2 border-black shadow-sm py-2 bg-yellow-400 text-[13px] md:text-sm rounded font-medium hover:opacity-50 transition-all">
                Apply on Company Site
              </button>
            </Link>
            <Link href="/">
              <button className="px-5 shadow-sm py-2 border-2 bg-white border-black text-[13px] md:text-sm rounded font-medium hover:opacity-50 transition-all">
                Back to Jobs
              </button>
            </Link>
          </div>
        </div>

        <Footer />
      </div>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={onClose}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-00"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl p-6 bg-white text-left align-middle shadow-xl transition-all">
                  <div className="flex flex-row justify-between mb-3">
                    <Dialog.Title
                      as="h3"
                      className="text-xl font-semibold leading-6 text-gray-800"
                    >
                      Delete this job listing?
                    </Dialog.Title>
                    <MdClose
                      onClick={onClose}
                      className="hover:opacity-60 cursor-pointer"
                    />
                  </div>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Are you sure you want to delete this job posting? This
                      action is irreversible. Confirm to delete or cancel to
                      keep the posting.
                    </p>
                  </div>

                  <button
                    onClick={() => handleDeleteClick(id)}
                    className="px-3 py-2 mt-4 bg-red-600 text-[13px] text-white md:text-sm rounded font-medium hover:opacity-50 transition-all"
                  >
                    Delete Job Post
                  </button>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export async function getServerSideProps(context: any) {
  const { id } = context.params;

  try {
    const jobDocRef = doc(database, "jobs", id);
    const jobDocSnap = await getDoc(jobDocRef);

    if (jobDocSnap.exists()) {
      const jobData = jobDocSnap.data();

      jobData.postedOn = jobData.postedOn.toDate().toISOString();

      return {
        props: {
          jobData,
        },
      };
    } else {
      console.error("Job not found");
      return {
        notFound: true,
      };
    }
  } catch (error) {
    console.error("Error fetching job data:", error);
    return {
      props: {
        jobData: null,
      },
    };
  }
}

export default JobPage;
