import React from "react";
import NavBar from "@/components/NavBar";
import { BLOCKS, INLINES, MARKS } from "@contentful/rich-text-types";
import Link from "next/link";
import Footer from "@/components/Footer";
import Head from "next/head";
import { client } from "../../../lib/contentful/client";
import { IoIosArrowBack } from "react-icons/io";
import { BsDot, BsFillStarFill } from "react-icons/bs";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { useRouter } from "next/router";

const Post = ({ post, posts }: any) => {
  const router = useRouter();

  const options: any = {
    renderNode: {
      [BLOCKS.PARAGRAPH]: (node: any, children: any) => {
        return (
          <p className="px-1 text-[15px] py-2 text-gray-800 tracking-tight">
            {children}
          </p>
        );
      },

      [INLINES.ENTRY_HYPERLINK]: (node: any) => {
        if (node.data.target.sys.contentType.sys.id === "post") {
          return (
            <Link href={`/blog/${node.data.target.fields.slug}`}>
              {node.data.targets.field.title}
            </Link>
          );
        }
      },

      [INLINES.HYPERLINK]: (node: any) => {
        const text = node.content.find(
          (item: any) => item.nodeType === "text"
        )?.value;

        return (
          <a href={node.data.uri} target="_blank" rel="noopener noreferrer">
            {text}
          </a>
        );
      },

      [BLOCKS.EMBEDDED_ENTRY]: (node: any) => {
        if (node.data.target.sys.contentType.sys.id === "videoEmbed") {
          return (
            <iframe
              height="400"
              width="100%"
              src={node.data.target.fields.embedUrl}
              title={node.data.target.fields.title}
              allowFullScreen={true}
            />
          );
        }
      },

      [BLOCKS.EMBEDDED_ASSET]: (node: any) => {
        return (
          <img
            src={node.data.target.fields.file.url}
            alt={node.data.target.fields.title}
            className="w-full h-auto"
          />
        );
      },
    },
  };

  function formatDate(inputDate: any) {
    const date = new Date(inputDate);

    // Define custom month names
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

    // Add 'th' to day
    const formattedDay = `${day}${getDaySuffix(day)}`;

    // Get the month name from the custom list
    const monthName = monthNames[monthIndex];

    return `${formattedDay} ${monthName} ${year}`;
  }

  // Helper function to get day suffix (e.g., "th", "st", "nd", "rd")
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
      {router.isFallback ? (
        "loading"
      ) : (
        <>
          <Head>
            <title>{`${post.fields.title} | Aim Hire`}</title>
            <meta name="description" content={post.fields.excerpt} />
          </Head>
          <NavBar />
          <main className="flex min-h-screen bg-[#faf8f4] flex-col gap-2 mt-4 md:px-40 w-full">
            <div className="md:bg-white md:shadow md:rounded px-2 md:px-4 mt-2 md:mt-8 relative">
              <div className="px-2 mt-5 mb-5">
                <Link href="/blog">
                  <p className="pb-4 flex flex-row items-center gap-1 text-gray-500 text-sm font-uncut tracking-tight hover:opacity-50 transition-all">
                    <IoIosArrowBack /> Back to Blog
                  </p>
                </Link>
                <h1 className="font-uncut font-bold tracking-tight text-gray-900 text-3xl md:text-4xl">
                  {post.fields.title}
                </h1>
                <p className="font-uncut mt-2 text-sm text-gray-800 tracking-tight">
                  {post.fields.excerpt}
                </p>
                <div className="flex flex-row items-center mt-1">
                  <p className="font-uncut tracking-tight text-sm text-blue-500">
                    {post.fields.type[0]}
                  </p>
                  <p className="font-uncut tracking-tight text-sm text-gray-500">
                    <BsDot />
                  </p>
                  <p className="tracking-tight font-uncut text-sm text-gray-500">
                    {" "}
                    {formatDate(post.fields.date)}
                  </p>
                </div>
              </div>

              <div className="relative w-full rounded-sm overflow-hidden">
                <img
                  src={`https:${post.fields.coverImage.fields.file.url}`}
                  alt={`Cover Image for ${post.fields.title}`}
                  className="object-cover h-[23rem] w-full max-w-full"
                />
              </div>

              <div className="mt-2 mb-6">
                <div className="text-md font-uncut leading-snug tracking-tight text-left text-gray-800">
                  {documentToReactComponents(post.fields.content, options)}
                </div>
              </div>
            </div>

            <div className="flex w-full items-center py-12 justify-center flex-col">
              <p className="text-[13px] font-uncut text-tight text-gray-500 flex flex-row items-center gap-1">
                <BsFillStarFill className="text-[10px] text-blue-400 -mt-[2px]" />{" "}
                Read More
              </p>
              <p className="font-uncut px-4 tracking-tight text-gray-700 text-center text-md sm:text-2xl">
                Explore the world of AI & the how to utilise it to progress your
                career
              </p>
            </div>

            <div className="w-full mb-20 px-2 flex flex-row gap-3 items-center justify-center flex-wrap">
              {posts.slice(0, 3).map((post: any, i: number) => (
                <div
                  key={i}
                  className="bg-white shadow transition-all hover:opacity-60 w-full sm:w-[32%] flex-col rounded justify-center flex items-center p-4"
                >
                  <Link
                    href={`/blog/${post.fields.slug}`}
                    aria-label={post.fields.excerpt.title}
                  >
                    <p className="text-[12px] text-blue-400">
                      {post.fields.type}
                    </p>

                    <p className="font-display font-semibold tracking-tight text-[1.2rem] text-gray-800 line-clamp-title">
                      {post.fields.title}
                    </p>
                    <p className="text-[13px] text-gray-500 font-uncut">
                      {formatDate(post.fields.date)}
                    </p>
                    <div>
                      {" "}
                      <p className="font-uncut line-clamp tracking-tight text-sm text-gray-500">
                        {post.fields.excerpt}
                      </p>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </main>
          <Footer />
        </>
      )}
    </>
  );
};

export const getStaticProps = async ({ params }: any) => {
  const { slug } = params;

  const postList = await client.getEntries({ content_type: "post" });

  const response = await client.getEntries({
    content_type: "post",
    "fields.slug": slug,
  });

  if (!response?.items?.length) {
    return {
      redirect: {
        destination: "/posts",
        permanent: false,
      },
    };
  }

  return {
    revalidate: 60, // Corrected placement
    props: {
      posts: postList?.items,
      post: response?.items?.[0],
    },
  };
};

export const getStaticPaths = async () => {
  const response = await client.getEntries({ content_type: "post" });

  const paths = response.items.map((item: any) => ({
    params: {
      slug: item.fields.slug,
    },
  }));

  return {
    paths,
    fallback: true,
  };
};

export default Post;
