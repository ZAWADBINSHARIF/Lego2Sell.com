import axios from "axios";
import React, { useEffect, useState } from "react";
import { Notification } from "@mantine/core";
import { IconCheck } from "@tabler/icons-react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

import "./styles.css";
import "./blog.css";
import baseUrl from "../context/baseUrl";
import moment from "moment";
const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const location = useLocation();
  const [catId, setCatId] = useState(null);
  const [categories, setCategory] = useState([]);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true); // Track loading state
  const storedUserId = localStorage.getItem("userId");
  console.log("blogs", blogs);
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
    const searchParams = new URLSearchParams(location.search);
    const idFromUrl = searchParams.get("catId");
    setCatId((prevId) => idFromUrl || prevId);

    if (idFromUrl) {
      const apiUrl = baseUrl + "/admin/api/blog?categoryId=" + idFromUrl;
      axios
        .get(apiUrl)
        .then((response) => {
          setBlogs((prevBlog) => response.data.data || prevBlog);
          setSearchSectionVisible(false);
        })
        .catch((error) => {
          console.error("Error fetching blog details:", error);
        });
    }
  }, [location.search]);

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

  const singleBlogs = blogs.map((blog) => {
    if (blog.categoryId === catId) {
      return blog;
    }
  });

  const truncateText = (text, limit) => {
    const words = text.split(" ");
    const truncated = words.slice(0, limit).join(" ");
    return truncated + (words.length > limit ? "..." : "");
  };

  return (
    <div className="container mx-auto mt-8">
      <div className="col-12 text-center standard_page_content">
        <form onSubmit={handleSearchSubmit} className="flex items-center">
          <input
            type="text"
            placeholder="Search..."
            className="border px-6 py-4 w-full md:w-[90%] text-xl font-medium rounded-2xl"
            required
            value={searchValue}
            onChange={handleInputChange}
          />
          <button
            type="submit"
            className="ml-4 px-6 py-4 bg-blue-500 text-white rounded-2xl"
          >
            Search
          </button>
        </form>
      </div>

      <section className="blog blog_list blog_header pb-5">
        <div className="container">
          <div className="row mb-5">
            <div className="col-12 text-center standard_page_content">
              <div className="Blog_blog_header_title__u2hU5">
                {singleBlogs.length > 0 && (
                  <h1 className="category_title">
                    {singleBlogs[0]?.categoryName?.name || ""}
                  </h1>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {postSectionVisible && (
        <div>
          <section className="blog blog_list pb-5" id="recentPostSection">
            <div className="container">
              <h5
                className="mb-4"
                style={{ fontWeight: "bold", color: "#093664" }}
              >
                Most Recent Posts
              </h5>
              <div className="row">
                {blogs.map((blog) => (
                  <div className="col-12 col-md-6 col-lg-4">
                    <div className="Blog_new_article_card__qD7wR h-full mb-5">
                      <Link
                        to={`/blogdetails?blogId=${blog._id}`}
                        key={blog._id}
                      >
                        <div className="Blog_image_container__9bzik mb-4">
                          <img
                            className="lazy w-100"
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
                          href="#"
                        >
                          {blog.categoryName?.name}
                        </a>
                        <h2 className="my-3 Blog_new_article_title__CusWh ">
                          {blog.title}
                        </h2>
                        <div
                          className="Blog_new_article_excerpt__iOBYt"
                          dangerouslySetInnerHTML={{
                            __html: truncateText(blog.description, 8),
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
                            <div className="Blog_new_article_profile__xlVqE">
                              Lego2Sell
                            </div>
                            <div className="Blog_new_article_posted__X5fva">
                              {moment(blog.created_at).format("MMMM DD, YYYY")}
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
            <div className="row">
              {searchResults.map((result) => (
                <div className="col-12 col-md-6 col-lg-4">
                  <div className="Blog_new_article_card__qD7wR h-full mb-5">
                    <Link to={`/blogdetails/${result._id}`} key={result._id}>
                      <div className="Blog_image_container__9bzik mb-4">
                        <img
                          className="lazy w-100"
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
                        className="Blog_new_article_excerpt__iOBYt"
                        dangerouslySetInnerHTML={{
                          __html: truncateText(result.description, 8),
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
                          <div className="Blog_new_article_profile__xlVqE">
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
