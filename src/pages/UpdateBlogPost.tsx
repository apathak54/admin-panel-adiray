import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { FaArrowLeft } from 'react-icons/fa6';

interface Detail {
  point: string;
  description: string;
}

interface FormData {
  author: string;
  authorImg: string;
  authorOccupation: string;
  title: string;
  description: string;
  details: Detail[];
  imageUrl: string;
}

const UpdateBlog = () => {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    author: '',
    authorImg: '',
    authorOccupation: '',
    title: '',
    description: '',
    details: [],
    imageUrl: ''
  });

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    
  
    // If token doesn't exist, redirect the user to the login page
    if (!token) {
      navigate('/');
      return;
    }
  
    // Fetch post details with the token included in the headers
    axios.get(`https://node-js-jwt-auth.onrender.com/api/posts/${postId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(response => {
      setFormData(response.data);
      console.log(response.data);
    })
    .catch(error => {
      console.error('Error fetching post details:', error);
    });
  }, [postId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index?: number) => {
    const { name, value } = e.target;
    if (index !== undefined) {
      const updatedDetails:any = [...formData.details];
      updatedDetails[index][name] = value;
      setFormData(prevData => ({
        ...prevData,
        details: updatedDetails
      }));
    } else {
      setFormData(prevData => ({
        ...prevData,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        // Handle the case where the user is not authenticated (token not found)
        console.error('User not authenticated');
        // Optionally, you can redirect the user to the login page or display an error message
        return;
      }
  
      // Send formData to the API with the token included in the headers
      await axios.put(`https://node-js-jwt-auth.onrender.com/api/posts/${postId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
  
      // Handle success and redirect the user
      console.log('Blog post updated successfully!');
      alert('Post Updated Successfully');
      navigate('/admin/blog');
    } catch (error) {
      // Handle errors, such as displaying an error message to the user
      console.error('Error updating blog post:', error);
    }
  };

  const handleAddDetail = () => {
    setFormData(prevData => ({
      ...prevData,
      details: [...prevData.details, { point: '', description: '' }]
    }));
  };

  const handleRemoveDetail = (index: number) => {
    const updatedDetails = formData.details.filter((_, i) => i !== index);
    setFormData(prevData => ({
      ...prevData,
      details: updatedDetails
    }));
  };

  return (
    <div >

    
      <div className="text-pink-600 text-[13px] m-4 font-semibold flex gap-1 items-center ">
            <FaArrowLeft />
            {/* Use Link component for consistent routing */}
            <Link to="/admin/blog/" className="decoration-none text-pink-600 hover:text-pink-600">All Blogs</Link>
          </div>
    <div className="mx-auto md:max-w-xl mx-auto shadow-lg  m-8 mt-8 p-8">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col">
          <label className="text-gray-800 font-bold">Author</label>
          <input type="text" name="author" value={formData.author} onChange={handleChange} className="border border-gray-400 px-3 py-2 rounded-md focus:outline-none focus:border-black" />
        </div>
        <div className="flex flex-col">
          <label className="text-gray-800 font-bold">Author Image URL</label>
          <input type="text" name="authorImg" value={formData.authorImg} onChange={handleChange} className="border border-gray-400 px-3 py-2 rounded-md focus:outline-none focus:border-black" />
        </div>
        <div className="flex flex-col">
          <label className="text-gray-800 font-bold">Author Occupation</label>
          <input type="text" name="authorOccupation" value={formData.authorOccupation} onChange={handleChange} className="border border-gray-400 px-3 py-2 rounded-md focus:outline-none focus:border-black" />
        </div>
        <div className="flex flex-col">
          <label className="text-gray-800 font-bold">Title</label>
          <input type="text" name="title" value={formData.title} onChange={handleChange} className="border border-gray-400 px-3 py-2 rounded-md focus:outline-none focus:border-black" />
        </div>
        <div className="flex flex-col">
          <label className="text-gray-800 font-bold">Description</label>
          <textarea name="description" value={formData.description} onChange={handleChange} className="border w- border-gray-400 px-3 py-2 rounded-md focus:outline-none focus:border-black resize-y min-h-48" />
        </div>
        {formData.details.map((detail, index) => (
          <div key={index} className="flex flex-col">
            <label className="text-gray-800 font-bold">Detail Point</label>
            <input type="text" name="point" value={detail.point} onChange={(e) => handleChange(e, index)} className="border border-gray-400 px-3 py-2 rounded-md focus:outline-none focus:border-black resize-y" />
            <label className="text-gray-800 font-bold">Detail Description</label>
            <textarea name="description" value={detail.description} onChange={(e) => handleChange(e, index)} className="border border-gray-400 px-3 py-2 rounded-md focus:outline-none focus:border-black resize-y h-48" />
            <button type="button" onClick={() => handleRemoveDetail(index)} className="text-gray-700 mt-2 bg-red-500 px-4 py-2 rounded-md hover:bg-red-700">Remove Detail</button>
          </div>
        ))}
        <button type="button" onClick={handleAddDetail} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700">Add Detail</button>
        <div className="flex flex-col">
          <label className="text-gray-800 font-bold">Image URL</label>
          <input type="text" name="imageUrl" value={formData.imageUrl} onChange={handleChange} className="border border-gray-400 px-3 py-2 rounded-md focus:outline-none focus:border-black" />
        </div>
        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-700 w-full">Update</button>
      </form>
    </div>
    </div>
  );
};

export default UpdateBlog;
