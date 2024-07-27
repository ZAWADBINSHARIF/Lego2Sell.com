import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import AdminOffer from "../componet/AdminOffer";
import { useNavigate } from "react-router-dom";
import CryptoJS from "crypto-js";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import baseUrl from "../context/baseUrl";
import { Editor } from '@tinymce/tinymce-react';
import { toast } from "react-toastify";

const UserBlog = () => {
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategory] = useState([]);
  const [apiResponse, setResponse] = useState([]);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false); // Track loading state
  const storedUserId = localStorage.getItem("userId");
  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const editorRef = useRef(null);
  const log = () => {
    if (editorRef.current) {
      console.log(editorRef.current.getContent());
    }
  };
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    userId: storedUserId,
    userName: "test",
    categoryId: "",
    categoryName: {
      name: "",
      color: "",
    },
    title: "",
    subTitle: "",
    image: "",
    description: "",
  });

  console.log("set form data", formData);
  const handleChange = (e) => {
    if (e.target.type === "file") {
      // Handle file input
      const selectedImage = e.target.files[0];
      setImage1(selectedImage);
      const fileNameWithoutPath = selectedImage ? selectedImage.name : "";
      setFormData({
        ...formData,
        image: fileNameWithoutPath,
      });
    } else {
      // Handle regular input
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    }
    console.log("set form data", formData);
  };

  const handleChangeCategory = (event) => {
    const selectedCategoryId = event.target.value;
    const selectedCategory = categories.find(
      (category) => category._id === selectedCategoryId
    );

    if (selectedCategory) {
      // Update the formData with the selected category information
      setFormData({
        ...formData,
        categoryId: selectedCategoryId,
        categoryName: {
          name: selectedCategory.name,
          color: selectedCategory.color,
        },
      });
    }
  };

  const handleEditorChange = (content) => {
    console.log("Content was updated:", content);
    setFormData({ ...formData, description: content });
  };
  const handleSubEditorChange = (content) => {
    setFormData({ ...formData, subTitle: content });
  };

  const handleSubmit = async () => {

    console.log("set image", formData);
    try {
      const formData1 = new FormData();
      formData1.append("image", image1);
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios
        .post(baseUrl + "/upload", formData1, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          console.log("Image uploaded successfully:", response.data.imageUrl);
          formData.image = response.data.imageUrl;
          const apiUrl = baseUrl + "/admin/api/blog";
          const response1 = axios.post(apiUrl, formData, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setResponse("Data submitted successfully");
        })
        .catch((error) => {
          console.error("Error uploading image:", error);
          setLoading(false);
          toast.error(error.message);
        });

      const updatedBlogs = await axios.get(baseUrl + "/admin/api/blog");
      setBlogs(updatedBlogs.data.data);
      setLoading(false);
      toast.success("Data submitted successfully");
      navigate(0);
    } catch (error) {
      setResponse("Error submitting data");
      console.error("Error submitting data:", error);
      setLoading(false);
      toast.error("Error submitting data");
    }
  };

  useEffect(() => {
    const apiUrl = baseUrl + "/admin/api/blog";
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
      const apiUrl = baseUrl + "/admin/api/blog/" + blogId;
      const response = await axios.delete(apiUrl, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Blog deleted successfully:", response.data);
      alert("Blog deleted successfully");
      // Refresh the blog list after deleting a blog
      const updatedBlogs = await axios.get(baseUrl + "/admin/api/blog");
      setBlogs(updatedBlogs.data.data);
    } catch (error) {
      console.error("Error deleting blog:", error);
    }
  };

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

  return (
    <>
      <div className="mt-3 mx-auto w-full justify-center items-center ">
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
          <div className="container mx-auto mt-8">
            <h3>{apiResponse}</h3>
            <form className="mx-auto p-6 bg-white rounded shadow">
              <div className="mb-4">
                <label
                  htmlFor="Category"
                  className="block text-gray-600 font-semibold"
                >
                  Category
                </label>
                <select
                  id="categoryName"
                  name="categoryName"
                  value={formData.categoryId}
                  onChange={handleChangeCategory}
                  className="w-full p-2 border border-gray-300 rounded mt-1"
                  data-color={formData.categoryName.color}
                >
                  <option value="">Choose Category</option>
                  {categories?.map((category) => (
                    <option
                      key={category._id}
                      value={category._id}
                      color={category.color}
                    >
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label
                  htmlFor="title"
                  className="block text-gray-600 font-semibold"
                >
                  Heading
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded mt-1"
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="image"
                  className="block text-gray-600 font-semibold"
                >
                  Image
                </label>
                <input
                  type="file"
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded mt-1"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="title"
                  className="block text-gray-600 font-semibold"
                >
                  Sub Title
                </label>
                <div>
                  <input
                    type="text"
                    id="subTitle"
                    name="subTitle"
                    value={formData.subTitle}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded mt-1"
                  />
                </div>
              </div>
              <div className="mb-6 mt-5">
                <label
                  htmlFor="description"
                  className="block text-gray-600 font-semibold"
                >
                  Description
                </label>
                <div>
                  {/* <ReactQuill
                    theme="snow"
                    name="description"
                    value={formData.description}
                    onChange={handleEditorChange}
                    modules={{
                      toolbar: {
                        container: [
                          // [{ header: [1, 2, false] }],
                          [{ 'size': sizeOptions.map(option => option.value) }],
                          [
                            "bold",
                            "italic",
                            "underline",
                            "strike",
                            "blockquote",
                          ],
                          [{ list: "ordered" }, { list: "bullet" }],
                          ["link", "image"], // Add 'image' to include the image button
                          ["clean"],
                          [{"color":[]}],
                          [{"font":[]}],

                        ],
                      },
                    }}
                    style={{ width: "100%", height: "250px" }}
                  /> */}
                  <Editor
                    name="description"
                    apiKey='j21ua41lr6mtfwtkoqya22hincmd464fz9uviv2k6z633eds'
                    init={{
                      plugins: 'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount',
                      toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | align lineheight ',
                      tinycomments_mode: 'embedded',
                      tinycomments_author: 'Author name',
                      mergetags_list: [
                        { value: 'First.Name', title: 'First Name' },
                        { value: 'Email', title: 'Email' },
                      ],
                    }}
                    onInit={(evt, editor) => editorRef.current = editor}
                    initialValue={formData.description}
                    onEditorChange={(a, editor) => {
                      formData.description = a;
                    }}
                  />
                </div>
              </div>
              <button
                style={{ marginTop: "50px" }}
                type="submit"
                onClick={(e) => {
                  e.preventDefault();

                  if (formData.description && formData.categoryName.name && formData.title) {
                    handleSubmit();
                  } else {
                    toast.warning("Fill the title and description");
                  }
                }}
                className="w-full bg-blue-500 text-white font-semibold p-2 rounded"
                disabled={loading} // Disable the button while loading
              >
                {loading ? "Loading..." : "Submit"}
              </button>
            </form>
            {/* <button onClick={log}>Log editor content</button> */}
          </div>
        </div>

        <div className="container mx-auto my-12">
          <table className="min-w-full border border-gray-300">
            <thead>
              <tr className="">
                <th className="py-4 text-center font-bold px-4 border-b">ID</th>
                <th className="py-4 text-center font-bold px-4 border-b">
                  Category Id
                </th>
                <th className="py-4 text-center font-bold px-4 border-b">
                  Category
                </th>
                <th className="py-4 text-center font-bold px-4 border-b">
                  Title
                </th>
                <th className="py-4 text-center font-bold px-4 border-b">
                  Image
                </th>
                <th className="py-4 text-center font-bold px-4 border-b">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="text-center">
              {blogs?.map((blog) => (
                <tr key={blog._id} className="">
                  <td className="py-2 px-4 centered border-b ">{blog._id}</td>
                  <td className="py-2 px-4 border-b">{blog.categoryId}</td>
                  <td className="py-2 px-4 border-b">
                    {blog.categoryName.name}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {blog.title.slice(0, 20)}...
                  </td>
                  <td className="py-2 px-4 border-b">
                    <img
                      src={blog.image}
                      alt="Blog"
                      className="w-[200px] object-cover h-[100px]"
                    />
                  </td>
                  <td className="py-2 px-4">
                    <button
                      onClick={() => handleDelete(blog._id)}
                      className="w-full bg-red-500 text-white font-semibold p-2 rounded"
                    >
                      Delete
                    </button>
                    <div style={{ marginTop: "20px" }}>
                      <a
                        href={`/blogedit?blogId=${blog._id}`}
                        key={blog._id}
                        className="w-full bg-blue-500 text-white font-semibold p-3 rounded"
                      >
                        Edit
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default UserBlog;
