import { useEffect, useState } from "react";
import CustomCard from "../../components/CustomCard";
import CustomButton from "../../components/CustomButton/CustomButton";
import { useParams } from "react-router-dom";
import CreateProduct from "../../components/CreateProduct";
import EditProduct from "../../components/EditProduct";
import { useMediaQuery } from 'react-responsive';

interface Product {
    name: string;
    imageUrl: string;
    url: string;
    _id: string;
}

interface Category {
    _id: string;
    name: string;
    imageUrl: string;
    products: Product[];
    __v: number;
}

export default function AdminProduct(): JSX.Element {

    const inputClasses = "pl-10 pr-4 w-[100%] py-3 shadow-md text-md  rounded-lg";
    const isSmallScreen = useMediaQuery({ query: '(max-width: 700px)' });

    const [data, setData] = useState<Category | undefined>();
    const [name, setName] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [edit, setEdit] = useState(false);
    const [productEdit, setProductEdit] = useState(false);
    const { categoryId } = useParams();
    const token = localStorage.getItem('adminToken');
    const [query, setQuery] = useState('');
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);



    if (!token) {
        window.location.href = '/admin/login';
    }

    function refresh() {
        fetch(`https://node-js-jwt-auth.onrender.com/api/category/product/${categoryId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'authorization': 'Bearer ' + token
            },
        })
            .then(res => res.json())
            .then((data: Category) => { setData(data) });
    }

    async function updateCategory() {
        console.log('Updating category');
        if (!data)
            return;
        data.name = name;
        data.imageUrl = imageUrl;
        let response = await fetch('https://node-js-jwt-auth.onrender.com/api/category/update', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'authorization': 'Bearer ' + token

            },
            body: JSON.stringify(data)
        });
        response = await response.json();
        setEdit(false);
        refresh();
        console.log(response);
    }

    useEffect(() => {
        if (data) {
            const filtered = data.products.filter(product =>
                product.name.toLowerCase().includes(query.toLowerCase())
            );
            setFilteredProducts(filtered);
        }
    }, [data, query]);


    useEffect(() => {
        fetch(`https://node-js-jwt-auth.onrender.com/api/category/product/${categoryId}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': 'Bearer ' + token
                },
                body: JSON.stringify(data)
            }
        )
            .then(res => res.json())
            .then((data: Category) => {
                console.log(data);
                console.log(data.products);
                setData(data);
                setName(data.name);
                setImageUrl(data.imageUrl);
            });
    }, [])

    return (
        <>
            <div className="w-4/5 mx-auto mb-20 min-h-screen">
                <div>&nbsp;</div>
                <div className={`${isSmallScreen ? 'justify-center flex-wrap' : 'justify-between '} mt-8 flex items-center max-w-[1250px] mx-auto `}>
                    <div className="font-medium text-3xl text-center ">
                        <div className="font-semibold text-3xl my-2 mr-5 px-6 py-5">
                            {data && data.name}
                        </div>
                    </div>
                    <div className="flex">


                        {edit ?
                            <>
                                <button
                                    type="button"
                                    onClick={updateCategory}
                                    className="flex justify-center items-center px-10 rounded-full mx-2 min-w-[200px] my-3 h-[60px]  bg-black text-white hover:bg-slate-900 ">
                                    Save
                                </button>
                                <button
                                    onClick={() => { setEdit((false)) }}
                                    className="flex justify-center items-center px-5 py-3 mx-2 my-3 card2 ">
                                    Cancel
                                </button>
                            </> :
                            <>
                                <button
                                    onClick={() => { setModalVisible(true) }}
                                    className="flex justify-center items-center px-5 py-3 mx-2 my-3 card2 ">
                                    Add Product
                                </button>
                                {/* <button
                                    onClick={() => { setEdit((true)) }}
                                    className="flex justify-center items-center px-5 py-3 mx-2 my-3 card2 ">
                                    Edit
                                </button> */}
                            </>
                        }
                    </div>
                </div>

                <div className="mb-20 mt-16">

                    {/* <div className="mx-auto max-w-xl mb-16 text-center">
                        <img src={data?.imageUrl} alt={data?.name} className="mx-auto" />
                        {edit ?
                            <>
                                <input type="text"
                                    className="w-full px-4 py-3 mt-8 text-center"
                                    value={imageUrl}
                                    onChange={(e) => setImageUrl(e.target.value)}
                                />
                            </> :
                            <>
                                <div className="mt-8 overflow-hidden">
                                    {data?.imageUrl}
                                </div>
                            </>
                        }
                    </div> */}

                    <div className="flex justify-center min-h-[600px]">

                        <div className="max-w-[1000px] bg-gray-200 py-4 rounded-lg">
                            <div className="w-full mb-3">
                                <input type="text" placeholder="Search" className="w-full py-2 px-4 rounded-lg"
                                    value={query} onChange={(e) => setQuery(e.target.value)}
                                />
                            </div>
                            {
                                filteredProducts.length === 0 && <div className="mx-auto text-center font-medium mt-10 ">No Products found</div>
                            }
                            {
                                filteredProducts.map((item: Product, index: number) => (
                                    <List item={item} index={index + 1} key={index} refresh={refresh} />
                                ))
                            }

                        </div>
                    </div>
                    <CreateProduct refresh={refresh} visible={modalVisible} setVisible={setModalVisible} categoryId={categoryId} />

                </div>
            </div>
        </>
    );

}

interface ListProps {
    item: Product;
    refresh: () => void;
    index: number;
}

function List({ item, refresh, index }: ListProps) {

    const [productEdit, setProductEdit] = useState(false);
    const [name, setName] = useState(item.name);
    const { categoryId } = useParams();

    useEffect(() => {
        setName(item.name);
    }, [item]);

    const token = localStorage.getItem('adminToken');
    if (!token) {
        window.location.href = '/admin/login';
    }

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        const response = await fetch('https://node-js-jwt-auth.onrender.com/api/category/product/update', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'authorization': 'Bearer ' + token
            },
            body: JSON.stringify({
                name: name,
                productId: item._id,
                categoryId: categoryId
            })
        });
        const data = await response.json();
        if (data.success) {
            setProductEdit(false);
            refresh();
            console.log(data);
        }
        else {
            alert(data.message);
        }
    }

    async function handleDelete() {
        const response = await fetch(`https://node-js-jwt-auth.onrender.com/api/category/${categoryId}/product/${item._id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'authorization': 'Bearer ' + token
            },
            body: JSON.stringify({
                name: name,
                productId: item._id,
                categoryId: categoryId
            })
        });
        const data = await response.json();
        if (data.success) {
            setProductEdit(false);
            refresh();
        }
        else {
            alert(data.message);
        }
    }

    return (
        <>
            <EditProduct refresh={refresh} visible={false} setVisible={setProductEdit} product={item} />

            <div
                className={`w-full min-h-[55px] ${index % 2 === 0 ? "bg-gray-100" : "bg-white"
                    } flex items-center justify-between  p-7`}
            >
                <div className=" flex md:gap-14 gap-10">

                    <h4>{index}</h4>
                    <div className="">
                        {
                            productEdit ?
                                <>
                                    <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                                        className=" min-w-32 px-4" />
                                </>
                                :
                                <>{item.name}</>
                        }
                    </div>
                </div>
                {
                    productEdit ?
                        <div>
                            <button className="bg-blue-800 w-[70px] mx-2 text-white rounded-md text-[14px] p-1" onClick={handleSubmit}
                            >
                                Save
                            </button>
                            <button className="bg-blue-800 w-[70px] mx-2 text-white rounded-md text-[14px] p-1" onClick={() => setProductEdit(false)}
                            >
                                Cancel
                            </button>
                        </div>
                        :
                        <>
                            <div className="flex flex-nowrap">
                                <button className="bg-blue-800 mx-2 w-[70px]  text-white rounded-md text-[14px] p-1" onClick={() => setProductEdit(true)}
                                >
                                    Edit
                                </button>
                                <button className="bg-blue-800 mx-2 w-[70px]  text-white rounded-md text-[14px] p-1" onClick={handleDelete}
                                >
                                    Delete
                                </button>
                            </div>
                        </>
                }

            </div>
        </>
    )
}
