import axios from "axios"
import React, { useEffect, useState } from "react"
import { Notification } from "@mantine/core"
import { IconCheck } from "@tabler/icons-react"
import { Helmet } from 'react-helmet'
import baseUrl from "../context/baseUrl"

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true) // Track loading state
  const storedUserId = localStorage.getItem("userId")


  useEffect(() => {
  const apiUrl = 'http://localhost:5100/admin/api/blog';
  axios.get(`${baseUrl}/admin/api/blog`)
  .then(response => {
  setBlogs(response.data.data);
  console.log('DATA:',response.data.data);
  })
  .catch(error => {
  console.error('Error fetching data:', error);
  });
  }, []);

    // Add more blog posts as needed
  

  return (
    <div className="container mx-auto mt-8">
      <center>

      <div className="col-12 text-center standard_page_content">
        <div className="Blog_blog_header_title__u2hU5"><h1 className="category_title">Sustainability</h1><p className="Blog_blog_header_sub_title__B40oZ">Here you'll find all of our latest news and views - including top tips, handy guides and fun content for our fellow book lovers!</p></div>
      </div>

      </center>
      
      <div className="blogs-navbar">
      <a href="/companynews" className="Blog_category_card__i_8G3 Blog_category_card_1">Company News</a>
      <a href="/allthingsbook" className="Blog_category_card__i_8G3 Blog_category_card_2">All Things Book</a>
      <a href="/decluttering" className="Blog_category_card__i_8G3 Blog_category_card_3">Decluttering</a>
      <a href="/sustainability" className="Blog_category_card__i_8G3 Blog_category_card_4">Sustainability</a>
      <a href="/makemoney" className="Blog_category_card__i_8G3 Blog_category_card_5">Make Money</a>
      <a href="/charitypartners" className="Blog_category_card__i_8G3 Blog_category_card_6">Charity Partners</a>
      </div>
    

      <p>Most Recent Posts</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          
        {blogs.map(blog => (

          <a href="">
          <div className="p-4 bg-white" key={blog._id} >
          <img className="lg:w-[80%] w-[80%]" src="/Images/blog-1.jpg" alt="" />
          <button className="Blog_category_card__i_8G4 Blog_category_card_1">Company News</button>
          
          <h2 className="text-xl font-semibold mb-4">{blog.title}</h2>
          <p className="text-gray-600">{blog.description}</p>
          
          <div className="d-flex items-center mt-auto">
          <img src="/favicon.png" alt="WeBuyBooks" style={{ width: '50px', height: '50px', borderRadius: '50px' }} />
          <div className="ml-3">
          <div className="Blog_new_article_profile__xlVqE">WeBuyBooks</div>
          <div className="Blog_new_article_posted__X5fva">Nov 15, 2023</div>
          </div>
          </div>
          </div>
          </a>

      ))}
       </div>
      
    </div>
  );




}

export default Blog
// email.jsx
