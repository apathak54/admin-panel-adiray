import { useState } from "react";
import CustomButton from "./CustomButton/CustomButton";
import { useParams } from "react-router-dom";

interface Product {
    name: string;
    imageUrl: string;
    url: string;
    _id: string;
}

interface EditProductProps {
    visible: boolean;
    setVisible: (visible: boolean) => void;
    refresh: () => void;
    product: Product;
}

export default function EditProduct({ visible, setVisible, refresh, product }: EditProductProps) {
    const [name, setName] = useState(product.name);
    const [url, setUrl] = useState(product.url);
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const { categoryId } = useParams<{ categoryId: string }>();

    const token = localStorage.getItem('adminToken');
    if (!token) {
        window.location.href = '/admin/login';
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const response = await fetch('http://localhost:8080/api/category/product/update', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                name,
                url,
                productId: product._id,
                categoryId
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
    };

    function handleCancel() {
        setVisible(false);
        setErrorMessage('');
        setError(false);
        setName(product.name);
        setUrl(product.url);
    }

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
                                    placeholder="Product Name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                                <input
                                    className="focus:bg-white my-2 w-full px-6 py-5 rounded-full mb-4 bg-gray-100"
                                    type="text"
                                    placeholder="Url"
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                />
                                {error && (
                                    <div className="mb-4 ml-1 mt-1 text-red-600">
                                        <span className="text-white bg-red-600 rounded-full px-2">!</span> {errorMessage}
                                    </div>
                                )}
                                <div className="flex justify-between">
                                    <CustomButton type="button" varient="secondary" onClick={handleCancel}>
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
            )}
        </>
    );
}
