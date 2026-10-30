"use client"

import React, { useState } from 'react'
import { CheckCircle, XCircle, ChevronRight, User, ClipboardList } from 'lucide-react'
import Header from '../components/Header'

interface Milestone {
  id: number
  description: string
  completed: boolean
  input: string
}

interface Task {
  id: number
  title: string
  description: string
  milestones: Milestone[]
  verified: boolean
}

const initialTasks: Task[] = [
  {
    id: 1,
    title: "Learn React Basics",
    description: "Master the fundamental concepts of React",
    milestones: [
      { id: 1, description: "Understand JSX", completed: false, input: "" },
      { id: 2, description: "Learn about components", completed: false, input: "" },
      { id: 3, description: "Understand state and props", completed: false, input: "" },
    ],
    verified: false,
  },
  {
    id: 2,
    title: "Build a Todo App",
    description: "Create a simple todo application using React",
    milestones: [
      { id: 1, description: "Set up project structure", completed: false, input: "" },
      { id: 2, description: "Implement todo list component", completed: false, input: "" },
      { id: 3, description: "Add functionality to create and delete todos", completed: false, input: "" },
    ],
    verified: false,
  },
]

export default function TaskPage() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)

  const handleMilestoneCompletion = (taskId: number, milestoneId: number) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId
          ? {
              ...task,
              milestones: task.milestones.map(milestone =>
                milestone.id === milestoneId
                  ? { ...milestone, completed: !milestone.completed }
                  : milestone
              ),
            }
          : task
      )
    )
  }

  const handleMilestoneInput = (taskId: number, milestoneId: number, input: string) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId
          ? {
              ...task,
              milestones: task.milestones.map(milestone =>
                milestone.id === milestoneId
                  ? { ...milestone, input }
                  : milestone
              ),
            }
          : task
      )
    )
  }

  const handleTaskVerification = (taskId: number) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId
          ? { ...task, verified: !task.verified }
          : task
      )
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
     <Header />
      <main className="max-w-4xl mx-auto mt-8 p-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Tasks</h2>
        <div className="space-y-6">
          {tasks.map(task => (
            <div key={task.id} className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">{task.title}</h3>
                  <p className="text-gray-600">{task.description}</p>
                </div>
                <button
                  onClick={() => handleTaskVerification(task.id)}
                  className={`px-4 py-2 rounded-full text-white font-semibold ${
                    task.verified
                      ? 'bg-[#58cc02] hover:bg-[#4caf00]'
                      : 'bg-gray-400 hover:bg-gray-500'
                  } transition-colors duration-200`}
                >
                  {task.verified ? 'Verified' : 'Verify'}
                </button>
              </div>
              <div className="space-y-4">
                {task.milestones.map(milestone => (
                  <div key={milestone.id} className="flex items-start space-x-4">
                    <button
                      onClick={() => handleMilestoneCompletion(task.id, milestone.id)}
                      className={`mt-1 ${
                        milestone.completed ? 'text-[#58cc02]' : 'text-gray-400'
                      }`}
                    >
                      {milestone.completed ? (
                        <CheckCircle className="h-6 w-6" />
                      ) : (
                        <XCircle className="h-6 w-6" />
                      )}
                    </button>
                    <div className="flex-grow">
                      <p className="text-gray-800 font-medium">{milestone.description}</p>
                      <input
                        type="text"
                        value={milestone.input}
                        onChange={(e) => handleMilestoneInput(task.id, milestone.id, e.target.value)}
                        placeholder="Enter your progress..."
                        className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1cb0f6]"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}