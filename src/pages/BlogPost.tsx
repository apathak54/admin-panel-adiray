import { FaArrowLeft } from 'react-icons/fa';
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from 'react';

export default function Blogpost() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const fetchBlogPost = async () => {
    try {
      const token = localStorage.getItem('adminToken'); // Check if 'adminToken' is the correct key
      if (!token) {
        console.error("No token found");
        setLoading(false);
        return;
      }

      const response = await axios.get(`https://node-js-jwt-auth.onrender.com/api/admin/posts/${postId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setPost(response.data);
    } catch (error) {
      console.error("Error fetching blog post:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogPost();
  }, [postId]);

  const generateAnchorText = (url: string) => {
    const urlObj = new URL(url);
    const domain = urlObj.hostname.replace('www.', '');

    switch (domain) {
      case 'youtube.com':
        return 'Watch on YouTube';
      case 'github.com':
        return 'View on GitHub';
      case 'linkedin.com':
        return 'View on LinkedIn';
      case 'twitter.com':
        return 'View on Twitter';
      default:
        return `${domain}`;
    }
  };

  const processTextWithLinks = (text: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.replace(urlRegex, (url) => {
      const anchorText = generateAnchorText(url);
      return `<a href="${url}" class="text-blue-500 hover:underline hover:visited" target="_blank" rel="noopener noreferrer">${anchorText}</a>`;
    });
  };

  if (loading) {
    return <div className='w-full h-screen flex justify-center items-center'>Loading...</div>;
  }

  if (!post) {
    return <div>Post not found</div>;
  }

  return (
    <div className="h-auto flex flex-col items-center justify-center pt-8 pb-12">
      <div className="h-auto flex justify-center pt-12 pb-12">
        <div className="w-[80vw]  max-w-[800px] h-auto flex flex-col justify-start gap-7">
          <div className="flex flex-col gap-5">
            <div className="text-pink-600 text-[13px] font-semibold flex gap-1 items-center">
              <FaArrowLeft />
              <a onClick={() => { navigate('/admin/blog') }} className="decoration-none text-pink-600 hover:text-pink-600 cursor-pointer">All Blogs</a>
            </div>

            <div className="flex justify-start gap-4">
              <img className="w-12 h-12 rounded-full" src={post.authorImg} alt="Author" />
              <div>
                <h3 className="text-md font font-bold">{post.author}</h3>
                {post.authorOccupation && <h5 className="text-sm font-MontBook text-gray-700">{post.authorOccupation}</h5>}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-12">
            <div className="text-gray-900 text-4xl font-Mont font-bold">
              {post.title}
            </div>
            {post.imageUrl && <img className="w-[752px] rounded-3xl" src={post.imageUrl} alt="Blog" />}

            <div className="text-gray-900">
              <div className="text-gray-850 text-xl font-semibold font-Mont leading-[35px]" dangerouslySetInnerHTML={{ __html: processTextWithLinks(post.description) }}></div>
              <br />
              {post.details && post.details.map((detail: any) => (
                <div key={detail._id} className="detail border-b border-gray-300 pb-4 mb-4">
                  <h2 className="text-gray-900 text-xl font-semibold">{detail.point}</h2>
                  <p className="text-gray-700 leading-7" dangerouslySetInnerHTML={{ __html: processTextWithLinks(detail.description) }}></p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
