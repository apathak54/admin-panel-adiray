import { useState } from "react";
import CustomButton from "./CustomButton/CustomButton";

interface CustomButtonProps {
    visible: boolean;
    setVisible: (visible: boolean) => void;
    refresh: () => void;
}

interface MyFile extends File {
    // Add any additional properties or methods you may need
}

export default function CreateCategory({ visible, setVisible, refresh }: CustomButtonProps) {
    const [name, setName] = useState('');
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const [file, setFile] = useState<MyFile | null>(null);

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const droppedFile = e.dataTransfer.files[0];
        setFile(droppedFile);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files && e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile as MyFile);
        }
    };

    const token = localStorage.getItem('adminToken');
    if (!token) {
        window.location.href = '/admin/login';
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', name);
        if (file) {
            formData.append('picture', file);
        }

        const response = await fetch('https://node-js-jwt-auth.onrender.com/api/category/create', {
            method: 'POST',
            headers: {
                'authorization': `Bearer ${token}`
            },
            body: formData
        });

        const data = await response.json();
        if (data.success) {
            setVisible(false);
            setName('');
            setFile(null);
            refresh();
        } else {
            setErrorMessage(data.error);
            setError(true);
        }
    };

    return (
        <>
            {visible && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
                    <div className="bg-white rounded-lg p-8">
                        <div className="mx-auto max-w-96 text-center w-96">
                            <form onSubmit={handleSubmit}>
                                <input
                                    className="focus:bg-white my-2 w-full px-6 py-5 rounded-full mb-4 bg-gray-100"
                                    type="text"
                                    placeholder="Category Name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                                <div
                                    onDrop={handleDrop}
                                    onDragOver={handleDragOver}
                                    className="focus:bg-white my-2 w-full px-6 py-5 rounded-full mb-4 bg-gray-100 text-gray-500 text-center border-dashed border-2 border-gray-300"
                                >
                                    {file ? file.name : "Drag and drop a file or click to select a file"}
                                    <input
                                        type="file"
                                        className="hidden"
                                        onChange={handleFileInputChange}
                                    />
                                </div>
                                {error && (
                                    <div className="mb-4 ml-1 mt-1 text-red-600">
                                        <span className="text-white bg-red-600 rounded-full px-2">!</span> {errorMessage}
                                    </div>
                                )}
                                <div className="flex justify-between">
                                    <CustomButton type="button" varient="secondary" onClick={() => setVisible(false)}>
                                        Cancel
                                    </CustomButton>
                                    <CustomButton type="submit" varient="primary">
                                        Create
                                    </CustomButton>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
