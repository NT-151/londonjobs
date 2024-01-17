import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { RiImageAddLine } from "react-icons/ri";
import PlaceHolder from "../../public/images/placeholder.png";
import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { database } from "@/firebase/config";
import { FaRegCheckCircle } from "react-icons/fa";

import "react-quill/dist/quill.snow.css"; // Import styles
import dynamic from "next/dynamic";
import Head from "next/head";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const PostJob = () => {
  const [jobTitle, setJobTitle] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [logoFile, setLogoFile] = useState<any>(null);
  const [adTitle, setAdTitle] = useState("");
  const [location, setLocation] = useState("");
  const [employmentType, setEmploymentType] = useState("Full Time");
  const [salary, setSalary] = useState("");
  const [payDuration, setPayDuration] = useState("per year");
  const [externalWebsite, setExternalWebsite] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [logoAdded, setLogoAdded] = useState(false);
  const [logoPreview, setLogoPreview] = useState(null);
  const [workplaceCategory, setWorkplaceCategory] = useState("");
  const [jobDescription, setJobDescription] = useState<any>("");
  const [jobAdded, setJobAdded] = useState("");
  const [postcode, setPostcode] = useState("");

  const handleLogoChange = (e: any) => {
    const file = e.target.files[0];
    setLogoFile(file);
    setLogoAdded(true);
    if (file) {
      const reader: any = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setLogoPreview(null);
    }
  };

  const handleChange = (value: any) => {
    setJobDescription(value);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setJobAdded("loading");

    const htmlContent = jobDescription;

    try {
      // Upload logo to Firebase Storage
      const storage = getStorage();
      const logoRef = ref(storage, `logos/${companyName}/${logoFile.name}`);
      await uploadBytes(logoRef, logoFile);

      // Get the logo URL
      const logoUrl = await getDownloadURL(logoRef);

      // Save job details to Firestore
      const jobData = {
        adTitle: adTitle,
        category: workplaceCategory,
        companyName: companyName,
        description: htmlContent,
        jobTitle: jobTitle,
        link: externalWebsite,
        location: location,
        logoUrl,
        payType: payDuration,
        postedOn: serverTimestamp(),
        postcode: postcode,
        salary: salary,
        type: employmentType,
        featured: true,
        submittersName: name,
        submittersEmail: email,
      };

      const jobsCollectionRef = collection(database, "jobs");
      await addDoc(jobsCollectionRef, jobData);

      // Clear form after submission
      setJobTitle("");
      setCompanyName("");
      setLogoFile(null);

      setJobAdded("done");
    } catch (error) {
      console.error("Error posting job:", error);
      setJobAdded("error");
    }
  };

  return (
    <>
      <Head>
        <title>Post a job | London Retail Job</title>
        <meta
          name="description"
          content="The lastest and best retail jobs in London. Updated daily. Add your own retail job here."
        />
      </Head>
      <NavBar />
      <main className="w-full">
        <div className="flex flex-col gap-2 mt-20 items-center justify-center px-4 md:px-40 w-full">
          <h1 className="text-xl md:text-4xl font-semibold text-center	text-gray-900">
            Add your job post now!
          </h1>
          <p className="text-gray-800 mt-1 font-light text-center text-sm md:text-lg">
            RetailJobsLondon.co.uk is the best place to find and publish retail
            job opportunities in London
          </p>
          <div className="flex flex-col gap-2 mt-3 text-center font-light">
            <p className="text-sm md:text-lg px-4 text-gray-800">
              📌 30 days of promotion on the home page
            </p>
            <p className="text-sm md:text-lg px-4 text-center text-gray-800">
              🎯 Be seen by targeted users looking for jobs in retail in London!
            </p>
            <p className="text-sm md:text-lg px-4 text-center text-gray-800">
              📣 Will be shared on social media also!
            </p>

            <p className="text-sm md:text-lg px-4 text-center text-gray-800">
              📈 Distribution in the Google Jobs recruitment network
            </p>
          </div>
        </div>

        <div className="w-full bg-[#faf8f4] px-4 mt-14 items-center justify-center flex">
          <div className="w-full md:w-3/5 bg-white shadow rounded-lg py-8 px-4 md:p-10 mt-20 mb-20">
            <form onSubmit={handleSubmit}>
              <p className="text-gray-800 text-lg md:text-xl font-semibold">
                Information about company
              </p>
              <p className="mt-6 text-gray-800 text-sm font-medium">
                Company Name
              </p>
              <input
                required
                className="w-full border border-gray-200 rounded p-2 text-sm mt-1"
                placeholder="Harrods"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
              />

              <p className="mt-6 text-gray-800 text-sm font-medium">
                Company Logo
              </p>
              <div className="flex flex-row gap-4 items-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}

                <img
                  alt="London Retail Jobs placeholder image"
                  src={logoPreview ? logoPreview : PlaceHolder.src}
                  className="w-20 py-1 px-1 border rounded mt-3 shadow-sm"
                />
                <div className="flex items-center">
                  <label
                    htmlFor="fileInput"
                    className="flex rounded border border-gray-100 flex-row items-center bg-gray-50 gap-2 hover:opacity-70 transition-all py-2 px-3 cursor-pointer"
                  >
                    {logoAdded ? (
                      <div className="flex flex-row gap-2 items-center">
                        <FaRegCheckCircle className="text-green-500 text-sm" />
                        <p className="text-sm text-gray-700 font-medium">
                          Logo Added
                        </p>
                      </div>
                    ) : (
                      <div className="flex flex-row gap-2 items-center">
                        <RiImageAddLine />
                        <p className="text-[13px] md:text-sm text-gray-700 font-medium">
                          Add logo
                        </p>
                      </div>
                    )}
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoChange}
                    id="fileInput"
                    className="hidden"
                  />
                </div>

                {/* <button 
                className="flex rounded flex-row items-center gap-2 shadow-sm hover:opacity-70 transition-all bg-gray-200 py-2 px-3">
                  <RiImageAddLine />
                  <p className="text-sm text-gray-800 font-medium">Add logo</p>
                </button> */}
              </div>
              <p className="mt-2 text-[13px] text-gray-500">
                Format: JPEG, JPG, PNG. Size max 2 MB
              </p>
              <hr className="w-full my-8" />
              <p className="text-gray-800 text-lg md:text-xl font-semibold">
                Advertisement details
              </p>
              <p className="mt-6 text-gray-800 text-sm font-medium">Ad Title</p>
              <input
                required
                className="w-full border border-gray-200 rounded p-2 text-sm mt-1"
                placeholder="Harrods - Shop Floor Assistant £15 per hour"
                value={adTitle}
                onChange={(e) => setAdTitle(e.target.value)}
              />
              <p className="mt-3 text-gray-800 text-sm font-medium">Position</p>
              <input
                required
                className="w-full border border-gray-200 rounded p-2 text-sm mt-1"
                placeholder="Front of House Assistant"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
              />
              <p className="mt-3 text-gray-800 text-sm font-medium">
                Job Description
              </p>
              <ReactQuill
                // @ts-ignore:next-line
                value={jobDescription}
                className="mt-2 border-gray-200 h-[300px]"
                onChange={handleChange}
                modules={{
                  toolbar: [
                    [{ header: [1, 2, false] }],
                    ["bold", "italic", "underline", "strike", "blockquote"],
                    [{ list: "ordered" }, { list: "bullet" }],
                    ["link", "image"],
                    [{ color: [] }, { background: [] }],
                    ["clean"],
                  ],
                }}
              />

              <p className="mt-24 md:mt-20 text-gray-800 text-sm font-medium">
                Workplace Location
              </p>
              <input
                required
                className="w-full border border-gray-200 rounded p-2 text-sm mt-1 mb-4"
                placeholder="White City"
                value={location}
                onChange={(event) => setLocation(event.target.value)}
              />
              <p className="mt-3 text-gray-800 text-sm font-medium">
                Workplace Postcode
              </p>
              <input
                required
                className="w-full border border-gray-200 rounded p-2 text-sm mt-1 mb-4"
                placeholder="SW3 7UH"
                value={postcode}
                onChange={(event) => setPostcode(event.target.value)}
              />
              <p className="mt-3 text-gray-800 text-sm font-medium">
                Workplace Category
              </p>
              <select
                className="w-full border border-gray-200 rounded p-2 text-sm mt-1 text-gray-800"
                placeholder="Front or House Assistant"
                value={workplaceCategory}
                onChange={(event) => setWorkplaceCategory(event.target.value)}
              >
                <option value="">Select One</option>
                <option value="Beauty">Beauty</option>
                <option value="Temp">Temp</option>
                <option value="Management">Management</option>
                <option value="Luxury Brands">Luxury Brands</option>
                <option value="Fashion">Fashion</option>
                <option value="Restaurant">Restaurant</option>
                <option value="Gym">Gym</option>
                <option value="Technology">Technology</option>
                <option value="Warehouse">Warehouse</option>
                <option value="Barista">Barista</option>
                <option value="Supermarket">Supermarket</option>
                <option value="Sports">Sports</option>
                <option value="Other">Other</option>
              </select>
              <hr className="w-full my-8" />
              <p className="text-gray-800 text-lg md:text-xl font-semibold">
                Job details
              </p>
              <p className="mt-3 text-gray-800 text-sm font-medium">
                Type of employment
              </p>
              <select
                className="w-full border border-gray-200 rounded p-2 text-sm mt-1 text-gray-800"
                placeholder="Front or House Assistant"
                value={employmentType}
                required
                onChange={(event) => setEmploymentType(event.target.value)}
              >
                <option value="Full Time">Full Time</option>
                <option value="Part Time">Part Time</option>
                <option value="Temp">Temp</option>
                <option value="Contract">Contract</option>
              </select>
              <p className="mt-3 text-gray-800 text-sm font-medium">
                Gross Salary
              </p>
              <div className="flex flex-row gap-2 items-center mt-1 mb-12">
                <input
                  className=" border border-gray-200 rounded p-2 text-sm w-3/4"
                  placeholder="£22,000"
                  value={salary}
                  onChange={(event) => setSalary(event.target.value)}
                />
                <select
                  className="w-1/4 border border-gray-200 rounded p-2 text-sm text-gray-800"
                  placeholder="Front or House Assistant"
                  value={payDuration}
                  onChange={(event) => setPayDuration(event.target.value)}
                >
                  <option value="per year">Per Year</option>
                  <option value="per hour">Per Hour</option>
                </select>
              </div>

              <hr className="w-full my-8" />
              <p className="text-gray-800 text-lg md:text-xl font-semibold">
                Link to Application
              </p>
              <p className="mt-3 text-gray-800 text-sm font-medium">
                Link to external website
              </p>
              <input
                required
                className="w-full border border-gray-200 rounded p-2 text-sm mt-1 mb-5"
                placeholder="https://"
                value={externalWebsite}
                onChange={(event) => setExternalWebsite(event.target.value)}
              />

              <hr className="w-full my-8" />
              <p className="text-gray-800 text-lg md:text-xl font-semibold">
                Contact Details
              </p>
              <p className="text-[13px] text-gray-500">
                This data is only for us to keep in touch with you in case you
                have any questions about the announcement. They will not be
                displayed anywhere.
              </p>
              <p className="mt-3 text-gray-800 text-sm font-medium">
                First name and last name
              </p>
              <input
                className="w-full border border-gray-200 rounded p-2 text-sm mt-1"
                placeholder="Harry Potter"
                value={name}
                required
                onChange={(event) => setName(event.target.value)}
              />
              <p className="mt-3 text-gray-800 text-sm font-medium">
                Email Address
              </p>
              <input
                required
                type="email"
                className="w-full border border-gray-200 rounded p-2 text-sm mt-1"
                placeholder="HarryPotter@Hogwarts.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
              <div className="mt-14 mb-2 flex items-center justify-center">
                <button
                  type="submit"
                  className="px-5 py-3 cursor-pointer bg-yellow-400 w-max rounded font-medium hover:opacity-70 transition-all"
                >
                  {!jobAdded ? (
                    <p>Submit Job Ad</p>
                  ) : jobAdded === "loading" ? (
                    <p>Adding Job ...</p>
                  ) : jobAdded === "done" ? (
                    <p>Job added!</p>
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

PostJob.displayName = "PostJob";

export default PostJob;
