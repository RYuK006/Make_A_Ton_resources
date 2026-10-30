import React, { useState } from 'react';
import { Users, Send, PlusCircle, CheckCircle, Calendar } from 'lucide-react';

const EventOrganizerGroup = () => {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'Alice', content: 'Hey everyone!', time: '10:00 AM', role: 'Coordinator' },
    { id: 2, sender: 'Bob', content: "Hi Alice, what's the first task?", time: '10:02 AM', role: 'Decorations Team' },
    { id: 3, sender: 'Charlie', content: "I've started on the guest list.", time: '10:05 AM', role: 'Invitations Team' }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [userRole, setUserRole] = useState('Team Member');
  const [members, setMembers] = useState(['Alice', 'Bob', 'Charlie']);
  const [tasks, setTasks] = useState([
    { id: 1, description: 'Book venue', assignee: 'Alice', completed: false, completionDate: null },
    { id: 2, description: 'Create guest list', assignee: 'Bob', completed: true, completionDate: '2024-10-25' }
  ]);
  const [showAddMember, setShowAddMember] = useState(false);
  const [newMember, setNewMember] = useState('');
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTask, setNewTask] = useState({ description: '', assignee: '', completionDate: '' });

  const roles = ['Coordinator', 'Decorations Team', 'Invitations Team', 'Catering Team', 'Team Member'];

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;
    const newMsg = {
      id: messages.length + 1,
      sender: 'You',
      content: newMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      role: userRole
    };
    setMessages([...messages, newMsg]);
    setNewMessage('');
  };

  const handleAddMember = (e) => {
    e.preventDefault();
    if (newMember.trim() === '') return;
    setMembers([...members, newMember]);
    setNewMember('');
    setShowAddMember(false);
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    if (newTask.description.trim() === '' || newTask.assignee.trim() === '') return;
    setTasks([...tasks, { ...newTask, id: tasks.length + 1, completed: false, completionDate: null }]);
    setNewTask({ description: '', assignee: '', completionDate: '' });
    setShowAddTask(false);
  };

  const toggleTaskCompletion = (taskId) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { 
        ...task, 
        completed: !task.completed, 
        completionDate: task.completed ? null : new Date().toISOString().split('T')[0] 
      } : task
    ));
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto border border-gray-300 rounded-lg overflow-hidden bg-white text-black">
      <div className="bg-gray-800 text-white p-4 flex items-center justify-between">
        <div className="flex items-center">
          <Users className="mr-2" />
          <h1 className="font-bold">Event Organizer Group</h1>
        </div>
        <button onClick={() => setShowAddMember(!showAddMember)} className="text-blue-300 hover:text-blue-100">
          <PlusCircle size={24} />
        </button>
      </div>
      
      {showAddMember && (
        <form onSubmit={handleAddMember} className="bg-gray-100 p-2 flex">
          <input
            type="text"
            value={newMember}
            onChange={(e) => setNewMember(e.target.value)}
            placeholder="New member name"
            className="flex-grow border border-gray-300 rounded px-2 py-1 mr-2"
          />
          <button type="submit" className="bg-blue-500 text-white rounded px-4 py-1">Add</button>
        </form>
      )}

      <div className="flex-grow flex flex-col">
        <div className="p-4 bg-gray-100 border-b border-gray-300">
          <h2 className="font-bold mb-2">Tasks:</h2>
          {tasks.map((task) => (
            <div key={task.id} className="flex items-center mb-2">
              <CheckCircle
                className={`mr-2 cursor-pointer ${task.completed ? 'text-green-500' : 'text-gray-400'}`}
                onClick={() => toggleTaskCompletion(task.id)}
              />
              <span className={task.completed ? 'line-through' : ''}>
                {task.description} (Assigned to: {task.assignee})
                {task.completed && task.completionDate && 
                  <span className="ml-2 text-sm text-gray-500">
                    <Calendar size={12} className="inline mr-1" />
                    Completed: {formatDate(task.completionDate)}
                  </span>
                }
              </span>
            </div>
          ))}
          <button onClick={() => setShowAddTask(!showAddTask)} className="text-blue-500 hover:text-blue-700">
            + Add New Task
          </button>
          
          {showAddTask && (
            <form onSubmit={handleAddTask} className="mt-2">
              <input
                type="text"
                value={newTask.description}
                onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                placeholder="Task description"
                className="w-full border border-gray-300 rounded px-2 py-1 mb-2"
              />
              <select
                value={newTask.assignee}
                onChange={(e) => setNewTask({...newTask, assignee: e.target.value})}
                className="w-full border border-gray-300 rounded px-2 py-1 mb-2"
              >
                <option value="">Assign to...</option>
                {members.map((member, index) => (
                  <option key={index} value={member}>{member}</option>
                ))}
              </select>
              <input
                type="date"
                value={newTask.completionDate}
                onChange={(e) => setNewTask({...newTask, completionDate: e.target.value})}
                className="w-full border border-gray-300 rounded px-2 py-1 mb-2"
              />
              <button type="submit" className="bg-blue-500 text-white rounded px-4 py-1">Add Task</button>
            </form>
          )}
        </div>

        <div className="flex-grow overflow-y-auto p-4">
          <h2 className="font-bold mb-2">Messages:</h2>
          {messages.map((message) => (
            <div key={message.id} className={`mb-4 ${message.sender === 'You' ? 'text-right' : ''}`}>
              <div className={`inline-block p-2 rounded-lg ${message.sender === 'You' ? 'bg-blue-100' : 'bg-gray-200'}`}>
                <p className="font-bold text-sm">
                  {message.sender}
                  <span className={`ml-2 text-xs px-1 py-0.5 rounded ${
                    message.role === 'Coordinator' ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'
                  }`}>
                    {message.role}
                  </span>
                </p>
                <p>{message.content}</p>
                <p className="text-xs text-gray-500">{message.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <form onSubmit={handleSendMessage} className="bg-white p-4 flex flex-col border-t border-gray-300">
        <div className="flex mb-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message"
            className="flex-grow border border-gray-300 rounded-full px-4 py-2 mr-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button type="submit" className="bg-blue-500 text-white rounded-full p-2 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <Send size={24} />
          </button>
        </div>
        <select
          value={userRole}
          onChange={(e) => setUserRole(e.target.value)}
          className="w-full border border-gray-300 rounded px-2 py-1"
        >
          {roles.map((role, index) => (
            <option key={index} value={role}>{role}</option>
          ))}
        </select>
      </form>
    </div>
  );
};

export default EventOrganizerGroup;