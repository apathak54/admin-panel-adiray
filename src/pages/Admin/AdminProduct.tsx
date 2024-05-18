import { useEffect, useState } from "react";
import CustomCard from "../../components/CustomCard";
import CustomButton from "../../components/CustomButton/CustomButton";
import { useParams } from "react-router-dom";
import CreateProduct from "../../components/CreateProduct";
import EditProduct from "../../components/EditProduct";

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

    const [data, setData] = useState<Category | undefined>();
    const [name, setName] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [edit, setEdit] = useState(false);
    const [productEdit, setProductEdit] = useState(false);
    const { categoryId } = useParams();
    const token = localStorage.getItem('adminToken');
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
        let response = await fetch('http://localhost:8080/api/category/update', {
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
        fetch(`http://localhost:8080/api/category/product/${categoryId}`,
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
                <div className="flex justify-between">
                    <div className="font-medium text-3xl text-center mt-36">
                        {edit ?
                            <>
                                <input className="focus:bg-white my-2 mr-5 px-6 py-5 rounded-full mb-4 bg-gray-100" type="text" value={name} onChange={(e) => setName(e.target.value)} />

                            </>
                            :
                            <>
                                <div className="focus:bg-white my-2 mr-5 px-6 py-5 rounded-full mb-4 bg-gray-100">
                                    {data && data.name}
                                </div>
                            </>}
                    </div>
                    <div className="flex">


                        {edit ?
                            <>
                                <button
                                    type="button"
                                    onClick={updateCategory}
                                    className="flex justify-center items-center px-10 rounded-full mx-2 min-w-[200px] my-3 h-[60px] mt-36 bg-black text-white hover:bg-slate-900 ">
                                    Save
                                </button>
                                <button
                                    onClick={() => { setEdit((false)) }}
                                    className="flex justify-center items-center px-5 py-3 mx-2 my-3 card2 mt-36">
                                    Cancel
                                </button>
                            </> :
                            <>
                                <button
                                    onClick={() => { setModalVisible(true) }}
                                    className="flex justify-center items-center px-5 py-3 mx-2 my-3 card2 mt-36">
                                    Add Product
                                </button>
                                <button
                                    onClick={() => { setEdit((true)) }}
                                    className="flex justify-center items-center px-5 py-3 mx-2 my-3 card2 mt-36">
                                    Edit
                                </button>
                            </>
                        }
                    </div>
                </div>

                <div className="flex justify-center flex-wrap mb-20 mt-16">

                    <div className="mx-auto max-w-xl mb-16 text-center">
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
                                <div className="mt-8">
                                    {data?.imageUrl}
                                </div>
                            </>
                        }
                    </div>
                    {
                        data && data.products.map((item: Product, index: number) => (

                            <>
                                <List item={item} index={index} key={index} refresh={refresh} />
                            </>
                        ))
                    }
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

    return (
        <>
            <EditProduct refresh={refresh} visible={productEdit} setVisible={setProductEdit} product={item} />

            <div
                className={`w-full h-[55px] ${index % 3 === 0 ? "bg-gray-100" : "bg-white"
                    } flex items-center justify-between  p-7`}
            >
                <div className=" flex md:gap-14 gap-10">

                    <h4>{index}</h4>
                    <div className="">{item.name}</div>
                </div>
                <div className="w-[800px] flex md:gap-14 gap-10 items-center">
                    <div className="w-[600px] h-7 overflow-hidden ">
                        {item.url}
                    </div>
                </div>
                <button className="bg-blue-800 w-[70px]  text-white rounded-md text-[14px] p-1" onClick={() => setProductEdit(true)}
                >
                    Edit
                </button>

            </div>
        </>
    )
}

