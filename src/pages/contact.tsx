import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import contact from "../../public/images/contact.svg";
import Image from "next/image";
import { useState } from "react";
import Head from "next/head";
import { collection, addDoc } from "firebase/firestore";
import { database } from "@/firebase/config";

const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    setStatus("loading");

    try {
      const formData = {
        name: name,
        email: email,
        message: message,
      };

      const contactRef = collection(database, "contact");
      await addDoc(contactRef, formData);

      // Clear form after submission
      setName("");
      setEmail("");
      setMessage("");

      setStatus("done");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Head>
        <title>Contact us | London Retail Jobs</title>
        <meta
          name="description"
          content="Explore exciting retail job opportunities in London! Find the latest openings, connect with top employers, and kickstart your career in the vibrant retail industry. Discover diverse roles, from sales associates to management positions. Your next fulfilling job in London's dynamic retail scene awaits – browse, apply, and thrive!"
        />
      </Head>
      <NavBar />
      <main className="w-full">
        <div className="flex flex-row gap-2 mt-8 items-center justify-center px-4 md:px-40 w-full">
          <div className="flex flex-col w-3/5">
            <h1 className="text-2xl md:text-4xl font-semibold	text-gray-900">
              Have a question? Send us a message!
            </h1>
            <p className="text-gray-800 mt-2 font-light">
              You need help? Something&apos;s not working? Would you like to ask
              us something? Contact us using the contact form or give us a
              call/email and we will try to help you!
            </p>
            {/* <div className="mt-2 flex gap-1 flex-col">
              <p className="text-gray-900">📫 info@retailjobslondon.co.uk</p>
              <p className="text-gray-900">☎️ 07546 096 173</p>
            </div> */}
          </div>
          <div className="flex w-full md:w-2/5">
            <Image src={contact} alt="Retail Jobs London" />
          </div>
        </div>
        <div className="w-full bg-[#faf8f4] mt-14 items-center justify-center flex">
          <div className="w-3/5 bg-white shadow rounded-lg p-10 mt-20 mb-20">
            <form onSubmit={handleSubmit}>
              <p className="text-gray-800 text-2xl font-semibold">Contact us</p>

              <p className="mt-5 text-gray-800 text-sm font-medium">
                First name and last name
              </p>
              <input
                required
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="w-full border border-gray-200 rounded p-2 text-sm mt-1"
                placeholder="John Doe"
              />
              <p className="mt-5 text-gray-800 text-sm font-medium">
                Email Address
              </p>
              <input
                required
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full border border-gray-200 rounded p-2 text-sm mt-1"
                placeholder="JohnDoe@email.com"
              />

              <p className="mt-5 text-gray-800 text-sm font-medium">Message</p>
              <textarea
                required
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                className="w-full border border-gray-200 rounded p-2 text-sm mt-1"
                rows={5}
                placeholder="Enter your message here"
              />
              <div className="mt-8 flex items-center justify-center">
                <button
                  type="submit"
                  className="px-5 py-3 cursor-pointer bg-yellow-400 w-max rounded font-medium hover:opacity-70 transition-all"
                >
                  {!status ? (
                    <p>Submit</p>
                  ) : status === "loading" ? (
                    <p>Sending ...</p>
                  ) : status === "done" ? (
                    <p>Sent!</p>
                  ) : null}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Contact;
