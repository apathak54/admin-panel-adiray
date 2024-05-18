import React from 'react';
import { useNavigate } from 'react-router-dom';

const Popup: React.FC = () => {
 
  const navigate = useNavigate();

  const handleEditProduct = () => {
    // Navigate to the product editing page
    navigate('/admin/category')

  };

  const handleEditBlog = () => {
    // Navigate to the blog post editing page
    navigate('/admin/blog')
 
  };

  return (
    <div className={`fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50 `}>
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-lg font-semibold mb-4">Edit</h2>
        <p className="text-gray-600 mb-6">Do you want to edit a product or a blog post?</p>
        <div className="flex justify-between">
          <button onClick={handleEditProduct} className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600">Edit Product</button>
          <button onClick={handleEditBlog} className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600">Edit Blog Post</button>
        </div>
      </div>
    </div>
  );
};

export default Popup;
