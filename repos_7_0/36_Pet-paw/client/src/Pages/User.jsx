import { useState } from "react";
import Layout from "../Layouts/Layout";
import { Link } from "react-router-dom";

export default function User() {
    
    const [userDetail,setUserDetails] = useState(false)

    const toggleUser = () => {
        setUserDetails(!userDetail); 
    };
    
    return(
        <Layout>
            <div className="flex font-poppins cursor-default select-none gap-2 h-full">
                <div className="w-full mx-12 p-6 flex flex-col gap-5 bg-white rounded-lg shadow-md overflow-hidden">

                    <div className="flex items-center gap-2">
                        <img
                        className="w-16 h-16 rounded-full"
                        src="https://via.placeholder.com/100" 
                        alt="profile pic"/>

                        <div>
                            <h2 className="text-lg font-bold">Pranav A Viswam</h2>
                        </div>
                    </div>

                    <div className="px-4 py-3">
                        <div onClick={toggleUser} className="text-gray-700 font-semibold flex flex-row items-center">
                        <span className="my-2">Details</span>
                        <span className={`material-symbols-outlined ${userDetail && 'rotate-180'} duration-300`}>arrow_drop_down</span>
                        </div>

                        {userDetail && <div className="text-sm flex flex-col gap-1">
                            <p className="font-semibold">Email: <Link to="mailto:pranavviswam15@gmail.com" className="text-blue-500 font-normal">pranavviswam15@gmail.com</Link></p>
                            <p className="flex flex-row font-semibold">Phone number:<p className="font-normal"> +91 8139835562</p></p>
                            <p className="flex flex-row font-semibold">Date of birth:<p className="font-normal">16/06/2004</p></p>
                            <p className="font-semibold ">Home address:<p className="font-normal">ARA A-8 Janaganamana Surabhi Gardens Aithadi Road Uloor TVM-11</p></p>
                        </div>}

                        <div className="mt-4">
                            <h3 className="text-gray-700 font-semibold mb-2">Bio</h3>
                            <p className="flex space-x-2 font-light text-xs px-3">
                                but I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings of the great explorer of the truth, the master-builder of human happiness. No one rejects, dislikes, or avoids pleasure itself, because it is pleasure, but because those who do not know how to pursue pleasure rationally encounter consequences that are extremely painful. Nor again is there anyone who loves or pursues or de
                            </p>
                        </div>
                        
                        <div className="mt-4">
                            <h3 className="text-gray-700 font-semibold mb-2">Tags</h3>
                            <div className="flex space-x-2">
                                <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-xs">Dog Lover</span>
                                <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-xs">Party Person</span>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </Layout>
    )
}