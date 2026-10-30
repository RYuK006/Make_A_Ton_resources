import { Routes, Route } from 'react-router-dom'
import User from './Pages/User'
import Home from './Pages/Home'
import { AuthProvider } from '../Auth/Authcontext'
import SignUp from './Pages/Signup'
import { MdEmail } from "react-icons/md";
import { CiUser } from "react-icons/ci";
import { RiLockPasswordFill } from "react-icons/ri";
import Login from './Pages/Login';

function App() {

  return (
    <AuthProvider>
      <Routes>
        <Route path='/'element={<Home />} />
        <Route path='/profile'element={<User/>} />
        <Route path='/signup' element={<SignUp CiUser={CiUser} RiLockPasswordFill={RiLockPasswordFill} MdEmail={MdEmail}/>}/>
        <Route path='/login' element={<Login CiUser={CiUser} RiLockPasswordFill={RiLockPasswordFill} />}/>
        <Route path='*' element={<div className='font-poppins text-4xl font-medium flex h-svh justify-center items-center text-gray-700'>Page not found :&#40;</div>} />
      </Routes>
    </AuthProvider>
  )
}

export default App
