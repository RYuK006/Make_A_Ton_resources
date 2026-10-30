"use client"

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, BookOpen, Users, TrendingUp, Award, ChevronRight, Menu, X } from 'lucide-react'

export default function EnhancedBraynexHome() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 font-sans overflow-hidden">
      {/* Header */}
      <motion.header 
        className="bg-white bg-opacity-90 backdrop-filter backdrop-blur-lg shadow-sm fixed w-full z-50"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <motion.div 
              className="flex items-center"
              whileHover={{ scale: 1.05 }}
            >
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
              <span className="text-2xl font-bold text-gray-900">Braynex</span>
            </motion.div>
            {/* <div className="hidden md:flex space-x-8">
              {['Features', 'Testimonials', 'About'].map((item) => (
                <motion.a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="text-gray-600 hover:text-gray-900"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {item}
                </motion.a>
              ))}
            </div> */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <a href="/signup" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300">
                Sign Up
              </a>
            </motion.div>
            <div className="md:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
        </nav>
        {/* Mobile menu */}
        {isMenuOpen && (
          <motion.div
            className="md:hidden bg-white"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {['Features', 'About'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </motion.header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="flex flex-col md:flex-row items-center justify-between"
            initial="initial"
            animate="animate"
            variants={{
              initial: { opacity: 0 },
              animate: { opacity: 1, transition: { staggerChildren: 0.2 } }
            }}
          >
            <motion.div className="md:w-1/2 mb-10 md:mb-0" variants={fadeIn}>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
                Unlock Your Potential with Braynex
              </h1>
              <p className="text-xl mb-8 text-gray-700">
                Experience adaptive learning tailored to your unique career goals.
              </p>
              <motion.a
                href="/signup"
                className="bg-blue-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-700 transition duration-300 inline-flex items-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Start Your Journey <ArrowRight className="ml-2" />
              </motion.a>
            </motion.div>
            <motion.div 
              className="md:w-1/2"
              variants={fadeIn}
            >
              <img src="/home.png" alt="Braynex Platform" className="rounded-lg shadow-2xl" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2 
            className="text-3xl font-bold text-center mb-12 text-gray-900"
            variants={fadeIn}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            Why Choose Braynex?
          </motion.h2>
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={{
              initial: { opacity: 0 },
              animate: { opacity: 1, transition: { staggerChildren: 0.2 } }
            }}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <FeatureCard
              icon={<BookOpen className="h-10 w-10 text-blue-600" />}
              title="Personalized Learning"
              description="Adaptive courses tailored to your unique career goals and learning style."
            />
            <FeatureCard
              icon={<Users className="h-10 w-10 text-blue-600" />}
              title="Expert Mentorship"
              description="Connect with industry professionals for guidance and support."
            />
            <FeatureCard
              icon={<TrendingUp className="h-10 w-10 text-blue-600" />}
              title="Skill Tracking"
              description="Monitor your progress and identify areas for improvement."
            />
            <FeatureCard
              icon={<Award className="h-10 w-10 text-blue-600" />}
              title="Industry-Recognized Certificates"
              description="Earn credentials that matter in your chosen field."
            />
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-gradient-to-br from-blue-100 to-indigo-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2 
            className="text-3xl font-bold text-center mb-12 text-gray-900"
            variants={fadeIn}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            What Our Users Say
          </motion.h2>
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={{
              initial: { opacity: 0 },
              animate: { opacity: 1, transition: { staggerChildren: 0.2 } }
            }}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <TestimonialCard
              quote="Braynex helped me transition into a new career in tech. The personalized learning path was a game-changer!"
              author="Sarah K., Software Developer"
            />
            <TestimonialCard
              quote="As a busy professional, I appreciate how Braynex adapts to my schedule. It's like having a personal tutor available 24/7."
              author="Michael R., Marketing Manager"
            />
            <TestimonialCard
              quote="The expert mentorship feature gave me invaluable insights into my industry. It's more than just an online course platform."
              author="Emily L., Data Scientist"
            />
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="flex flex-col md:flex-row items-center"
            variants={{
              initial: { opacity: 0 },
              animate: { opacity: 1, transition: { staggerChildren: 0.2 } }
            }}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <motion.div className="md:w-1/2 mb-10 md:mb-0" variants={fadeIn}>
              <img src="/home-2.png" alt="About Braynex" className="rounded-lg shadow-xl" />
            </motion.div>
            <motion.div className="md:w-1/2 md:pl-12" variants={fadeIn}>
              <h2 className="text-3xl font-bold mb-6 text-gray-900">Personalized Learning for Your Career Journey</h2>
              <p className="text-gray-700 mb-6">
                Braynex uses advanced AI algorithms to create a unique learning experience tailored to your goals, 
                skills, and learning style. Our platform adapts in real-time, ensuring you're always challenged 
                and engaged, no matter where you are in your career journey.
              </p>
              <ul className="space-y-4">
                <ListItem text="Adaptive learning paths that evolve with you"/>
                <ListItem text="Real-world projects and case studies" />
                <ListItem text="Continuous feedback and skill assessment" />
                <ListItem text="Flexible learning schedule to fit your lifestyle" />
              </ul>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-20">
        <motion.div 
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
          variants={fadeIn}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Career?</h2>
          <p className="text-xl mb-8">Join Braynex today and start your personalized learning journey.</p>
          <motion.a 
            href="/signup" 
            className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition duration-300 inline-flex items-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Get Started Now <ArrowRight className="ml-2" />
          </motion.a>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Braynex</h3>
              <p className="text-gray-400">Empowering careers through personalized learning.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition duration-300">Home</a></li>
                <li><a href="#features" className="text-gray-400 hover:text-white transition duration-300">Features</a></li>
                <li><a href="#testimonials" className="text-gray-400 hover:text-white transition duration-300">Testimonials</a></li>
                <li><a href="#about" className="text-gray-400 hover:text-white transition duration-300">About</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition duration-300">FAQ</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition duration-300">Contact Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition duration-300">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition duration-300">Terms of Service</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Connect</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition duration-300">Twitter</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition duration-300">LinkedIn</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition duration-300">Facebook</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition duration-300">Instagram</a></li>
              </ul>
            </div>
          
          </div>
          <div className="mt-12 border-t border-gray-700 pt-8 text-center">
            <p className="text-gray-400">&copy; 2024 Braynex. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }:any) {
  return (
    <motion.div 
      className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
      // variants={fadeIn}
      whileHover={{ y: -5 }}
    >
      <motion.div 
        className="mb-4"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 260, damping: 20 }}
      >
        {icon}
      </motion.div>
      <h3 className="text-xl font-semibold mb-2 text-gray-900">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </motion.div>
  )
}

function TestimonialCard({ quote, author }:any) {
  return (
    <motion.div 
      className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
      // variants={fadeIn}
      whileHover={{ y: -5 }}
    >
      <p className="text-gray-600 mb-4 italic">"{quote}"</p>
      <p className="font-semibold text-gray-800">- {author}</p>
    </motion.div>
  )
}

function ListItem({ text }:any) {
  return (
    <motion.li 
      className="flex items-center"
      // variants={fadeIn}
      whileHover={{ x: 5 }}
    >
      <ChevronRight className="h-5 w-5 text-blue-600 mr-2" />
      <span className="text-gray-700">{text}</span>
    </motion.li>
  )
}