import { useEffect, useState } from "react";
import CustomCard from "../../components/CustomCard";
import CreateCategory from "../../components/CreateCategory";

interface Category {
    id: string;
    imageUrl: string;
    name: string;
}

export default function AdminCategory(): JSX.Element {

    const token = localStorage.getItem('adminToken');
    if (!token) {
        window.location.href = '/';
    }

    const [data, setData] = useState<Category[] | undefined>();
    const [modalVisible, setModalVisible] = useState(false);

    function refresh() {
        if (token) {
            fetch('https://node-js-jwt-auth.onrender.com/api/category', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': 'Bearer ' + token
                },
                body: JSON.stringify(data)
            })
                .then(res => res.json())
                .then((data: Category[]) => { setData(data) })
        }
    }

    useEffect(() => {
        refresh();
    }, [token])

    return (
        <>
            <div className="w-4/5 mx-auto min-h-screen mb-20">
                <div>&nbsp;</div>
                <div className="flex justify-between">
                    <div className="font-medium text-3xl text-center mt-40">Product Categories</div>
                    <button
                        onClick={() => { setModalVisible(true) }}
                        className="flex justify-center items-center px-5 py-3 mx-2 my-3 card2 mt-40">
                        Add Category
                    </button>
                </div>

                <div className="flex justify-center flex-wrap mt-16 mb-20">

                    {
                        data && data.length > 0 && data.map((item: Category, index: number) => {
                            return (
                                <a key={index} href={`/admin/category/${item.id}`}><CustomCard name={item.name} link={item.id} imageUrl={item.imageUrl} varient="category" /></a>
                            )
                        })
                    }

                    <CreateCategory refresh={refresh} visible={modalVisible} setVisible={setModalVisible} />
                </div>
            </div>
        </>
    );
}
