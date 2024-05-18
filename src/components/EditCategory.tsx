import { useState, ChangeEvent, FormEvent } from "react";
import CustomButton from "./CustomButton/CustomButton";

interface AddCategoryProps {
    refresh: () => void;
    token: string | null;
    setVisible: (value: boolean) => void;
    categoryId: string | undefined;
    data: {
        name: string;
        imageUrl: string[];
    };
}

export default function EditCategory({ data, categoryId, refresh, token, setVisible }: AddCategoryProps) {
    const [formData, setFormData] = useState({
        name: data.name,
        imageUrl: data.imageUrl,
    });
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [error, setError] = useState<boolean>(false);

    function handleNameChange(e: ChangeEvent<HTMLInputElement>) {
        setFormData({ ...formData, name: e.target.value });
    }

    function handleImageUrlChange(index: number, event: ChangeEvent<HTMLInputElement>) {
        const newImageUrls = formData.imageUrl.map((url, i) => {
            return i === index ? event.target.value : url;
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

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const response = await fetch(`https://node-js-jwt-auth.onrender.com/api/category/update`, {
            method: 'POST', // Assuming POST for update, it might be PUT/PATCH based on API
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                ...formData,
                _id: categoryId
            })
        });
        const data = await response.json();
        if (data.success) {
            setVisible(false);
            refresh();
        } else {
            setErrorMessage(data.message);
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
                        {formData.imageUrl.map((value, index) => (
                            <div key={index} className="relative w-full">
                                <input
                                    className="focus:bg-white my-2 w-full px-6 py-5 rounded-full mb-4 bg-gray-100"
                                    type="text"
                                    placeholder={`Image Url ${index + 1}`}
                                    value={value}
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
                            <div className="mb-4 text-red-600">
                                <span className="text-white bg-red-600 rounded-full px-2">!</span> {errorMessage}
                            </div>
                        )}
                        <div className="flex justify-between">
                            <CustomButton type="button" varient="secondary" onClick={() => setVisible(false)}>
                                Cancel
                            </CustomButton>
                            <CustomButton type="submit" varient="primary">
                                Update
                            </CustomButton>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
