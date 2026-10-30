"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import { Trophy, Award, Star, X } from 'lucide-react'

interface CelebrationProps {
  type: 'badge' | 'milestone'
  title: string
  message: string
  onClose: () => void
}

export default function Celebration({ type, title, message, onClose }: CelebrationProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    if (isVisible) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      })
    }
  }, [isVisible])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(onClose, 500) // Delay to allow exit animation to complete
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="bg-white rounded-lg p-8 max-w-md w-full mx-4 text-center relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleClose}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              aria-label="Close celebration"
            >
              <X size={24} />
            </button>
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-6"
            >
              {type === 'badge' ? (
                <Trophy className="w-24 h-24 mx-auto text-[#ffd700]" />
              ) : (
                <Star className="w-24 h-24 mx-auto text-[#1cb0f6]" />
              )}
            </motion.div>
            <motion.h2
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-3xl font-bold text-gray-800 mb-4"
            >
              {title}
            </motion.h2>
            <motion.p
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-xl text-gray-600 mb-8"
            >
              {message}
            </motion.p>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <button
                onClick={handleClose}
                className="bg-[#58cc02] hover:bg-[#4caf00] text-white font-bold py-3 px-6 rounded-full transition-colors duration-200"
              >
                Continue Learning
              </button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Example usage:
export function CelebrationExample() {
  const [showCelebration, setShowCelebration] = useState(false)

  return (
    <div className="p-4">
      <button
        onClick={() => setShowCelebration(true)}
        className="bg-[#1cb0f6] hover:bg-[#0c9fe6] text-white font-bold py-2 px-4 rounded"
      >
        Trigger Celebration
      </button>
      {showCelebration && (
        <Celebration
          type="badge"
          title="Congratulations!"
          message="You've earned the 'React Master' badge!"
          onClose={() => setShowCelebration(false)}
        />
      )}
    </div>
  )
}