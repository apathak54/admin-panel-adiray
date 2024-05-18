import { BrowserRouter, Route, Routes } from "react-router-dom"
import CreateBlog from "./pages/CreateBlogPost"
import UpdateBlog from "./pages/UpdateBlogPost"
import Blog from "./pages/Blog"
import Blogpost from "./pages/BlogPost"
import Navbar from "./components/Navbar"
import AdminLogin from "./pages/Admin/AdminLogin"
import AdminProduct from "./pages/Admin/AdminProduct"
import Category from "./pages/Category"


function App() {
 

  return (
    <>

    <BrowserRouter>
    <Navbar/>
    <Routes>
      <Route path="/admin/category/:categoryId" element={<AdminProduct/>} />
      <Route path="/admin/category/" element={<Category/>} />
      
      <Route path="/" element={<AdminLogin/>} />
      <Route path="/admin/blog/" element={<Blog/>} />
      <Route path="/admin/posts/" element={<CreateBlog/>} />
      <Route path="/admin/posts/:postId" element={<UpdateBlog />} />
      <Route path="/admin/blogposts/:postId" element={<Blogpost />} />
    </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
