import { useContext, useEffect } from "react"
import Authcontext from "../../Auth/Authcontext"
import { Link } from "react-router-dom"

export default function Navbar() {

    const data = useContext(Authcontext)

    useEffect(() => console.log(data))

    return (
        <div className="bg-gray-700 bg-opacity-10 shadow-sm h-20 grid grid-cols-3 items-center text-gray-600">
            <span className="col-start-2 justify-self-center text-5xl font-medium ">PetPaw</span>
            <div className="justify-self-end px-3 flex gap-3 items-center">
                <Link to='/login' className="border-2 rounded-lg border-gray-700 text-gray-800 px-3 py-1 h-fit hover:bg-gray-700 hover:text-gray-100 duration-150">Login</Link>
                <Link to='/signup' className="border-2 rounded-lg border-gray-700 text-gray-800 px-3 py-1 h-fit hover:bg-gray-700 hover:text-gray-100 duration-150">Signup</Link>
            </div>
        </div>
    )
}