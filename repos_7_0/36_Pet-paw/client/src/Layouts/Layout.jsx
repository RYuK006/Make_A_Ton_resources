import { Link } from "react-router-dom"
import Navbar from "../Components/Navbar"

export default function Layout({ children }) {

    const links = [
        { path: '/', text: 'Home' },
        { path: '/profile', text: 'Profile' }
    ]
    
    return (
        <div>
            <Navbar />
            <div className="grid grid-cols-4 gap-16 p-5">
                <Navigate paths={links} /> 
                <div className="col-start-2 col-span-2 ">
                    {children}
                </div>
            </div>
        </div>
    )
}

function Navigate({ paths }) {
    return (
        <div className="bg-white min-h-[90svh] shadow-lg col-start-1 flex flex-col py-10 items-center text-xl gap-5">
            {paths.map((item,index) => {
                return <Link className={`rounded-full ${window.location.pathname==item.path ? 'bg-gray-400' : 'hover:bg-gray-300'} w-[80%] text-center px-3 py-2`} key={index} to={item.path}>{item.text}</Link>
            })}
        </div>
    )
}