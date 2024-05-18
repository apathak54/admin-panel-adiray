import { useState } from "react";
import CustomButton from "./CustomButton/CustomButton";

interface AddCategoryProps {
    refresh: () => void;
    token: string | null;
    setVisible: (value: boolean) => void;
}

interface FormData {
    name: string;
    imageUrl: string[];
}

export default function AddCategory({ refresh, token, setVisible }: AddCategoryProps) {

    const [formData, setFormData] = useState<FormData>({
        name: '',
        imageUrl: [''],
    });
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [error, setError] = useState<boolean>(false);

    function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
        setFormData({...formData, name: e.target.value});
    }

    function handleImageUrlChange(index: number, event: React.ChangeEvent<HTMLInputElement>) {
        const newImageUrls = formData.imageUrl.map((url, i) => {
            if (i === index) {
                return event.target.value;
            } else {
                return url;
            }
        });
        setFormData({
            ...formData,
            imageUrl: newImageUrls
        });
    }

    function addField() {
        setFormData(prevData => ({
            ...prevData,
            imageUrl: [...prevData.imageUrl, '']
        }));
    }

    function deleteField(index: number) {
        if (formData.imageUrl.length <= 1) {
            return;
        }
        const newImageUrls = formData.imageUrl.filter((_, i) => i !== index);
        setFormData({
            ...formData,
            imageUrl: newImageUrls
        });
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const response = await fetch('https://node-js-jwt-auth.onrender.com/api/category/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(formData)
        });
        const data = await response.json();
        console.log('Save response: ', data);
        if (data.success) {
            setVisible(false);
            refresh();
            console.log(data);
        } else {
            setErrorMessage(data.error);
            setError(true);
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
            <div className="bg-white rounded-lg p-8">
                <div className="mx-auto max-w-96 text-center w-96">
                    <form onSubmit={handleSubmit}>
                        <input
                            className="focus:bg-white my-2 w-full px-6 py-5 rounded-full mb-4 bg-gray-100"
                            type="text"
                            placeholder="Category Name"
                            value={formData.name}
                            onChange={handleNameChange}
                        />
                        {formData.imageUrl.map((_, index) => (
                            <div key={index} className="relative w-full">
                                <input
                                    className="focus:bg-white my-2 w-full px-6 py-5 rounded-full mb-4 bg-gray-100"
                                    type="text"
                                    placeholder={`Image Url ${index + 1}`}
                                    value={formData.imageUrl[index]}
                                    onChange={(e) => handleImageUrlChange(index, e)}
                                />
                                {formData.imageUrl.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => deleteField(index)}
                                        className="bg-white px-3 hover:cursor-pointer absolute right-4 top-7"
                                    >
                                        Delete
                                    </button>
                                )}
                            </div>
                        ))}
                        <button
                            onClick={addField}
                            type="button"
                            className="hover:bg-gray-200 my-2 w-full px-6 py-5 rounded-full mb-4 bg-gray-100"
                        >
                            Add Field
                        </button>
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
    );
}
