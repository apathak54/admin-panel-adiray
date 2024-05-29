import JoditEditor from 'jodit-react';
import { useRef, useState } from 'react';

const CreatePost = () => {
    const editor = useRef(null);
    const [content, setContent] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [author, setAuthor] = useState('');
    const [authorImg, setAuthorImg] = useState('');
    const [authorOccupation, setAuthorOccupation] = useState('');

    const config = {
        uploader: {
          insertImageAsBase64URI: true
        },
        buttons: [
          'bold',
          'italic',
          'underline',
          'link',
          'unlink',
          'source',
          'image'
        ],
        events: {
          afterInit: function (editor:any) {
            editor.events.on('change', (newContent:any) => {
              setContent(newContent);
            });
          }
        }
      };

    const savePost = async () => {
        const postData = {
            author,
            authorImg,
            authorOccupation,
            title,
            description,
            imageUrl,
            content,
        };
        const token = localStorage.getItem('adminToken'); // Check if 'adminToken' is the correct key
        if (!token) {
          console.error("No token found");
          return;
        }
        try {
            const response = await fetch('http://localhost:8080/api/admin/posts', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}` ,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(postData),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const result = await response.json();
            alert('Post saved successfully')
            console.log('Post saved successfully:', result);
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl">
                <h1 className="text-2xl font-bold mb-4">Create New Post</h1>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="author">
                        Author
                    </label>
                    <input
                        type="text"
                        id="author"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
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
                        value={authorImg}
                        onChange={(e) => setAuthorImg(e.target.value)}
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
                        value={authorOccupation}
                        onChange={(e) => setAuthorOccupation(e.target.value)}
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
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
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
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
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
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                    />
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        Content
                    </label>
                    <JoditEditor
          ref={editor}
          value={content}
          config={config}
        />
                </div>
                <button
                    onClick={savePost}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    Save Post
                </button>
            </div>
        </div>
    );
};

export default CreatePost;
