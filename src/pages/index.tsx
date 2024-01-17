import { useState } from "react";
import Image from "next/image";
import HappyCustomer from "../../public/images/HappyCustomer.svg";
import NavBar from "@/components/NavBar";
import JobList from "@/components/JobList";
import Footer from "@/components/Footer";
import { collection, getDocs, query, addDoc } from "firebase/firestore";
import { database } from "@/firebase/config";
import Head from "next/head";
import { FaChevronRight } from "react-icons/fa";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { MdClose } from "react-icons/md";

function Home({ data }: any) {
  const [selectedCategory, setSelectedCategory] = useState<any>("");

  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("Submit");

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    setStatus("loading...");

    try {
      const formData = {
        email: email,
      };

      const contactRef = collection(database, "email");
      await addDoc(contactRef, formData);

      // Clear form after submission

      setEmail("");

      setStatus("Email Submitted Successfully!");
    } catch (error) {
      console.log(error);
    }
  };

  const onClose = () => {
    setStatus("Submit");
    setEmail("");
    setIsOpen(false);
  };

  return (
    <>
      <Head>
        <title>
          The Best & Latest Retail Jobs in London | London Retail Jobs
        </title>
        <meta
          name="description"
          content="Explore exciting retail job opportunities in London! Find the latest openings, connect with top employers, and kickstart your career in the vibrant retail industry. Discover diverse roles, from sales associates to management positions. Your next fulfilling job in London's dynamic retail scene awaits – browse, apply, and thrive!"
        />
      </Head>
      <NavBar />
      <main className="w-full">
        <div className="flex flex-col md:flex-row items-center mt-14 md:mt-8 justify-between px-4 md:px-40 w-full">
          <div className="flex w-full md:w-3/5 flex-col gap-3 mb-8 md:mb-0">
            <h1 className="text-xl md:text-5xl font-semibold	text-gray-900 md:text-left text-center">
              The best job offers in the London retail industry!
            </h1>
            <p className="text-sm md:text-md md:pr-10 md:mx-0 mx-6 text-gray-800 font-light md:text-left text-center">
              Regardless of whether you are looking for a full-time job, want to
              earn extra money during your studies, or need extra money for the
              holidays - with us you will find an offer tailored to your needs!
            </p>
            <button
              onClick={() => setIsOpen(true)}
              className="md:px-3 hidden md:flex py-2 bg-yellow-400 text-[13px] md:text-sm rounded flex-row gap-2 items-center font-medium hover:opacity-50 w-max transition-all"
            >
              <p> Subscribe to email list</p>{" "}
              <FaChevronRight className="text-[12px] mt-[1px]" />
            </button>
          </div>
          <div className="md:flex hidden w-full md:w-2/5">
            <Image src={HappyCustomer} alt="Retail Jobs London" />
          </div>
        </div>
      </main>
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
                      Subscribe Now
                    </Dialog.Title>
                    <MdClose
                      onClick={onClose}
                      className="hover:opacity-60 cursor-pointer"
                    />
                  </div>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Stay in the loop with the latest job opportunities! Enter
                      your email to receive updates on our newest vacancies,
                      ensuring you never miss out on exciting career
                      opportunities!
                    </p>
                  </div>

                  <form
                    onSubmit={handleSubmit}
                    className="mt-4 flex flex-col gap-2"
                  >
                    <input
                      onChange={(event) => setEmail(event.target.value)}
                      type="email"
                      placeholder="Enter Email"
                      value={email}
                      required
                      className="border text-sm py-2 px-3 shadow-sm rounded"
                    />
                    <button
                      type="submit"
                      className="px-2 py-2 bg-yellow-400 text-[13px] md:text-sm rounded font-medium hover:opacity-50 transition-all"
                    >
                      <p>{status}</p>
                    </button>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
      <div id="jobListSection">
        <JobList
          data={data}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />
      </div>
      <Footer />
    </>
  );
}

export async function getServerSideProps() {
  try {
    const jobQuery = query(collection(database, "jobs"));
    const jobSnapshot = await getDocs(jobQuery);
    const data = jobSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      postedOn: doc.data().postedOn.toDate().toISOString(), // Convert to string
    }));

    return {
      props: {
        data,
      },
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return {
      props: {
        data: [],
      },
    };
  }
}

export default Home;
