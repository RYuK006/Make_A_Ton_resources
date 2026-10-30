import React, { useState } from 'react'
import { Plus, Edit, Trash, X, ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

type Skill = {
  id: number
  name: string
}

type Mentor = {
  id: number
  name: string
  email: string
  password: string
  skills: number[]
  maxStudents: number
}

type Career = {
  id: number
  name: string
}

type Subject = {
  id: number
  name: string
  career: number[]
}

type ModalType = 'create' | 'edit'

export default function AdminDashboard() {
  const [skills, setSkills] = useState<Skill[]>([])
  const [mentors, setMentors] = useState<Mentor[]>([])
  const [careers, setCareers] = useState<Career[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])

  const [activeTab, setActiveTab] = useState('skills')
  const [modalOpen, setModalOpen] = useState(false)
  const [modalType, setModalType] = useState<ModalType>('create')
  const [editingItem, setEditingItem] = useState<Skill | Mentor | Career | Subject | null>(null)

  const openModal = (type: ModalType, item?: Skill | Mentor | Career | Subject) => {
    setModalType(type)
    setEditingItem(item || null)
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setEditingItem(null)
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const newItem: any = {
      id: editingItem ? editingItem.id : Date.now(),
      name: formData.get('name') as string,
    }

    switch (activeTab) {
      case 'skills':
        if (modalType === 'create') {
          setSkills([...skills, newItem])
        } else {
          setSkills(skills.map(item => item.id === newItem.id ? newItem : item))
        }
        break
      case 'mentors':
        newItem.email = formData.get('email') as string
        newItem.password = formData.get('password') as string
        newItem.skills = formData.getAll('skills').map(Number)
        newItem.maxStudents = parseInt(formData.get('maxStudents') as string)
        if (modalType === 'create') {
          setMentors([...mentors, newItem])
        } else {
          setMentors(mentors.map(item => item.id === newItem.id ? newItem : item))
        }
        break
      case 'careers':
        if (modalType === 'create') {
          setCareers([...careers, newItem])
        } else {
          setCareers(careers.map(item => item.id === newItem.id ? newItem : item))
        }
        break
      case 'subjects':
        newItem.career = formData.getAll('career').map(Number)
        if (modalType === 'create') {
          setSubjects([...subjects, newItem])
        } else {
          setSubjects(subjects.map(item => item.id === newItem.id ? newItem : item))
        }
        break
    }

    closeModal()
  }

  const deleteItem = (id: number) => {
    switch (activeTab) {
      case 'skills':
        setSkills(skills.filter(item => item.id !== id))
        break
      case 'mentors':
        setMentors(mentors.filter(item => item.id !== id))
        break
      case 'careers':
        setCareers(careers.filter(item => item.id !== id))
        break
      case 'subjects':
        setSubjects(subjects.filter(item => item.id !== id))
        break
    }
  }

  const renderTable = () => {
    let items: any[]
    switch (activeTab) {
      case 'skills':
        items = skills
        break
      case 'mentors':
        items = mentors
        break
      case 'careers':
        items = careers
        break
      case 'subjects':
        items = subjects
        break
      default:
        items = []
    }

    return (
      <div className="overflow-x-auto">
        <motion.table 
          className="w-full bg-white rounded-lg shadow-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              {activeTab === 'mentors' && (
                <>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Skills</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Max Students</th>
                </>
              )}
              {activeTab === 'subjects' && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Career</th>
              )}
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            <AnimatePresence>
              {items.map((item) => (
                <motion.tr 
                  key={item.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.name}</td>
                  {activeTab === 'mentors' && (
                    <>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.skills.map((skillId:any) => skills.find(s => s.id === skillId)?.name).join(', ')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.maxStudents}</td>
                    </>
                  )}
                  {activeTab === 'subjects' && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.career.map((careerId:any) => careers.find(c => c.id === careerId)?.name).join(', ')}
                    </td>
                  )}
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => openModal('edit', item)}
                      className="text-primary-blue hover:text-blue-700 transition-colors duration-200 mr-2"
                    >
                      <Edit className="inline-block mr-1" /> Edit
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => deleteItem(item.id)}
                      className="text-primary-red hover:text-red-700 transition-colors duration-200"
                    >
                      <Trash className="inline-block mr-1" /> Delete
                    </motion.button>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </motion.table>
      </div>
    )
  }

  const renderForm = () => {
    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            required
            defaultValue={editingItem?.name || ''}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-blue focus:border-primary-blue transition duration-150 ease-in-out"
          />
        </div>
        {activeTab === 'mentors' && (
          <>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                required
                defaultValue={modalType === 'edit' && activeTab === 'mentors' && editingItem ? (editingItem as Mentor).email : ''}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-blue focus:border-primary-blue transition duration-150 ease-in-out"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                required={modalType === 'create'}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-blue focus:border-primary-blue transition duration-150 ease-in-out"
              />
            </div>
            <MultiSelect
              name="skills"
              label="Skills"
              options={skills}
              defaultValue={(editingItem as Mentor)?.skills || []}
            />
            <div>
              <label htmlFor="maxStudents" className="block text-sm font-medium text-gray-700">Max Students</label>
              <input
                type="number"
                id="maxStudents"
                name="maxStudents"
                required
                defaultValue={modalType === 'edit' && activeTab === 'mentors' && editingItem ? (editingItem as Mentor).maxStudents : ''}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-blue focus:border-primary-blue transition duration-150 ease-in-out"
              />
            </div>
          </>
        )}
        {activeTab === 'subjects' && (
          <MultiSelect
            name="career"
            label="Career"
            options={careers}
            defaultValue={(editingItem as Subject)?.career || []}
          />
        )}
        <div className="flex justify-end space-x-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={closeModal}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors duration-200"
          >
            Cancel
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="px-4 py-2 bg-primary-green text-white rounded-md hover:bg-green-600 transition-colors duration-200"
          >
            {modalType === 'create' ? 'Create' : 'Save'}
          </motion.button>
        </div>
      </form>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.h1 
          className="text-4xl font-bold text-center mb-12 text-primary-blue"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Admin Dashboard
        </motion.h1>
        <motion.div 
          className="bg-white rounded-lg shadow-lg p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex flex-wrap justify-center space-x-2 space-y-2 sm:space-y-0 mb-6">
            {['skills', 'mentors', 'careers', 'subjects'].map((tab) => (
              <motion.button
                key={tab}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-md font-medium transition-colors duration-200 ${
                  activeTab === tab
                    ? 'bg-primary-blue text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </motion.button>
            ))}
          </div>
          <div className="mb-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => openModal('create')}
              className="px-4 py-2 bg-primary-green text-white rounded-md hover:bg-green-600 transition-colors duration-200 flex items-center"
            >
              <Plus className="mr-2" /> Create New {activeTab.slice(0, -1)}
            </motion.button>
          </div>
          {renderTable()}
        </motion.div>
      </div>
      <AnimatePresence>
        {modalOpen && (
          <motion.div 
            className="fixed inset-0 bg-black bg-opacity-50  flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-white rounded-lg p-6 w-full max-w-md"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            >
              <h2 className="text-2xl font-bold mb-4">
                {modalType === 'create' ? 'Create' : 'Edit'} {activeTab.slice(0, -1)}
              </h2>
              {renderForm()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function MultiSelect({ name, label, options, defaultValue = [] }: { name: string; label: string; options: any[]; defaultValue?: number[] }) {
  const [selectedItems, setSelectedItems] = useState(defaultValue)
  const [isOpen, setIsOpen] = useState(false)

  const toggleItem = (id: number) => {
    setSelectedItems(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    )
  }

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div 
        className="mt-1 relative"
        onBlur={() => setTimeout(() => setIsOpen(false), 200)}
      >
        <div
          className="bg-white border border-gray-300 rounded-md shadow-sm px-4 py-2 flex items-center justify-between cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="block truncate">
            {selectedItems.length > 0
              ? `${selectedItems.length} selected`
              : 'Select items'}
          </span>
          <ChevronDown className={`ml-2 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`} />
        </div>
        <AnimatePresence>
          {isOpen && (
            <motion.ul
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm"
            >
              {options.length === 0 ? (
                <li className="text-gray-900 cursor-default select-none relative py-2 pl-3 pr-9">
                  No data available
                </li>
              ) : (
                options.map((option) => (
                  <li
                    key={option.id}
                    className={`${
                      selectedItems.includes(option.id) ? 'text-primary-blue bg-primary-blue bg-opacity-10' : 'text-gray-900'
                    } cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-gray-100 transition-colors duration-150`}
                    onClick={() => toggleItem(option.id)}
                  >
                    {option.name}
                  </li>
                ))
              )}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>
      <div className="mt-2 flex flex-wrap gap-2">
        <AnimatePresence>
          {selectedItems.map(id => {
            const item = options.find(option => option.id === id)
            return item ? (
              <motion.span
                key={id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
              >
                {item.name}
                <button
                  type="button"
                  onClick={() => toggleItem(id)}
                  className="ml-0.5 h-4 w-4 rounded-full inline-flex items-center justify-center text-blue-45PrWcWBvSAXGj8bD2EAcwLJEf6Bkfw9Y1EknVsZCggqiNixWMwTX9HNJQ24FVfuLa4t8eXt1HPA1iUitADJLCoS5ua3WQR transition-colors duration-150"
                >
                  <span className="sr-only">Remove {item.name}</span>
                  <X className="h-3 w-3" aria-hidden="true" />
                </button>
              </motion.span>
            ) : null
          })}
        </AnimatePresence>
      </div>
      {selectedItems.map(id => (
        <input key={id} type="hidden" name={name} value={id} />
      ))}
    </div>
  )
}