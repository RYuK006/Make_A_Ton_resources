import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Loader } from 'lucide-react'
// import { useRouter } from 'next/router'
import { useNavigate } from 'react-router-dom'

const questions = [
  "What hobbies do you enjoy in your free time? (e.g., Reading, Gaming, Drawing)",
  "What subjects or activities make you feel the most accomplished?",
  "Do you prefer working in teams or alone?",
  "What is your preferred learning style? (Visual, Auditory, Hands-on)",
  "Do you like solving problems, managing tasks, or creating new things?",
  "What topics do you find yourself researching in your free time?",
  "If you could choose any career without limitations, what would it be?"
]

export default function MultiStepSignup() {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<string[]>(Array(questions.length).fill(''))
  const [loading, setLoading] = useState(false)
  const [mentorMatch, setMentorMatch] = useState<{ name: string; contact: string } | null>(null)
  const navigate = useNavigate()

  const handleNext = () => {
    if (step < questions.length - 1) {
      setStep(step + 1)
    } else {
      setLoading(true)
      // Simulate API call for mentor matching
      setTimeout(() => {
        setLoading(false)
        setMentorMatch({ name: "John Doe", contact: "john.doe@example.com" })
      }, 3000)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAnswers = [...answers]
    newAnswers[step] = e.target.value
    setAnswers(newAnswers)
  }

  const goToDashboard = () => {
    navigate('/dashboard')
  }

  const pageVariants = {
    initial: { opacity: 0, x: -50 },
    in: { opacity: 1, x: 0 },
    out: { opacity: 0, x: 50 }
  }

  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.5
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <motion.div 
        className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <AnimatePresence mode='wait'>
          {step < questions.length && !loading && !mentorMatch && (
            <motion.div
              key={step}
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <h2 className="text-2xl font-bold mb-6 text-primary-blue">Question {step + 1}</h2>
              <p className="text-gray-700 mb-4">{questions[step]}</p>
              <input
                type="text"
                value={answers[step]}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-md border border-gray-300 text-gray-900 placeholder-gray-45PrWcWBvSAXGj8bD2EAcwLJEf6Bkfw9Y1EknVsZCggqiNixWMwTX9HNJQ24FVfuLa4t8eXt1HPA1iUitADJLCoS5ua3WQR duration-200 mb-4"
                placeholder="Your answer"
              />
              <motion.button
                onClick={handleNext}
                className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-primary-green hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-green transition-colors duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {step === questions.length - 1 ? 'Finish' : 'Next'} <ArrowRight className="ml-2" />
              </motion.button>
            </motion.div>
          )}

          {loading && (
            <motion.div
              key="loading"
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
              className="text-center"
            >
              <h2 className="text-2xl font-bold mb-6 text-primary-blue">Finding Your Perfect Mentor</h2>
              <Loader className="animate-spin h-16 w-16 text-primary-blue mx-auto" />
              <p className="mt-4 text-gray-700">Please wait while we match you with the best mentor...</p>
            </motion.div>
          )}

          {mentorMatch && (
            <motion.div
              key="result"
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
              className="text-center"
            >
              <h2 className="text-2xl font-bold mb-6 text-primary-blue">Your Mentor Match</h2>
              <div className="bg-primary-blue bg-opacity-10 rounded-lg p-6 mb-6">
                <p className="text-xl font-semibold text-primary-blue">{mentorMatch.name}</p>
                <p className="text-gray-700 mt-2">{mentorMatch.contact}</p>
              </div>
              <motion.button
                onClick={goToDashboard}
                className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-primary-green hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-green transition-colors duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Go to Dashboard <ArrowRight className="ml-2" />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}