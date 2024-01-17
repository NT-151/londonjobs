import NavBar from "@/components/NavBar";
import { client } from "../../../lib/contentful/client";
import { BsFillStarFill } from "react-icons/bs";
import Link from "next/link";
import { AiOutlineRight } from "react-icons/ai";
import Footer from "@/components/Footer";
import PostCard from "@/components/blog/PostCard";
import Head from "next/head";

const Blog = ({ posts }: any) => {
  const featuredPost = posts[0];
  function formatDate(inputDate: any) {
    const date = new Date(inputDate);

    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    // Extract day, month, and year separately
    const day = date.getDate();
    const monthIndex = date.getMonth();
    const year = date.getFullYear();

    const formattedDay = `${day}${getDaySuffix(day)}`;

    const monthName = monthNames[monthIndex];

    return `${formattedDay} ${monthName} ${year}`;
  }

  function getDaySuffix(day: any) {
    if (day >= 11 && day <= 13) {
      return "th";
    }
    switch (day % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  }

  return (
    <>
      <Head>
        <title>Blog | London Retail Jobs</title>
        <meta
          name="description"
          content="The lastest and best retail jobs in London. Updated daily. Check out the latest news and articles."
        />
      </Head>
      <NavBar />
      <main className="flex min-h-screen bg-[#faf8f4] flex-col gap-2 mt-4 px-4 md:px-40 w-full">
        <div className="w-full flex px-2 mt-8 mb-8 flex-col">
          <h1 className="font-display text-3xl text-gray-700 font-bold tracking-normal">
            Blog
          </h1>
          <p className="text-gray-500 text-sm">
            The latest News, Opinions and more from the world of AI and
            recruitment
          </p>
          <input
            className="border bg-white border-gray-300 w-1/2 sm:w-1/3 p-1 shadow-sm text-[13px] font-uncut rounded-lg mt-1"
            placeholder="Search.."
          />
        </div>

        <div className="w-full sm:px-4 pb-3">
          <div className="flex flex-col md:flex-row bg-white rounded-sm shadow-md">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt="London Retail Blog Post Cover Image"
              className="object-cover md:h-[28rem] w-full md:w-1/2 rounded-t sm:rounded-tr-none sm:rounded-sm"
              src={`https:${featuredPost.fields.coverImage.fields.file.url}`}
            />
            <div className="w-full md:w-1/2 flex flex-col py-4 md:py-6 px-4 md:px-6 sm:px-10 justify-center">
              <p className="text-[13px] font-uncut text-tight text-blue-400 flex flex-row items-center gap-1">
                <BsFillStarFill className="text-[10px] -mt-[2px]" /> Featured
              </p>
              <h1 className="font-display text-lg md:text-3xl text-gray-800 font-bold tracking-tight">
                {featuredPost.fields.title}
              </h1>
              <p className="text-[13px] text-gray-500 font-uncut">
                {formatDate(featuredPost.fields.date)}
              </p>
              <p className="font-uncut text-[13px] sm:text-sm text-gray-700">
                {featuredPost.fields.excerpt}
              </p>
              <Link
                href={`/blog/${featuredPost.fields.slug}`}
                aria-label={featuredPost.fields.title}
                className="block"
              >
                <button className="border sm:mb-2 mt-4 text-gray-700 bg-[radial-gradient(ellipse_at_right,_var(--tw-gradient-stops))] from-gray-50 to-white border-gray-300 w-max px-2 py-1 shadow-sm text-[13px] rounded flex flex-row items-center gap-1 hover:opacity-50 transition-all">
                  Read More <AiOutlineRight />
                </button>
              </Link>
            </div>
          </div>
        </div>

        <div className="flex w-full items-center py-24 justify-center flex-col">
          <p className="text-[13px] font-uncut text-tight text-gray-500 flex flex-row items-center gap-1">
            <BsFillStarFill className="text-[10px] text-blue-400 -mt-[2px]" />{" "}
            Our Blog
          </p>
          <p className="font-uncut px-4 tracking-tight text-gray-700 text-center text-md sm:text-2xl">
            Explore the world of AI & the how to utilise it to progress your
            career
          </p>
        </div>

        <div className="flex-row flex-wrap gap-6 mb-8 w-full flex items-center justify-center">
          {posts.map((post: any, index: number) =>
            index !== 0 ? <PostCard post={post} key={post.fields.slug} /> : null
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Blog;

export const getStaticProps = async () => {
  const response = await client.getEntries({ content_type: "post" });

  return {
    props: {
      posts: response.items,
      revalidate: 60,
    },
  };
};
