import {  useState } from "react";
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
    const [imageUrl, setImageUrl] = useState('');
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

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        const response = await fetch('http://localhost:8080/api/category/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'authorization': 'Bearer ' + token
            },
            body: JSON.stringify({
                name: name,
                imageUrl: [file?.name],
                picture: file
            })
        });
        const data = await response.json();
        if (data.success) {
            setVisible(false);
            setName('');
            setImageUrl('');
            refresh();
            console.log(data);
        }
        else {
            setErrorMessage(data.error);
            setError(true);
        }
    }

    return (
        <>
            {
                visible &&
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
                    <div className="bg-white rounded-lg p-8">
                        <div className="mx-auto max-w-96 text-center w-96">
                            <form onSubmit={handleSubmit}>
                                <input className="focus:bg-white my-2 w-full px-6 py-5 rounded-full mb-4 bg-gray-100" type="text" placeholder="Category Name" value={name} onChange={(e) => setName(e.target.value)} />
                                <input className="focus:bg-white my-2 w-full px-6 py-5 rounded-full mb-4 bg-gray-100" type="text" placeholder="Image Url" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />

                                <div className={` ${error ? '' : 'hidden'} mb-4 ml-1 mt-1 text-red-600`}>
                                    <span className="text-white bg-red-600 rounded-full px-2">!</span> {errorMessage}
                                </div>
                                <div className="flex justify-between">
                                    <CustomButton type="button" varient="secondary" onClick={() => setVisible(false)}>Cancel</CustomButton>
                                    <CustomButton type="submit" varient="primary">Create</CustomButton>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            }
        </>
    )
}
