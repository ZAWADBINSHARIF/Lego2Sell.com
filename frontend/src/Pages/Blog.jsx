import axios from "axios";
import React, { useEffect, useState } from "react";
import { Notification } from "@mantine/core";
import { IconCheck } from "@tabler/icons-react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";

import "./styles.css";
import "./blog.css";
import baseUrl from "../context/baseUrl";
const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategory] = useState([]);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true); // Track loading state
  const storedUserId = localStorage.getItem("userId");
  const latestBlogs = blogs?.slice(0, 5);
  const singleBlogs = blogs?.slice(0, 1);
  const [searchValue, setSearchValue] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchSectionVisible, setSearchSectionVisible] = useState(true);
  const [postSectionVisible, setPostSectionVisible] = useState(true);

  const handleInputChange = (event) => {
    setSearchValue(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    const apiUrl = baseUrl + "/admin/api/blog-title?title=" + searchValue;
    axios
      .get(apiUrl)
      .then((response) => {
        console.log("Search result:", response.data.data);
        setSearchResults(response.data.data);
        setPostSectionVisible(false);
        setSearchSectionVisible(true);
      })
      .catch((error) => {
        console.error("Error fetching blog details:", error);
      });
  };

  useEffect(() => {
    const apiUrl = baseUrl + "/admin/api/blog/";
    axios
      .get(apiUrl, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Accept: "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization, Accept",
          "Access-Control-Allow-Credentials": "true",
          "Access-Control-Max-Age": "86400",
          "Access-Control-Expose-Headers":
            "Content-Type, Authorization, Accept",
        },
      })
      .then((response) => {
        setBlogs(response.data.data);
        console.log("DATA:", response.data.data);
        setSearchSectionVisible(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  useEffect(() => {
    const apiUrl = baseUrl + "/admin/service/api/category";
    axios
      .get(apiUrl)
      .then((response) => {
        setCategory(response.data.data);
        console.log("DATA:", response.data.data);
      })

      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const truncateText = (text, limit) => {
    const words = text.split(" ");
    const truncated = words?.slice(0, limit).join(" ");
    return truncated + (words?.length > limit ? "..." : "");
  };
  // create a function to convert the date into a human readable format
  const formatDate = (date) => {
    const newDate = new Date(date);
    return newDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  function hexToRgba(hex, alpha = 1) {
    const hexRegex = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i;
    const result = hexRegex.exec(hex);

    if (!result) {
      return null;
    }

    const [, r, g, b] = result.map((val) => parseInt(val, 16));

    if (alpha < 0 || alpha > 1) {
      return null; // Invalid alpha value
    }

    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  return (
    <div className="container-fluid mx-auto mt-2 pt-4">
      <div className="col-12 text-center standard_page_content my-8">
        <form
          onSubmit={handleSearchSubmit}
          className="flex items-center justify-center"
        >
          <input
            type="text"
            placeholder="Search..."
            className="border px-6 py-2 w-full md:w-[20%] text-md font-medium outline-none rounded-l-xl"
            required
            value={searchValue}
            onChange={handleInputChange}
          />
          <button
            type="submit"
            className=" px-2 text-md py-[10px] rounded-r-xl bg-blue-500 text-white "
            style={{
              height: 42,
            }}
          >
            Search
          </button>
        </form>
      </div>
      <section className="blog blog_list blog_header pb-5">
        <div className="container">
          <div className="row ">
            <div className="col-12 text-center standard_page_content">
              <div className="Blog_blog_header_title__u2hU5">
                <h1
                  className="category_title lg:text-[60px] text-[35px] "
                  style={{
                    color: "#093664",
                    fontWeight: "700",
                    fontFamily: "Source Sans 3",
                  }}
                >
                  Explore Our Latest News, Reviews <br /> and Comprehensive
                  Insights.
                </h1>
                <p
                  className="Blog_blog_header_sub_title__B40oZ"
                  style={{
                    fontSize: "19.2px",
                    color: "#617B8D",
                    fontFamily: "Source Sans 3",
                  }}
                >
                  Here You Will Discover An Array Of Top Tips and Tricks As Well
                  As Handy Guides Tailored For LEGO® Enthusiasts!
                </p>
              </div>
            </div>
          </div>

          <div className="category-container  mt-5">
            <div className="my-2  justify-center gap-2 items-center flex flex-wrap ">
              {categories?.map((category, index) => (
                <a
                  href={`/bloglist?catId=${category._id}`}
                  key={category._id}
                  className={`  text-black mt-2  text-[17px] py-[7px]  px-6 rounded-[44px] `}
                  style={{
                    color: "black",
                    fontWeight: 700,
                    fontFamily: "Verdana",
                    border: `2px solid ${category?.color}`,
                    borderColor: category?.color,
                    backgroundColor: hexToRgba(category?.color, 0.5),
                  }}
                >
                  {category.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {postSectionVisible && (
        <div>
          <section
            className="blog blog_list pb-5"
            style={{
              marginBottom: "3rem !important",
            }}
          >
            <div className="container sm:container-fluid ">
              <h3
                className="mb-4"
                style={{
                  fontWeight: "bold",
                  color: "#093664",
                  fontSize: "20px",
                }}
              >
                Featured Posts
              </h3>
              <div className="flex lg:flex-row flex-col gap-10">
                {singleBlogs?.map((blog) => (
                  <div className="col-12 col-lg-7 ml-[-15px] mr-[-15px]">
                    <a
                      href={`/blogdetails?blogId=${blog._id}`}
                      key={blog._id}
                      title="Book Flipping: How to Buy and Resell Books for Profit"
                      className="Blog_new_article_card_link__28EiO"
                    >
                      <div
                        className="Blog_new_article_card__qD7wR pb-8 flex flex-col justify-between"
                        style={{ height: "calc(100% - 20px)" }}
                      >
                        <div className="Blog_image_container__9bzik mb-2 object-contain">
                          <img
                            className="lazy blog-image object-contain"
                            src={blog.image}
                            alt="Book Flipping: How to Buy and Resell Books for Profit"
                          />
                        </div>
                        <div>
                          <a
                            className="text-[11px] p rounded-full px-[10px] py-1  font-bold text-sm animate-up border-[1px] border-[grey]"
                            style={{
                              color: "black",
                              fontSize: 11,
                              border: `2px solid ${blog.categoryName?.color}`,
                              borderColor: blog.categoryName?.color,
                              backgroundColor: hexToRgba(
                                blog.categoryName?.color,
                                0.5
                              ),
                            }}
                            href={`/bloglist?catId=${blog?.categoryId}`}
                          >
                            {blog.categoryName.name}
                          </a>
                        </div>
                        <h2
                          className="my-3 Blog_new_article_title__CusWh textHeading"
                          style={{
                            minHeight: "auto",
                            fontSize: "24px",
                            color: "#093664",
                            fontWeight: "700",
                          }}
                        >
                          {blog.title}
                        </h2>
                        <div
                          className="descriptionContainer"
                          dangerouslySetInnerHTML={{
                            __html: blog?.subTitle && blog?.subTitle,
                          }}
                          style={{
                            font: "16px",
                            height: 48,
                            overflow: "hidden",
                          }}
                        />

                        <div className="d-flex items-center mt-[20px]">
                          <img
                            src="/favicon.png"
                            style={{
                              width: "50px",
                              height: "50px",
                              borderRadius: "50px",
                            }}
                            alt="WeBuyBooks"
                          />
                          <div className="ml-3">
                            <div className="Blog_new_article_profile__xlVqE font-bold">
                              Lego2Sell
                            </div>
                            <div className="Blog_new_article_posted__X5fva">
                              {formatDate(blog.created_at)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </a>
                  </div>
                ))}

                {latestBlogs?.length > 0 ? (
                  <div
                    className="flex flex-col"
                    style={{
                      gap: "1.5rem",
                    }}
                  >
                    {latestBlogs?.map((blog, index) => (
                      <div className="row single_latest_blog" key={index}>
                        <div
                          className="col-4 px-0 "
                          style={{
                            height: 120,
                          }}
                        >
                          <div
                            className="h-[135px] w-[100%] overflow-hidden  object-contain latest_blog_image_container"
                            style={{
                              aspectRatio: "16/13",
                            }}
                          >
                            <img
                              className="h-full w-[100%] max-h-[135px] lazy object-cover  "
                              src={blog.image}
                              alt="Top 5 Air Fryer Cookbooks"
                              style={{
                                height: 120,
                                width: 170,
                                objectFit: "contain",
                              }}
                            />
                          </div>
                        </div>
                        <div
                          className="col-8"
                          style={{
                            height: 110,
                          }}
                        >
                          <a
                            className="text-[11px] p rounded-full px-[10px] py-1  font-bold text-sm animate-up border-[1px] border-[grey]"
                            style={{
                              color: "black",
                              fontSize: 13,
                              marginLeft: 15,
                              border: `2px solid ${blog.categoryName?.color}`,
                              borderColor: blog.categoryName?.color,
                              backgroundColor: hexToRgba(
                                blog.categoryName?.color,
                                0.5
                              ),
                              height: 22,
                            }}
                            href={`/bloglist?catId=${blog?.categoryId}`}
                          >
                            {blog.categoryName.name}
                          </a>
                          <Link
                            to={`/blogdetails?blogId=${blog._id}`}
                            key={blog._id}
                          >
                            <h2
                              className="my-3 Blog_new_article_title__CusWh textHeading"
                              style={{
                                fontSize: "18px !important",
                                paddingLeft: 15,
                                lineHeight: "21.6px",
                                color: "#093664",
                                textDecoration: "none",
                                fontWeight: "700",
                              }}
                            >
                              {blog.title}
                            </h2>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      width: "100%",
                    }}
                  >
                    <div class="loader"></div>
                  </div>
                )}
              </div>
            </div>
          </section>

          <section className="blog blog_list" id="recentPostSection">
            <div className="container sm-container-fluid ">
              <h4
                className="mb-4"
                style={{ fontWeight: "bold", color: "#093664" }}
              >
                Most Recent Posts
              </h4>
              <div className="row justify-start flex-wrap">
                {blogs?.map((blog) => (
                  <div className="blogContainerMain  w-[380px] overflow-hidden mb-12  col-12 col-md-6 col-lg-4 col-xl-4    blogs_card "
                    style={{
                      padding: 0
                    }}
                  >
                    <div className=" h-full    rounded-sm">
                      <Link
                        to={`/blogdetails?blogId=${blog._id}`}
                        key={blog._id}
                        style={{ textDecoration: "none", color: "#093664" }}
                      >
                        <div className=" mb-4">
                          <img
                            className="lazy  h-[349px] w-[100%] object-contain blogs_section_image"
                            src={blog.image}
                            alt="11 Best Comic Books of All Time: Honouring National Comic Book Day"
                          />
                        </div>
                        <a
                          className="text-[11px] p rounded-full px-[10px] py-1  font-bold text-sm animate-up border-[1px] border-[grey]"
                          style={{
                            color: "black",
                            fontSize: 11,
                            border: `2px solid ${blog.categoryName?.color}`,
                            borderColor: blog.categoryName?.color,
                            backgroundColor: hexToRgba(
                              blog.categoryName?.color,
                              0.5
                            ),
                          }}
                          href={`/bloglist?catId=${blog?.categoryId}`}
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                        >
                          {blog.categoryName.name}
                        </a>
                        <h2
                          className=" my-3 Blog_new_article_title__CusWh  textHeading"
                          style={{
                            fontSize: "24px",
                            lineHeight: "28px",
                            fontWeight: "700",
                            height: "56px",
                            paddingRight: "10px",
                            paddingLeft: "10px",
                          }}
                        >
                          {blog.title}
                        </h2>

                        <div
                          className="mb-4 pl-[10px] pr-[10px] descriptionContainer"
                          dangerouslySetInnerHTML={{
                            __html: blog?.subTitle && blog?.subTitle,
                          }}
                          style={{
                            height: "100px",
                          }}
                        />

                        <div className="mx-3 d-flex items-center mt-auto">
                          <img
                            src="/favicon.png"
                            style={{
                              width: "50px",
                              height: "50px",
                              borderRadius: "50px",
                            }}
                            alt="WeBuyBooks"
                          />
                          <div className="ml-3">
                            <div className="Blog_new_article_profile__xlVqE font-bold">
                              Lego2Sell
                            </div>
                            <div className="Blog_new_article_posted__X5fva">
                              {formatDate(blog.created_at)}
                            </div>
                          </div>
                        </div>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      )}

      {searchSectionVisible && (
        <section className="blog blog_list pb-5" id="searchSection">
          <div className="container">
            <h5
              className="mb-4"
              style={{ fontWeight: "bold", color: "#093664" }}
            >
              Search Results
            </h5>
            <div className="row justify-start">
              {searchResults?.map((result) => (
                <div className="col-12 col-md-6 col-lg-4">
                  <div className="Blog_new_article_card__qD7wR h-full mb-5">
                    <Link to={`/blogdetails/${result._id}`} key={result._id}>
                      <div className="Blog_image_container__9bzik mb-4">
                        <img
                          className="lazy blog-card-"
                          src={result.image}
                          alt="11 Best Comic Books of All Time: Honouring National Comic Book Day"
                        />
                      </div>
                      <a
                        className="Blog_category_card_small__KhtWu"
                        style={{
                          backgroundColor: "#FFE1E1",
                          borderColor: "#FF8585",
                        }}
                        href="/blog/all-things-books/"
                      >
                        All Things Books
                      </a>
                      <h2 className="my-3 Blog_new_article_title__CusWh ">
                        {result.title}
                      </h2>
                      <div
                        className="descriptionContainer"
                        dangerouslySetInnerHTML={{
                          __html: result.description,
                        }}
                      />

                      <div className="d-flex items-center mt-auto">
                        <img
                          src="/favicon.png"
                          style={{
                            width: "50px",
                            height: "50px",
                            borderRadius: "50px",
                          }}
                          alt="WeBuyBooks"
                        />
                        <div className="ml-3">
                          <div className="Blog_new_article_profile__xlVqE font-bold">
                            Lego2Sell
                          </div>
                          <div className="Blog_new_article_posted__X5fva">
                            {result.created_at}
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Blog;
// email.jsx
