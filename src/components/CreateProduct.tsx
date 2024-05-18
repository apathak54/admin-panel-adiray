import { useState } from "react";
import CustomButton from "./CustomButton/CustomButton";

interface CustomButtonProps {
    visible: boolean;
    setVisible: (visible: boolean) => void;
    refresh: () => void;
    categoryId: string | undefined;
}

export default function CreateProduct({ visible, setVisible, refresh, categoryId }: CustomButtonProps) {
    const [name, setName] = useState('');
    const [url, setUrl] = useState('');
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const token = localStorage.getItem('adminToken');
    if (!token) {
        window.location.href = '/';
    }

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        const response = await fetch('http://localhost:8080/api/category/product/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'authorization': 'Bearer ' + token
            },
            body: JSON.stringify({
                name: name,
                categoryId: categoryId,
            })
        });
        const data = await response.json();
        if (data.success) {
            setVisible(false);
            setName('');
            setUrl('');
            refresh();
            console.log(data);
        }
        else {
            setErrorMessage(data.message);
            setError(true);
        }
    }

    return (
        <>
            {visible &&
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
                    <div className="bg-white rounded-lg p-8 shadow-lg max-w-md w-full">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <h2 className="text-xl font-semibold text-center mb-4">Create New Product</h2>
                            <div className="w-full">
                                <label htmlFor="productName" className="   w-full block text-sm font-medium text-gray-700">Product Name</label>
                                <input
                                    id="productName"
                                    className="input-field w-full my-2 px-2 py-2 rounded-lg  "
                                    type="text"
                                    placeholder="Enter product name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>
                            {error && (
                                <div className="text-red-600">
                                    <span className="bg-red-600 text-white rounded-full px-2 mr-2">!</span>
                                    {errorMessage}
                                </div>
                            )}
                            <div className="flex justify-end space-x-4">
                                <CustomButton
                                    type="button"
                                    varient="secondary"
                                    onClick={() => setVisible(false)}
                                >
                                    Cancel
                                </CustomButton>
                                <CustomButton type="submit" varient="primary">Create</CustomButton>
                            </div>
                        </form>
                    </div>
                </div>
            }
        </>
    );
}
