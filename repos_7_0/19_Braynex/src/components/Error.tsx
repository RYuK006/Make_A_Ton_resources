import { HomeIcon } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function ErrorPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-4">
        <style>
        {`
          @keyframes dash {
            to {
              stroke-dashoffset: 0;
            }
          }
        `}
      </style>
      <div className="text-center">
        <h1 className="text-6xl font-bold text-primary-green mb-4">Oops!</h1>
        <p className="text-2xl text-gray-600 mb-8">Something went wrong on our end.</p>
        
        <div className="w-64 h-64 mx-auto mb-8">
          <svg
            viewBox="0 0 100 100"
            className="stroke-primary-green fill-none stroke-2"
          >
            <circle cx="50" cy="50" r="45" className="animate-pulse" />
            <path
              d="M 30 40 Q 50 20 70 40"
              className="animate-[dash_1.5s_ease-in-out_infinite]"
              strokeDasharray="80"
              strokeDashoffset="80"
            />
            <circle cx="35" cy="40" r="5" className="fill-[white]" />
            <circle cx="65" cy="40" r="5" className="fill-[white]" />
            <path
              d="M 30 60 Q 50 80 70 60"
              className="animate-[dash_1.5s_ease-in-out_infinite_0.5s]"
              strokeDasharray="80"
              strokeDashoffset="80"
            />
          </svg>
        </div>

        <p className="text-xl text-gray-600 mb-8">
          Don't worry, our team has been notified and we're working on it!
        </p>
        
        <Link
          to="/"
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-green hover:bg-[#120309] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-green transition-colors duration-200"
        >
          <HomeIcon className="mr-2 h-5 w-5" />
          Go back home
        </Link>
      </div>
     
    </div>
  )
}