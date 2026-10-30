import { Link, useNavigate } from "react-router-dom";
import useAxios from "../../Auth/useAxios";

export default function Login({ CiUser, RiLockPasswordFill}) {

  const axios = useAxios()
  const navigate = useNavigate()

  const login = (evt) => {
    evt.preventDefault()

    const username = evt.target[0].value
    const password = evt.target[1].value
    const data = { username, password }

    axios.post('/auth/login', data)
    .then(() => {
      navigate('/')
    })
  }
  
  return (
    <div className="min-h-screen flex justify-center items-center bg-[#ca9e78] font-poppins cursor-default relative overflow-hidden">

      <div className="bg-[#fffbfb] p-8 shadow-lg rounded-lg w-[450px] flex flex-col items-center gap-3">
        <h2 className="text-3xl font-bold text-center mb-6">Login</h2>
        <form onSubmit={login} className="flex flex-col gap-1 items-center">
          <div className="relative mb-4 w-80">
            <CiUser className="absolute left-3 top-3 text-2xl" />
            <input
              id="username"
              type="text"
              placeholder="Username"
              className="w-full border border-gray-300 p-3 pl-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-brown-500"
              autoComplete="off"
            />
          </div>
          <div className="relative mb-4 w-80">
            <RiLockPasswordFill className="absolute left-3 top-3 text-2xl" />
            <input
              id="password"
              type="password"
              placeholder="Password"
              className="w-full border border-gray-300 p-3 pl-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-brown-500"
              autoComplete="off"
            />
          </div>
          <button
            className="w-fit my-2 bg-black text-white rounded-lg font-semibold hover:bg-orange-300 hover:text-gray-800 px-5 py-2 duration-150"
            type="submit">
            Sign Up
          </button>
        </form>
        <p className="text-center font-medium mt-4 flex flex-row gap-1">
          <span>Don&apos;t have an account?</span>
          <Link to='/signup' className="text-cyan-500 underline">Sign Up!</Link>
        </p>
      </div>
    </div>
  );
}
