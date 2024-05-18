import { useEffect, useState } from "react";
import { useMediaQuery } from 'react-responsive';
import CustomCard from "../components/CustomCard";
import AddCategory from "../components/AddCategory";

interface Category {
    id: string;
    imageUrl: [string];
    name: string;
}

export default function Category() {

    const token = localStorage.getItem('adminToken');
    if (!token)
        window.location.href = '/';

    const [data, setData] = useState<Category[] | undefined>();
    const [createCategory, setCreateCategory] = useState(false);
    const [filteredCategory, setFilteredCategory] = useState<Category[] | undefined>();
    const [searchQuery, setSearchQuery] = useState('');
    const isSmallScreen = useMediaQuery({ query: '(max-width: 700px)' });


    async function getData() {
        console.log("Fetching");
        const response = await fetch(`https://node-js-jwt-auth.onrender.com/api/category`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'authorization': 'Bearer ' + token
            },
        });
        const data = await response.json();
        setData(data);
        console.log(data);
    }

    //Get data on page load
    useEffect(() => {
        getData();
    }, []);

    useEffect(() => {
        if (!data) {
            return;
        }
        const filtered = data.filter(category =>
            category.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredCategory(filtered);
        console.log(filteredCategory);
    }, [data, searchQuery]);

    return (
        <>

            {/* Header  */}
            <div className={`${isSmallScreen ? 'justify-center flex-wrap' : 'justify-between '} mt-8 flex items-center max-w-[1250px] mx-auto `}>
                <div className=" mb-4 text-3xl font-semibold">Product Categories</div>
                <div className={`${isSmallScreen ? 'flex-wrap justify-center' : 'justify-between'} flex items-center`}>
                    <input type="text" placeholder="Search" className=" px-4 py-2 mb-4 w-[350px] border-2 rounded-lg"
                        value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button
                        onClick={() => { setCreateCategory(true) }}
                        className=" mb-4 flex justify-center items-center px-3 py-1 mx-2 card2">
                        Add Category
                    </button>
                </div>
            </div>

            {/* Categories  */}
            <div className={`${isSmallScreen ? 'justify-center' : ''} flex flex-wrap mt-20 mx-auto max-w-[1250px]`}>
                {
                    data && filteredCategory && filteredCategory.length > 0 && filteredCategory.map((item: Category, index: number) => {
                        return (
                            <CustomCard key={index} refresh={getData} name={item.name} link={item.id} imageUrl={item.imageUrl} />
                        )
                    })
                }
            </div>

            {
                createCategory && <AddCategory token={token} setVisible={setCreateCategory} refresh={getData} />
            }
        </>
    )
}