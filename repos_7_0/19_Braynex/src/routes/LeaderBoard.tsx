"use client"

import React from 'react'
import { Trophy, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import Header from '../components/Header'

const leaderboardData = [
  { id: 1, name: "Alex", points: 1250, avatar: "https://cdn3d.iconscout.com/3d/premium/thumb/boy-avatar-3d-icon-download-in-png-blend-fbx-gltf-file-formats--boys-male-man-pack-avatars-icons-5187865.png?f=webp" },
  { id: 2, name: "Emma", points: 1180, avatar: "https://cdn3d.iconscout.com/3d/premium/thumb/boy-avatar-3d-icon-download-in-png-blend-fbx-gltf-file-formats--boys-male-man-pack-avatars-icons-5187865.png?f=webp" },
  { id: 3, name: "Michael", points: 1050, avatar: "https://cdn3d.iconscout.com/3d/premium/thumb/boy-avatar-3d-icon-download-in-png-blend-fbx-gltf-file-formats--boys-male-man-pack-avatars-icons-5187865.png?f=webp" },
  { id: 4, name: "Sophia", points: 980, avatar: "https://cdn3d.iconscout.com/3d/premium/thumb/boy-avatar-3d-icon-download-in-png-blend-fbx-gltf-file-formats--boys-male-man-pack-avatars-icons-5187865.png?f=webp" },
  { id: 5, name: "Daniel", points: 920, avatar: "https://cdn3d.iconscout.com/3d/premium/thumb/boy-avatar-3d-icon-download-in-png-blend-fbx-gltf-file-formats--boys-male-man-pack-avatars-icons-5187865.png?f=webp" },
  { id: 6, name: "Olivia", points: 890, avatar: "https://cdn3d.iconscout.com/3d/premium/thumb/boy-avatar-3d-icon-download-in-png-blend-fbx-gltf-file-formats--boys-male-man-pack-avatars-icons-5187865.png?f=webp" },
  { id: 7, name: "William", points: 850, avatar: "https://cdn3d.iconscout.com/3d/premium/thumb/boy-avatar-3d-icon-download-in-png-blend-fbx-gltf-file-formats--boys-male-man-pack-avatars-icons-5187865.png?f=webp" },
  { id: 8, name: "Ava", points: 820, avatar: "https://cdn3d.iconscout.com/3d/premium/thumb/boy-avatar-3d-icon-download-in-png-blend-fbx-gltf-file-formats--boys-male-man-pack-avatars-icons-5187865.png?f=webp" },
  { id: 9, name: "James", points: 800, avatar: "https://cdn3d.iconscout.com/3d/premium/thumb/boy-avatar-3d-icon-download-in-png-blend-fbx-gltf-file-formats--boys-male-man-pack-avatars-icons-5187865.png?f=webp" },
  { id: 10, name: "Isabella", points: 780, avatar: "https://cdn3d.iconscout.com/3d/premium/thumb/boy-avatar-3d-icon-download-in-png-blend-fbx-gltf-file-formats--boys-male-man-pack-avatars-icons-5187865.png?f=webp" },
]

export default function Leaderboard() {
  return (
    <div className="min-h-screen bg-gray-100">
          <Header />


      <main className="max-w-4xl mx-auto mt-8 p-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <Trophy className="mr-2 text-[#ffd700]" />
            Leaderboard
          </h2>
          <div className="space-y-4">
            {leaderboardData.map((user, index) => (
              <Link to={`/user/${user.id}`} key={user.id}>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                  <div className="flex items-center space-x-4">
                    <span className={`font-bold text-lg ${index < 3 ? 'text-[#ffd700]' : 'text-gray-500'}`}>
                      {index + 1}
                    </span>
                    <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full" />
                    <span className="font-semibold">{user.name}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="font-bold text-[#1cb0f6]">{user.points} pts</span>
                    <ChevronRight className="text-gray-400" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}