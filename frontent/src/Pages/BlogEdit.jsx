import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { useParams } from "react-router-dom";
import AdminOffer from "../componet/AdminOffer";
import { useNavigate } from "react-router-dom";
import CryptoJS from "crypto-js";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import baseUrl from "../context/baseUrl";
import { Editor } from '@tinymce/tinymce-react';

const UserBlog = () => {
  const currentUrl = baseUrl;
  const [blogs, setBlogs] = useState([]);
  const location = useLocation();
  const [categories, setCategory] = useState([]);
  const [apiResponse, setResponse] = useState([]);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true); // Track loading state
  const storedUserId = localStorage.getItem("userId");
  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [formData, setFormData] = useState({
    userId: storedUserId,
    userName: "test",
    categoryId: "",
    categoryName: {
    name: "",
    color: "",
  },
  title: "",
  image: "",
  description: "",
  blogId: "",
});
const [timer, setTimer] = useState(null);
const editorRef = useRef(null);


  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const idFromUrl = searchParams.get("blogId");

    
  
  if (idFromUrl) {
    const apiUrl = currentUrl + "/admin/api/blog/" + idFromUrl;
    axios
      .get(apiUrl)
      .then((response) => {
        setBlogs((prevBlog) => response.data.data || prevBlog);
        setFormData({
          ...formData,
          description: response.data.data.description,
          categoryId: response.data.data.categoryId,
          title: response?.data?.data?.title,
          categoryName: response.data.data.categoryName,
          image: response.data.data.image,
          blogId: response.data.data._id,
          subTitle: response.data.data.subTitle,
        });
      })
      .catch((error) => {
        console.error("Error fetching blog details:", error);
      });
  }
}, [location.search]);
  const handleChange = (e) => {
    console.log("formData e", e)
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
  };

  const handleChangeCategory = (event) => {
    console.log("formData cate")
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
    console.log("formData content:", content);
    // if (formData.description) {
      setFormData(prevFormData => ({ ...prevFormData, description: content }));
      
    // }
    // else{

    //   if (timer) clearTimeout(timer);
    //   const newTimer = setTimeout(() => {
    //     setFormData(prevFormData => ({ ...prevFormData, description: content }));
    //   }, 2000);
    //   setTimer(newTimer);
    // }
};




  const handleSubmit = async () => {
    // e.preventDefault();
    try {
      if (image1) {
        const formData1 = new FormData();
        console.log("TEst1214", formData1);
        formData1.append("image", image1);
        const token = localStorage.getItem("token");
        const response = await axios
          .post(currentUrl + "/upload", formData1, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((response) => {
            console.log("Image uploaded successfully:", response.data.imageUrl);
            setImageUrl(response.data.imageUrl);
            formData.image = response.data.imageUrl;
          })
          .catch((error) => {
            console.error("Error uploading image:", error);
          });
      }

      const token = localStorage.getItem("token");


      const apiUrl = currentUrl + "/admin/api/blog";
      console.log(formData);
      const response1 = axios.put(apiUrl, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setResponse("Data Updated successfully");

    } catch (error) {
      setResponse("Error submitting data");
      console.error("Error submitting data:", error);
    }
  };

  console.log("formData", formData)

  useEffect(() => {
    const apiUrl = currentUrl + "/admin/service/api/category";
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
  useEffect(() => {
    if (formData.description) {
      handleSubmit();
    }
  }, [formData.description]);


  return (
    <div className="flex lg:flex-row flex-col items-center">
      <div className="flex flex-col justify-start gap-5 ml-4 h-full bg-slate-50 lg:border-[8px] border-[0px] px-4 py-24 border-blue-500 rounded-[30px] max-h-[468px]">
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
            >
              <option value="">Choose Category</option>
              {categories.map((category) => (
                <option
                  key={category._id}
                  value={category._id}
                  selected={blogs.categoryId === category._id}
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
              value={formData?.title}
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
            <div>
              {/* <ReactQuill
                theme="snow"
                name="description"
                value={formData.description}
                onChange={handleEditorChange}
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
      
        

    />
            </div>
          </div>
          <button
            style={{ marginTop: "50px" }}
            type="submit"
            onClick={(e)=>{
              // handleEditorChange(editorRef.current.getContent())
              e.preventDefault();
              setFormData({ ...formData, description: editorRef.current.getContent() });
              // handleSubmit(e)
            }}            className="w-full bg-blue-500 text-white font-semibold p-2 rounded"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserBlog;
