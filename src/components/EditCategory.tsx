import { useState } from "react";
import CustomButton from "./CustomButton/CustomButton";

interface AddCategoryProps {
    refresh: () => void;
    token: string | null;
    setVisible: (value: boolean) => void;
    categoryId: string | undefined;
    data: {
        name: string;
        imageUrl: string[];
    }
}

export default function EditCategory({ data, categoryId, refresh, token, setVisible }: AddCategoryProps) {
    const [formData, setFormData] = useState({
        name: data.name,
        imageUrl: data.imageUrl,
    });
    const [errorMessage, setErrorMessage] = useState('');
    const [error, setError] = useState(false);

    function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
        setFormData({ ...formData, name: e.target.value });
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

    function deleteField(index: number, event: any) {
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
        const response = await fetch(`http://localhost:8080/api/category/update`, {
            method: 'POST', // Change method to POST for updating
            headers: {
                'Content-Type': 'application/json',
                'authorization': 'Bearer ' + token
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
        <>
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
                                            onClick={(e) => deleteField(index, e)}
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
        </>
    );
}


// import { useEffect, useState } from "react";
// import CustomButton from "./CustomButton/CustomButton";

// interface AddCategoryProps {
//     refresh: () => void;
//     token: string | null;
//     setVisible: (value: boolean) => void;
//     categoryId: string | undefined;
//     data: {
//         name: string;
//         imageUrl: [string];
//     }
// }

// export default function EditCategory({ data, categoryId, refresh, token, setVisible }: AddCategoryProps) {

//     const [formData, setFormData] = useState({
//         name: data.name,
//         imageUrl: data.imageUrl,
//     });
//     const [errorMessage, setErrorMessage] = useState('');
//     const [error, setError] = useState(false);

//     function handleNameChange(e: any) {
//         setFormData({ ...formData, name: e.target.value });
//     }

//     function handleImageUrlChange(index: number, event: React.ChangeEvent<HTMLInputElement>) {
//         const newImageUrls = formData.imageUrl.map((url, i) => {
//             if (i === index) {
//                 return event.target.value;
//             }
//             else {
//                 return url;
//             }
//         });
//         setFormData({
//             ...formData,
//             imageUrl: newImageUrls
//         })
//     }

//     function addField() {
//         setFormData(prevData => ({
//             ...prevData,
//             imageUrl: [...prevData.imageUrl, '']
//         }))
//     }

//     function deleteField(index: number, event: any) {
//         if (formData.imageUrl.length <= 1) {
//             return;
//         }
//         const newImageUrls = formData.imageUrl.filter((_, i) => i !== index);
//         setFormData({
//             ...formData,
//             imageUrl: newImageUrls
//         });
//     }

//     const handleSubmit = async (e: any) => {
//         e.preventDefault();
//         const response = await fetch(`http://localhost:8080/api/category/update`, {
//             method: 'POST', // Change method to POST for updating
//             headers: {
//                 'Content-Type': 'application/json',
//                 'authorization': 'Bearer ' + token
//             },
//             body: JSON.stringify({
//                 ...formData,
//                 _id: categoryId
//             })
//         });
//         const data = await response.json();
//         if (data.success) {
//             setVisible(false);
//             refresh();
//         }
//         else {
//             setErrorMessage(data.message);
//             setError(true);
//         }
//     }

//     return (
//         <>
//             <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
//                 <div className="bg-white rounded-lg p-8">
//                     <div className="mx-auto max-w-96 text-center w-96">
//                         <form onSubmit={handleSubmit}>
//                             <input className="focus:bg-white my-2 w-full px-6 py-5 rounded-full mb-4 bg-gray-100" type="text" placeholder="Category Name" value={formData.name} onChange={handleNameChange} />
//                             {
//                                 formData.imageUrl.map((value, index) => {
//                                     return (
//                                         <>
//                                             <div key={index} className="relative w-full">
//                                                 <input className="focus:bg-white my-2 w-full px-6 py-5 rounded-full mb-4 bg-gray-100" type="text" placeholder={`Image Url ${index + 1}`} value={formData.imageUrl[index]} onChange={(e) => handleImageUrlChange(index, e)} />
//                                                 {formData.imageUrl.length > 1 && <button type="button" onClick={(e) => { deleteField(index, e) }} className=" bg-white px-3 hover:cursor-pointer absolute right-4 top-7">Delete</button>}

//                                             </div>
//                                         </>
//                                     )
//                                 })
//                             }
//                             <button onClick={addField} type="button" className="hover:bg-gray-200 my-2 w-full px-6 py-5 rounded-full mb-4 bg-gray-100">Add Field</button>
//                             {/* <input className="focus:bg-white my-2 w-full px-6 py-5 rounded-full mb-4 bg-gray-100" type="text" placeholder="Image Url" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} /> */}

//                             {/* <div className={` ${error ? '' : 'hidden'} mb-4 ml-1 mt-1 text-red-600`}>
//                                 <span className="text-white bg-red-600 rounded-full px-2">!</span> {errorMessage}
//                             </div> */}
//                             <div className="flex justify-between">
//                                 <CustomButton type="button" varient="secondary" onClick={() => setVisible(false)}>Cancel</CustomButton>
//                                 <CustomButton type="submit" varient="primary">Create</CustomButton>
//                             </div>
//                         </form>
//                     </div>
//                 </div>
//             </div>
//         </>
//     )
// }