import { Link } from "react-router-dom";
import { FaArrowLeft } from 'react-icons/fa';
import axios from "axios";
import { useParams } from "react-router-dom";
import { useEffect, useState } from 'react';

export default function Blogpost() {
  const { postId } = useParams();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
  
    // If token exists, make the API call with the token included in the headers
    if (token) {
      axios.get(`https://node-js-jwt-auth.onrender.com/api/admin/posts/${postId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(response => {
        setPost(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching blog post:", error);
        setLoading(false);
        setError("Failed to fetch the blog post. Please try again later.");
      });
    } else {
      // Handle the case where the token doesn't exist (user is not authenticated)
      setLoading(false); // Set loading to false since there's no token to make the request
      // You might want to redirect the user to the login page or show a message indicating they need to log in
    }
  }, [postId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!post) {
    return <div>Post not found</div>;
  }

  return (
    <div className="h-auto flex justify-center pt-12 pb-12">
      <div className="w-[80vw] max-w-[800px] h-auto flex flex-col justify-start gap-7">
        <div className="flex flex-col gap-5">
          <div className="text-pink-600 text-[13px] font-semibold flex gap-1 items-center">
            <FaArrowLeft />
            {/* Use Link component for consistent routing */}
            <Link to="/admin/blog/" className="decoration-none text-pink-600 hover:text-pink-600">All Blogs</Link>
          </div>

          <div className="flex justify-start gap-4">
            <img className="w-12 h-12 rounded-full" src={post.authorImg} alt="Author" />
            <div>
              <h3 className="text-md font font-bold">{post.author}</h3>
              {/* If author occupation is available, render it */}
              {post.authorOccupation && <h5 className="text-sm font-MontBook text-gray-700">{post.authorOccupation}</h5>}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-12">
          <div className="text-gray-900 text-4xl font-Mont font-bold">
            {post.title}
          </div>
          <img className="w-[752px] rounded-3xl" src={post.imageUrl} alt="Blog" />

          <div className="text-gray-900">
            {/* Render the main description */}
            <div className="text-gray-850 text-xl font-semibold font-Mont leading-[35px]">{post.description}</div>
            {/* If additional details are available, render them */}
            {post && post.details && (
              <div className="">
                {post.details.map((detail: any) => (
                  <div key={detail._id} className="detail border-b border-gray-300 pb-4 mb-4">
                    <h2 className="detail-point text-gray-900 text-xl font-semibold">{detail.point}</h2>
                    <p className="detail-description text-gray-700 leading-7">{detail.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
