"use client"

import React, { useState } from 'react'
import { Send, Image, Phone, Video, Paperclip, MoreVertical, Search, Menu, Bell } from 'lucide-react'
import Header from '../components/Header'

interface Message {
  id: number
  sender: string
  content: string
  timestamp: string
  isMentor?: boolean
}

interface User {
  id: number
  name: string
  avatar: string
  isMentor?: boolean
  isOnline: boolean
  lastMessage?: string
}

const initialMessages: Message[] = [
  { id: 1, sender: 'Dr. Smith', content: 'Hello class! How is everyone doing today?', timestamp: '10:00 AM', isMentor: true },
  { id: 2, sender: 'Alice', content: 'Hi Dr. Smith! I\'m doing well, thanks for asking.', timestamp: '10:02 AM' },
  { id: 3, sender: 'Bob', content: 'I have a question about the last assignment. Can we discuss it?', timestamp: '10:05 AM' },
  { id: 4, sender: 'Dr. Smith', content: 'Of course, Bob. What\'s your question?', timestamp: '10:07 AM', isMentor: true },
]

const users: User[] = [
  { id: 1, name: 'Dr. Smith', avatar: 'https://cdn3d.iconscout.com/3d/premium/thumb/woman-avatar-3d-icon-download-in-png-blend-fbx-gltf-file-formats--profile-character-pack-avatars-icons-5187873.png', isMentor: true, isOnline: true, lastMessage: 'Of course, Bob. What\'s your question?' },
  { id: 2, name: 'Alice', avatar: 'https://cdn3d.iconscout.com/3d/premium/thumb/woman-avatar-3d-icon-download-in-png-blend-fbx-gltf-file-formats--profile-character-pack-avatars-icons-5187873.png', isOnline: true, lastMessage: 'Hi Dr. Smith! I\'m doing well, thanks for asking.' },
  { id: 3, name: 'Bob', avatar: 'https://cdn3d.iconscout.com/3d/premium/thumb/woman-avatar-3d-icon-download-in-png-blend-fbx-gltf-file-formats--profile-character-pack-avatars-icons-5187873.png', isOnline: false, lastMessage: 'I have a question about the last assignment. Can we discuss it?' },
  { id: 4, name: 'Charlie', avatar: 'https://cdn3d.iconscout.com/3d/premium/thumb/woman-avatar-3d-icon-download-in-png-blend-fbx-gltf-file-formats--profile-character-pack-avatars-icons-5187873.png', isOnline: true, lastMessage: 'Thanks for the clarification!' },
  { id: 5, name: 'Diana', avatar: 'https://cdn3d.iconscout.com/3d/premium/thumb/woman-avatar-3d-icon-download-in-png-blend-fbx-gltf-file-formats--profile-character-pack-avatars-icons-5187873.png', isOnline: false, lastMessage: 'See you in class tomorrow.' },
]

export default function RedesignedStudentChat() {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [newMessage, setNewMessage] = useState('')
  const [selectedUser, setSelectedUser] = useState<User>(users[0])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (newMessage.trim()) {
      const message: Message = {
        id: messages.length + 1,
        sender: 'You',
        content: newMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
      setMessages([...messages, message])
      setNewMessage('')
    }
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <Header />
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search chats..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {users.map((user) => (
              <div
                key={user.id}
                className={`flex items-center p-3 cursor-pointer hover:bg-gray-50 ${
                  selectedUser.id === user.id ? 'bg-blue-50' : ''
                } ${user.isMentor ? 'sticky top-0 z-10 bg-green-50' : ''}`}
                onClick={() => setSelectedUser(user)}
              >
                <div className="relative flex-shrink-0">
                  <img src={`https://cdn3d.iconscout.com/3d/premium/thumb/woman-avatar-3d-icon-download-in-png-blend-fbx-gltf-file-formats--profile-character-pack-avatars-icons-5187873.png`} alt={user.name} className="w-12 h-12 rounded-full" />
                  <span
                    className={`absolute bottom-0 right-0 w-3 h-3 border-2 border-white rounded-full ${
                      user.isOnline ? 'bg-green-500' : 'bg-gray-400'
                    }`}
                  ></span>
                </div>
                <div className="ml-3 flex-1 overflow-hidden">
                  <div className="flex justify-between items-baseline">
                    <p className="font-semibold text-gray-800 truncate">{user.name}</p>
                    <p className="text-xs text-gray-500">12:34 PM</p>
                  </div>
                  <p className="text-sm text-gray-500 truncate">{user.lastMessage}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col bg-white">
          {/* Chat Header */}
          <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
            <div className="flex items-center">
              <img src={selectedUser.avatar} alt={selectedUser.name} className="w-10 h-10 rounded-full" />
              <div className="ml-3">
                <h2 className="text-lg font-semibold text-gray-800">{selectedUser.name}</h2>
                <p className="text-sm text-gray-500">{selectedUser.isMentor ? 'Mentor' : 'Student'}</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button className="p-2 text-gray-500 hover:text-gray-700 focus:outline-none" aria-label="Audio call">
                <Phone size={20} />
              </button>
              <button className="p-2 text-gray-500 hover:text-gray-700 focus:outline-none" aria-label="Video call">
                <Video size={20} />
              </button>
              <button className="p-2 text-gray-500 hover:text-gray-700 focus:outline-none" aria-label="More options">
                <MoreVertical size={20} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'You' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl rounded-lg p-3 ${
                    message.sender === 'You'
                      ? 'bg-blue-500 text-white'
                      : message.isMentor
                      ? 'bg-green-100 text-gray-800'
                      : 'bg-white text-gray-800 border border-gray-200'
                  }`}
                >
                  <p className="font-semibold">{message.sender}</p>
                  <p>{message.content}</p>
                  <p className="text-xs mt-1 opacity-75">{message.timestamp}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Message Input */}
          <form onSubmit={handleSendMessage} className="bg-white border-t border-gray-200 p-4 flex items-center space-x-2">
            <button type="button" className="text-gray-500 hover:text-gray-700 focus:outline-none" aria-label="Attach file">
              <Paperclip size={20} />
            </button>
            <button type="button" className="text-gray-500 hover:text-gray-700 focus:outline-none" aria-label="Attach image">
              <Image size={20} />
            </button>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white rounded-full p-2 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              aria-label="Send message"
            >
              <Send size={20} />
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}