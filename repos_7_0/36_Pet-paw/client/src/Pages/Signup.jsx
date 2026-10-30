import { useNavigate } from "react-router-dom"
import useAxios from "../../Auth/useAxios"

export default function SignUp({ CiUser, RiLockPasswordFill }) {

  const axios = useAxios()
  const navigate = useNavigate()
  
  const signup = (evt) => {
    evt.preventDefault()

    const username = evt.target[0].value
    const password = evt.target[1].value
    const confirm = evt.target[2].value

    if(confirm!=password) return;
    const data = { username, password }

    axios.post('/auth/signup', data)
    .then(() => {
      navigate('/')
    })
  }

  return (
    <div className="min-h-screen flex justify-center items-center font-poppins relative overflow-hidden">

      <div className="p-8 shadow-lg rounded-lg w-[450px] flex flex-col">
        <h2 className="text-3xl font-bold text-center mb-6">Sign Up</h2>
        <form onSubmit={signup}>
          <div className="relative mb-4">
            <CiUser className="absolute left-3 top-3 text-2xl" />
            <input
              type="text"
              placeholder="Username"
              className="w-full border border-gray-300 p-3 pl-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-brown-500"
            />
          </div>

          <div className="relative mb-4">
            <RiLockPasswordFill className="absolute left-3 top-3 text-2xl" />
            <input
              type="password"
              placeholder="Password"
              className="w-full border border-gray-300 p-3 pl-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-brown-500"
            />
          </div>

          <div className="relative mb-4">
            <RiLockPasswordFill className="absolute left-3 top-3 text-2xl" />
            <input
              type="password"
              placeholder="Confirm Password"
              className="w-full border border-gray-300 p-3 pl-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-brown-500"
            />
          </div>

          <button
            className="w-full bg-amber-700 text-white py-3 rounded-lg font-semibold hover:bg-yellow-800 "
            type="submit">
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}
