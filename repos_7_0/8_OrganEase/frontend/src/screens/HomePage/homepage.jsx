import React, { useState } from 'react';
import { Calendar, MessageSquare, Package, Menu, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

const EventManagementApp = () => {
  const [events, setEvents] = useState([
    {
      id: 1,
      name: "Tech Conference 2024",
      role: "Organizer",
      endDate: "2024-12-15"
    },
    {
      id: 2,
      name: "Music Festival",
      role: "Volunteer",
      endDate: "2024-11-30"
    },
    {
      id: 3,
      name: "Charity Gala",
      role: "Coordinator",
      endDate: "2024-10-25"
    }
  ]);

  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="h-screen w-full bg-gray-50">
      {/* Top Navigation */}
      <div className="flex items-center justify-between p-4 bg-white shadow-sm">
        <div className="flex-1">
          <button className="p-2" onClick={() => setSidebarOpen(!isSidebarOpen)}>
            <Menu className="h-6 w-6" />
          </button>
        </div>
        
        {/* App Name in Center */}
        <div className="flex-1 text-center">
          <h1 className="font-bold text-xl text-blue-600">OrganEase</h1>
        </div>

        {/* Date on Right */}
        <div className="flex-1 text-right">
          <span className="text-sm text-gray-600">{currentDate}</span>
        </div>
      </div>

      {/* Sidebar */}
      {isSidebarOpen && (
        <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg">
          <ul className="p-4 space-y-2">
            <li>
              <Link to="/messaging" className="flex items-center space-x-2">
                <MessageSquare className="h-5 w-5" />
                <span>Messaging</span>
              </Link>
            </li>
            <li>
              <Link to="/opinion" className="flex items-center space-x-2">
                <Package className="h-5 w-5" />
                <span>Marketplace</span>
              </Link>
            </li>
          </ul>
        </div>
      )}

      {/* Main Content */}
      <div className="p-4 space-y-4">
        {/* Create New Event Button */}
        <Link 
          to="/eventcreate"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 flex items-center justify-center"
        >
          <Plus className="mr-2 h-5 w-5" />
          Create New Event
        </Link>

        {/* Events List */}
        <div className="space-y-3">
          {events.map((event) => (
            <div key={event.id} className="w-full bg-white p-4 shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-lg">{event.name}</h3>
                  <p className="text-sm text-gray-500">Role: {event.role}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-500">
                    {new Date(event.endDate).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EventManagementApp;
