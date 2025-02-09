
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home'
import ContractOwner from '../pages/ContractOwner'
import LandInspector from '../pages/LandInspector'
import User from '../pages/User'
import FAQ from '../components/FAQ'
import Contact from '../components/Contact'
import About from '../components/About'
import Login from '../pages/Login'
import Register from '../pages/registerUser'
// import ProtectedRoute from "../components/ProtectedRoute"
const Router = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path='/contractOwner' element={<ContractOwner />} />
            <Route path='/landInspector' element={<LandInspector />} />
            <Route path='/user' element={<User />} />
            {/* <Route path="/contractOwner" element={<ProtectedRoute element={<ContractOwner />} allowedRole="contractOwner" />} />
            <Route path="/landInspector" element={<ProtectedRoute element={<LandInspector />} allowedRole="landInspector" />} />
            <Route path="/user" element={<ProtectedRoute element={<User />} allowedRole="user" />} /> */}
            <Route path='/faq' element={<FAQ />} />
            <Route path='/contact' element={<Contact />} />
            <Route path='/about' element={<About />} />
            <Route path='/login' element={<Login />} />
            <Route path="/register" element={<Register />} />
        </Routes>
    )
}

export default Router