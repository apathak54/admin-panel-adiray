import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios, { AxiosResponse } from 'axios';
import AOS from 'aos';


type BlogPost = {
  _id: string;
  title: string;
  description: string;
  imageUrl?: string;
  createdAt : string ;
};

const inputClasses = 'pl-10 pr-4 py-3 shadow-md text-md rounded-lg w-full sm:w-auto';
const hrClasses = 'flex-1 border-zinc-300';

const Blog: React.FC = () => {
  const shouldAnimate = window.innerWidth <= 768;
  AOS.init({
    duration: 800,
  });

  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
 

  const DeletePost = async (post_id: string) => {
    const token = localStorage.getItem('adminToken');
    if (!token)
        window.location.href = '/';

    try {
      const response = await axios.delete(`https://node-js-jwt-auth.onrender.com/api/admin/posts/${post_id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.status === 200) {
        setBlogPosts(blogPosts.filter(post => post._id !== post_id));
      } else {
        console.error('Unexpected status code:', response.status);
        // Provide feedback to the user
      }
    } catch (error) {
      console.error('Error during deleting the post:', error);
      // Provide feedback to the user
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('adminToken');

    // If token exists, make the API call with the token included in the headers
    if (token) {
      axios
        .get<BlogPost[]>('https://node-js-jwt-auth.onrender.com/api/admin/posts/', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then((response: AxiosResponse<BlogPost[]>) => {
          setBlogPosts(response.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching blog posts:', error);
          setLoading(false);
        });
    } else {
      // Handle the case where the token doesn't exist (user is not authenticated)
      setLoading(false); // Set loading to false since there's no token to make the request
      // You might want to redirect the user to the login page or show a message indicating they need to log in
    }
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  const extractFirst20Words = (text: string): string => {
    const words = text.split(' ');
    const first20Words = words.slice(0, 40);
    return first20Words.join(' ');
  };

  const filteredPosts = blogPosts.filter(post => {
    return post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
           post.description.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="relative w-full flex justify-center  ">
      <div className="p-8 px-[5vw] z-[5] max-w-[1300px] flex flex-col justify-center">
        <div className="mb-6 flex flex-col md:flex-row justify-between sm:gap-8 items-center">
          <h1 data-aos={shouldAnimate ? 'slide-right' : ''} className="text-[clamp(35px,3.5vw,5rem)] font-Mont font-bold mb-4 md:mb-0">
            Latest <span className="text-blue-900">Updates</span>
          </h1>
          <div data-aos={shouldAnimate ? 'slide-left' : ''} className="flex flex-col sm:flex-row items-center gap-2 sm:gap-12 mt-2 w-full md:w-auto">
            <div className="relative flex items-center w-full  sm:w-auto">
              <input type="text" placeholder="Search..." className={inputClasses} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
              <svg
                className="w-4 h-4 absolute left-3 flex items-center"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
            <Link to="/admin/create/post" className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 mt-2 sm:mt-0 w-full sm:w-auto text-center">Create Blog</Link>
            <hr className={hrClasses} />
          </div>
        </div>
        {filteredPosts.length > 0 ? (
          <div className="flex flex-col gap-6">
            {filteredPosts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((post: BlogPost) => (
              <div key={post._id} className="flex flex-col md:flex-row gap-6">
                <div className="flex-shrink-0 md:w-1/3">
                  <Link to={`/admin/blogposts/${post._id}`}>
                    <img src={post.imageUrl} alt={post.title} className="rounded-lg object-cover w-full h-[200px]" />
                  </Link>
                </div>
                <div className="flex flex-col flex-grow">
                  <h2 className="text-lg font-semibold text-black mb-2">
                    <Link to={`/admin/blogposts/${post._id}`} className="hover:text-blue-900">
                      {post.title}
                    </Link>
                  </h2>
                  <p className="text-gray-700">{extractFirst20Words(post.description)}</p>
                </div>
                {/* Add Update and Delete Buttons */}
                <div className="flex gap-2 mt-2 md:mt-0">
                  <Link to={`/admin/posts/${post._id}`} className="bg-yellow-500 h-[2.5rem] text-white py-2 px-4 rounded-md hover:bg-yellow-600">Update</Link>
                  <button onClick={() => { DeletePost(post._id) }} className="bg-red-500 text-white py-2 px-4 h-[2.5rem] rounded-md hover:bg-red-600">Delete</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div>No posts found</div>
        )}
      </div>
    </div>
  );
};

export default Blog;
