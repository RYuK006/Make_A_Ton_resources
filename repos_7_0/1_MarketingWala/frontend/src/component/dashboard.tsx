import { useState ,useEffect} from 'react'
import { Button } from "../components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu"
import { Input } from "../components/ui/input"
import { ChevronDown, Search, Bell, Settings, LogOut, Home, BarChart2, Users, FileText, HelpCircle, Menu, X} from 'lucide-react'

import { motion, AnimatePresence } from 'framer-motion'
import MarketingCampaignInputForm from './form'
import Generator from './generator'
import InstagramDashboard from './monitor'



export default function Dashboard() {
    const [searchQuery, setSearchQuery] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [activeComponent, setActiveComponent] = useState('Home');
  
    useEffect(() => {
      const handleResize = () => {
        setIsSidebarOpen(window.innerWidth >= 768);
      };
      window.addEventListener('resize', handleResize);
      handleResize();
  
      return () => window.removeEventListener('resize', handleResize);
    }, []);
  
    const sidebarVariants = {
      open: { x: 0 },
      closed: { x: '-100%' },
    };
  
    const popUpVariants = {
      hidden: { opacity: 0, scale: 0.8 },
      visible: {
        opacity: 1,
        scale: 1,
        transition: {
          type: 'spring',
          stiffness: 260,
          damping: 20,
          delay: 0.1,
        },
      },
    };

    const RenderMarketComponent = () => {
      switch (activeComponent) {
        case 'Home':
          return <div>
            <h2> Generate Instagram Posts</h2>
            <Generator/>
          </div>;
        case 'A/B':
          return <div>A/B Testing Component</div>;
        case 'Monitoring':
          return <div><InstagramDashboard/></div>;
        default:
          return null;
      }
    };
    return (
      <div className="flex h-screen bg-gray-100 overflow-hidden">
        {/* Sidebar Toggle Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden fixed top-4 left-4 z-50"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          <Menu className="h-6 w-6" />
        </Button>
  
        {/* Vertical Sidebar */}
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.aside
              className="w-64 bg-white shadow-md fixed inset-y-0 left-0 z-40 md:relative"
              initial="closed"
              animate="open"
              exit="closed"
              variants={sidebarVariants}
              transition={{ duration: 0.3 }}
            >
              <div className="p-4">
                <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
              </div>
              <nav className="mt-4">
                <a className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-200" onClick={() => setActiveComponent('Home')}>
                  <Home className="mr-3 h-5 w-5" />
                  Home
                </a>
                <a href="#" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-200" onClick={() => setActiveComponent('A/B')}>
                  <BarChart2 className="mr-3 h-5 w-5" />
                  A/B
                </a>
                <a href="#" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-200" onClick={() => setActiveComponent('Monitoring')}>
                  <FileText className="mr-3 h-5 w-5" />
                  Monitoring
                </a>
              </nav>
            </motion.aside>
          )}
        </AnimatePresence>
  
        {/* Main Content */}
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          {/* Top Navigation Bar */}
          <header className="bg-white shadow-sm">
            <div className="flex items-center justify-between px-6 py-3">
              <div className="flex items-center">
                <Input
                  type="search"
                  placeholder="Search..."
                  className="w-full md:w-64 mr-4"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex items-center">
                <Button variant="ghost" size="icon" className="mr-2">
                  <Bell className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="mr-4">
                  <Settings className="h-5 w-5" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center">
                      <img
                        src="/placeholder.jpg"
                        alt="Profile"
                        className="w-8 h-8 rounded-full mr-2"
                      />
                      <span className="mr-2 hidden md:inline">John Doe</span>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Profile</DropdownMenuItem>
                    <DropdownMenuItem>Edit Profile</DropdownMenuItem>
                    <DropdownMenuItem>Settings</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </header>
  
          {/* Dashboard Content */}
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 h-full">
            <div className="container mx-auto px-4 sm:px-6 py-8">
              <motion.h3
                className="text-gray-700 text-3xl font-medium mb-6"
                initial="hidden"
                animate="visible"
                variants={popUpVariants}
              >
                Dashboard
              </motion.h3>
              <div>
                  {/* Render Market Component Here */}
                  {RenderMarketComponent()}
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }
  