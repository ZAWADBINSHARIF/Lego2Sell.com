import axios from "axios";
import React, { useEffect, useState } from "react";
import AdminOffer from "../componet/AdminOffer";
import { useNavigate } from "react-router-dom";
import CryptoJS from "crypto-js";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import baseUrl from "../context/baseUrl";

const UserCategory = () => {
  const currentUrl = "http://localhost:5100";
  const [blogs, setBlogs] = useState([]);
  const [apiResponse, setResponse] = useState([]);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true); // Track loading state
  const storedUserId = localStorage.getItem("userId");

  const [formData, setFormData] = useState({
    name: "",
    color: "#000000",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleEditorChange = (content) => {
    setFormData({ ...formData, description: content });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const apiUrl = baseUrl + "/admin/service/api/category";
      const response = await axios.post(apiUrl, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Data submitted successfully:", response.data);
      setResponse("Data submitted successfully");
      const updatedBlogs = await axios.get(
        currentUrl + "/admin/service/api/category"
      );
      setBlogs(updatedBlogs.data.data);
      setFormData({
        name: "",
        color: "",
      });
    } catch (error) {
      setResponse("Error in submitting data");
      console.error("Error submitting data:", error);
    }
  };

  useEffect(() => {
    const apiUrl = baseUrl + "/admin/service/api/category";
    axios
      .get(apiUrl)
      .then((response) => {
        setBlogs(response.data.data);
        console.log("DATA:", response.data.data);
      })

      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const handleDelete = async (blogId) => {
    try {
      const token = localStorage.getItem("token");
      const apiUrl = baseUrl + "/admin/service/api/category/" + blogId;
      const response = await axios.delete(apiUrl, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Category deleted successfully:", response.data);
      alert("Category Deleted Successfully");
      // Refresh the blog list after deleting a blog
      const updatedBlogs = await axios.get(
        currentUrl + "/admin/service/api/category"
      );
      alert("Category Deleted Successfully");
      setBlogs(updatedBlogs.data.data);
    } catch (error) {
      console.error("Error deleting blog:", error);
      alert("Error in deleting Category");
    }
  };

  return (
    <div className="">
      <div className="  mt-8 mb-5">
        <div className="flex lg:flex-row flex-col items-center">
          <div className="flex flex-col justify-start gap-5 ml-4 h-full bg-slate-50 lg:border-[8px] border-[0px] px-4 py-24 border-blue-500 rounded-[30px]">
            <a
              className="Blog_category_card_small__KhtWu Blog_category_card_1 py-4 text-black md:m-0 mx-auto w-[350px] "
              href="/usermanagement"
            >
              User Management
            </a>
            <a
              className="Blog_category_card_small__KhtWu Blog_category_card_2 py-4 text-black md:m-0 mx-auto w-[350px]"
              href="/usercategory"
            >
              Categories
            </a>
            <a
              className="Blog_category_card_small__KhtWu Blog_category_card_3 py-4 text-black md:m-0 mx-auto w-[350px]"
              href="/usercomments"
            >
              Comments
            </a>
            <a
              className="Blog_category_card_small__KhtWu Blog_category_card_1 py-4 text-black md:m-0 mx-auto w-[350px]"
              href="/userblogs"
            >
              Blogs
            </a>
          </div>
          <div className="container">
            <h3>Categories</h3>
            <h3>{apiResponse}</h3>
            <form className="max-w-md mx-auto p-6 bg-white rounded shadow">
              <div className="mb-4">
                <label
                  htmlFor="title"
                  className="block text-gray-600 font-semibold"
                >
                  Category Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded mt-1"
                  required
                />
                <label
                  htmlFor="Color"
                  className="block text-gray-600 font-semibold mt-2"
                >
                  Background Color
                </label>
                <div className="d-flex ">
                  <input
                    type="text"
                    id="Color"
                    name="color"
                    value={formData.color}
                    onChange={(e) =>
                      setFormData({ ...formData, color: e.target.value })
                    }
                    className="w-[85%] p-2 border border-gray-300 rounded "
                    required
                  />
                  <input
                    type="color"
                    id="Color"
                    name="color"
                    value={formData.color}
                    onChange={(e) =>
                      setFormData({ ...formData, color: e.target.value })
                    }
                    className=" h-10  border border-gray-300 rounded "
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                onClick={handleSubmit}
                className="w-full bg-blue-500 text-white font-semibold p-2 rounded"
              >
                Submit
              </button>
            </form>
          </div>
        </div>

        <div className="container mx-auto mt-20">
          <table className="min-w-full border border-gray-300">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">ID</th>
                <th className="py-2 px-4 border-b">Name</th>
                <th className="py-2 px-4 border-b">Action</th>
              </tr>
            </thead>
            <tbody className="text-center">
              {blogs.map((blog) => (
                <tr key={blog._id} className="border-b">
                  <td className="py-2 px-4 centered">{blog._id}</td>
                  <td className="py-2 px-4">{blog.name}</td>

                  <td className="py-2 px-4">
                    <button
                      onClick={() => handleDelete(blog._id)}
                      className="w-full bg-red-500 text-white font-semibold p-2 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserCategory;
