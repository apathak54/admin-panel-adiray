import JoditEditor from 'jodit-react';
import { useRef, useState } from 'react';
import { FaArrowLeft } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';

const CreatePost = () => {
    const editor = useRef(null);
    const [content, setContent] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [author, setAuthor] = useState('');
    const [authorImg, setAuthorImg] = useState('');
    const [authorOccupation, setAuthorOccupation] = useState('');
    const navigate = useNavigate();

    const savePost = async () => {
        if (!author || !authorImg || !authorOccupation || !title || !description || !imageUrl || !content) {
            alert('Please fill in all fields.');
            return;
        }

        alert('Wait for a moment, saving your blog...');
        
        const postData = {
            author,
            authorImg,
            authorOccupation,
            title,
            description,
            imageUrl,
            content,
        };

        const token = localStorage.getItem('adminToken');
        if (!token)
        window.location.href = '/';
        
        try {
            const response = await fetch('https://node-js-jwt-auth.onrender.com/api/admin/posts/', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(postData),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const result = await response.json();
            alert('Post saved successfully');
            navigate('/admin/blog');
            console.log('Post saved successfully:', result);
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
        }
    };

    return (
        <div className='flex justify-center items-center flex-col min-h-screen bg-gray-100 p-4'>
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl">
                <div className="flex items-center gap-2 mb-4 text-pink-600 text-[13px] font-semibold cursor-pointer" onClick={() => navigate('/admin/blog')}>
                    <FaArrowLeft />
                    <span className="hover:text-pink-800">All Blogs</span>
                </div>
                <h1 className="text-2xl font-bold mb-4 text-center text-green-700">CREATE YOUR OWN BLOG</h1>
                <div className="space-y-4">
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="author">
                            Author
                        </label>
                        <input
                            type="text"
                            id="author"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter author's name"
                            value={author}
                            onChange={(e) => setAuthor(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="authorImg">
                            Author Image URL
                        </label>
                        <input
                            type="text"
                            id="authorImg"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter URL of author's image"
                            value={authorImg}
                            onChange={(e) => setAuthorImg(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="authorOccupation">
                            Author Occupation
                        </label>
                        <input
                            type="text"
                            id="authorOccupation"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter author's occupation"
                            value={authorOccupation}
                            onChange={(e) => setAuthorOccupation(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
                            Title
                        </label>
                        <input
                            type="text"
                            id="title"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter post title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                            Description
                        </label>
                        <input
                            type="text"
                            id="description"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter post description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="imageUrl">
                            Image URL
                        </label>
                        <input
                            type="text"
                            id="imageUrl"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter URL of post image"
                            value={imageUrl}
                            onChange={(e) => setImageUrl(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Content
                        </label>
                        <div className="border border-gray-300 rounded-md">
                            <JoditEditor
                                ref={editor}
                                value={content}
                                onChange={newContent => setContent(newContent)}
                               
                            />
                        </div>
                    </div>
                    <button
                        onClick={savePost}
                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        Save Post
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreatePost;
