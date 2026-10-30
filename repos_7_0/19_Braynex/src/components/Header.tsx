import { Coins, ListTodo, Trophy, User } from 'lucide-react'
import React from 'react'

const Header = () => {
  return (
    <header className="bg-white shadow-md p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
          <div className="size-8 mr-2 text-primary-blue">
              <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M12.0799 24L4 19.2479L9.95537 8.75216L18.04 13.4961L18.0446 4H29.9554L29.96 13.4961L38.0446 8.75216L44 19.2479L35.92 24L44 28.7521L38.0446 39.2479L29.96 34.5039L29.9554 44H18.0446L18.04 34.5039L9.95537 39.2479L4 28.7521L12.0799 24Z"
                  fill="currentColor"
                ></path>
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-[#1cb0f6]">Braynex</h1>
          </div>
          <nav className="flex items-center space-x-6">
            <a href="/leaderboard" className="flex items-center text-gray-600 hover:text-[#1cb0f6]">
              <Trophy className="mr-1" />
              Leaderboard
            </a>
            <a href="/task" className="flex items-center text-gray-600 hover:text-[#1cb0f6]">
              <ListTodo className="mr-1" />
              Tasks
            </a>
            <div className="flex items-center bg-[#e5f6fd] px-3 py-1 rounded-full">
              <span className="text-[#1cb0f6] font-semibold mr-2">{10}</span>
              <Coins className="mr-1"/>
            </div>
            <a href="/dashboard" className="flex items-center text-gray-600 hover:text-[#1cb0f6]">
              <User className="mr-1" />
              Profile
            </a>
          </nav>
        </div>
      </header>

  )
}

export default Header