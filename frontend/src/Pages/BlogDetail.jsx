// BlogDetail.js
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './styles.css';
import './blog.css';
import './blog1.css';
import baseUrl from '../context/baseUrl';
import moment from 'moment';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
const BlogDetail = () => {
  const [blog, setBlog] = useState(null);
  const location = useLocation();
  const [blogId, setBlogId] = useState(null);
  const [commentResponse, setResponse] = useState(null);
  const [comments, setComments] = useState([]);
  const storedUserId = localStorage.getItem("userId");
  const [data, setData] = useState()
  const [isBlocked, setIsBlocked] = useState(false)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userResponse = await axios.get(
          `${baseUrl}/user/${storedUserId}`
        )
        setIsBlocked(userResponse.data?.blocked)
        const response = await axios.get(
          `${baseUrl}/Mydetails/${storedUserId}`
        )
        setData(response.data.Mydetails[0])
        setFormData({
          ...formData,
          email: response.data.Mydetails[0].email,
          name: response.data.Mydetails[0].firstName + ' ' + response.data.Mydetails[0].lastName,
        });
      } catch (error) {
        console.error("An error occurred:", error)
        localStorage.removeItem("userId")
        // Handle the error as needed
      }
    }

    fetchData()
  }, [])


  const searchParams = new URLSearchParams(location.search);
  const idFromUrl = searchParams.get('blogId');
  useEffect(() => {

    setBlogId((prevId) => idFromUrl || prevId);

    if (idFromUrl) {
      const apiUrl = baseUrl + '/admin/api/blog/' + idFromUrl;
      axios.get(apiUrl)
        .then(response => {
          setBlog((prevBlog) => response.data.data || prevBlog);
        })
        .catch(error => {
          console.error('Error fetching blog details:', error);
        });
    }
    // get all comments from database
    const apiUrl = baseUrl + '/admin/service/api/comment/' + idFromUrl;
    axios.get(apiUrl).then(response => {
      setComments(response.data.data);
      console.log('DATA:', response.data.data);
    }).catch(error => {
      console.error('Error fetching data:', error);
    })


  }, [location.search]);


  const [formData, setFormData] = useState({
    email: "",
    name: "",
    blogId: idFromUrl,
    comment: "",
  });
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("isBlocked", isBlocked)
      if (isBlocked) {
        setResponse('You are blocked by admin');
        return
      }
      const apiUrl = baseUrl + '/admin/service/api/comment';
      const response = await axios.post(apiUrl, formData);
      setComments([...comments, response.data.data])
      console.log(response)
      setResponse('Your Response submitted successfully');
      setFormData({
        email: "",
        name: "",
        blogId: idFromUrl,
        comment: "",
      })
    } catch (error) {
      setResponse('Error submitting data');
      console.error('Error submitting data:', error);
    }
  };

  const emailAddress = 'blog@lego2sell.com';

  const handleEmailClick = () => {
    window.location.href = `mailto:${emailAddress}`;
  };
  const formatDate = (date) => {
    const newDate = new Date(date);
    return newDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };
  return (

    <section className="blog-detail-section py-20 px-[20px]">
      <div className="container position-relative">
        <Link to={"/blogs"} className='position-absolute top-[-80px] bg-gray-700 rounded-full text-white py-2 px-2'><IconChevronLeft className='text-xl' /></Link>
        <div className="row mt-8 ">

          <div className="col-12 col-lg-8 col-xl-9 ">
            {blog ? (
              <div className="blog-content" >
                <div className="Cms_standard_page_content__wx98l Blog_blog_single_content__JjHEV">
                  <div className="date mb-2">{formatDate(blog.created_at)}</div>
                  <h1 className="mb-5 font-medium blog-title  " >{blog.title}</h1>
                  <div className="mt-5 mb-2">
                    <div>
                      <p>
                        <img
                          src={blog.image}
                          alt="headertall blog image size (10).png"
                          className="blog-image"

                        />
                      </p>

                      <div
                        dangerouslySetInnerHTML={{
                          __html: blog.description,
                        }}
                        className='mt-5  blog-description-new'
                        style={{
                          color: '#000',
                          fontSize: 12
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            )
              :
              (
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '100vh'

                }}>

                  <div class="loader"></div>
                </div>
              )
            }


<hr />
            <div className="col-12 ">
              <h3 className='my-3' style={{
                fontWeight: "bold",
                color: "#333",
                fontSize: 16,
                textTransform:'uppercase'

              }}>comments</h3>
              <h3 className='my-3' style={{
                fontWeight: "normal",
                color: "#333",
                fontSize: 16,

              }}> LEAVE A REPLY</h3>
              <p style={{
                fontWeight: "normal",
                color: "#333",
                fontSize: 14,

              
              }}>
                Your email address will not be published. Required fields are
                marked *

              </p>

              <h3>{commentResponse}</h3>
              {data ? <form onSubmit={handleSubmit} className="comment-form">

                <div className="form-group">
                  <label htmlFor="comment" style={{
                    color:"#333",
                    fontSize: 16,
                    fontWeight: 'normal'

                  }}>Comment *</label>
                  <textarea
                    className="form-control"
                    required
                    rows={8}
                    name="comment"
                    value={formData.comment_description}
                    onChange={handleInputChange}
                    style={{
                      border: '1px solid #dfadacc',
                      color: '#333',
                      fontSize: 12,
                      padding: 5,

                    }}
                  />
                </div>
                <button type="submit" className="btn btn-primary">
                  Submit Comment
                </button>
              </form>
            :
            (
              <div>
                <h1  style={{
                    color:"#333",
                    fontSize: 16,
                    fontWeight: 'bold'

                  }}>Please Login to comment</h1>
                <div className='flex gap-5'>
                  <Link to='/login' className='btn btn-primary' style={{
                    color: 'white'
                  }}>Login</Link>
                  <Link to='/signup' className='btn btn-primary' style={{
                    color: 'white'
                  }}>Register</Link>
                  </div>
              </div>
            )  
            }
            </div>
            <div className="col-12 ">
              {/* <h1 className='my-5'>Comments</h1> */}

              {/* Display all comments */}
              <div className="comments-section" >
                {comments.map(comment => (
                  <div key={comment._id} className="comment mb-5 mt-5">
                    <hr />
                    <div className='flex gap-3'>

                    
                      <div className='flex flex-col'>
                        <div style={{
                          display: 'flex',
                          gap: 10,
                        }}>
                          <div className="image">

                            <img src="/Images/Lego Rocket man.png" alt="" style={{ height: 'auto', width: 50 }} />
                          </div>
                          <div style={{
                            display: 'flex',
                            flexDirection: 'column'
                          }}>
                          <span className="comment-info">{comment.name} </span>
                        <span > {moment(comment.created_at).format('MMMM DD, YYYY h:mm A')}</span>
                          </div>

                        </div>

                        <p className=" mt-3  comment-text">{comment.comment}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <hr />
              <div className='flex gap-2 items-center'>
                <img src="/blogs.png" className='w-20 h-20' alt="" />
                <p className='font-bold'>
                  Hey Want to add a blog post or even better write featured blogs
                  then drop us a line as we would love to share you   your thoughts.
                  <a href={`mailto:${emailAddress}`} onClick={handleEmailClick}>
                    Contact
                  </a>



                </p>
              </div>

              <div className="Blog_section_social_text__yuQTP" style={{ backgroundColor: "#b8ffc9" }}>
                <p>Would you like to continue the conversation? Share this post!</p>

                <div className="Blog_section_social__iR2Bm" style={{ backgroundColor: "#b8ffc9" }}>

                  {/* Buttons for social sharing */}
                  <button aria-label="email" className="react-share__ShareButton">
                    <svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="envelope" class="svg-inline--fa fa-envelope fa-w-16 " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                      <path fill="currentColor" d="M464 64H48C21.49 64 0 85.49 0 112v288c0 26.51 21.49 48 48 48h416c26.51 0 48-21.49 48-48V112c0-26.51-21.49-48-48-48zm0 48v40.805c-22.422 18.259-58.168 46.651-134.587 106.49-16.841 13.247-50.201 45.072-73.413 44.701-23.208.375-56.579-31.459-73.413-44.701C106.18 199.465 70.425 171.067 48 152.805V112h416zM48 400V214.398c22.914 18.251 55.409 43.862 104.938 82.646 21.857 17.205 60.134 55.186 103.062 54.955 42.717.231 80.509-37.199 103.053-54.947 49.528-38.783 82.032-64.401 104.947-82.653V400H48z"></path>
                    </svg>
                  </button>
                  <button aria-label="facebook" className="react-share__ShareButton">
                    <svg aria-hidden="true" focusable="false" data-prefix="fab" data-icon="facebook-f" class="svg-inline--fa fa-facebook-f fa-w-10 " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                      <path fill="currentColor" d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z"></path>
                    </svg>
                  </button>
                  <button aria-label="linkedin" className="react-share__ShareButton">
                    <svg aria-hidden="true" focusable="false" data-prefix="fab" data-icon="linkedin-in" class="svg-inline--fa fa-linkedin-in fa-w-14 " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                      <path fill="currentColor" d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z"></path>
                    </svg>
                  </button>
                  <button aria-label="twitter" className="react-share__ShareButton">
                    <svg aria-hidden="true" focusable="false" data-prefix="fab" data-icon="twitter" class="svg-inline--fa fa-twitter fa-w-16 " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                      <path fill="currentColor" d="M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z"></path>
                    </svg>
                  </button>
                  <button aria-label="whatsapp" className="react-share__ShareButton">
                    <svg aria-hidden="true" focusable="false" data-prefix="fab" data-icon="whatsapp" class="svg-inline--fa fa-whatsapp fa-w-14 " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                      <path fill="currentColor" d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"></path>
                    </svg>
                  </button>

                  {/* Buttons for social sharing */}
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </section>






  );
};

export default BlogDetail
