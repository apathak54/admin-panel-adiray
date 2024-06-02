import { BrowserRouter, Route, Routes } from "react-router-dom"
import UpdateBlog from "./pages/UpdateBlogPost"
import Blog from "./pages/Blog"
import Blogpost from "./pages/BlogPost"
import Navbar from "./components/Navbar"
import AdminLogin from "./pages/Admin/AdminLogin"
import AdminProduct from "./pages/Admin/AdminProduct"
import Category from "./pages/Category"
import CreatePost from "./pages/CreatePost"
import Footer from "./components/Footer"


function App() {
 

  return (
    <>

    <BrowserRouter >
    <Navbar/>

    <Routes>
      <Route path="/admin/category/:categoryId" element={<AdminProduct/>} />
      <Route path="/admin/category/" element={<Category/>} />
      <Route path="/admin/create/post" element={<CreatePost/>} />
      <Route path="/" element={<AdminLogin/>} />
      <Route path="/admin/blog/" element={<Blog/>} />
      <Route path="/admin/posts/:postId" element={<UpdateBlog />} />
      <Route path="/admin/blogposts/:postId" element={<Blogpost />} />

    </Routes>
    <Footer/>
    </BrowserRouter>
   
    </>
  )
}

export default App
