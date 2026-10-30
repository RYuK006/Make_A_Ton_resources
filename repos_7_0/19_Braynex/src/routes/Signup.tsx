import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, X, ArrowRight, Loader } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

// Mock skills data
const skillsData = [
    { id: 1, name: 'JavaScript' },
    { id: 2, name: 'React' },
    { id: 3, name: 'Node.js' },
    { id: 4, name: 'Python' },
    { id: 5, name: 'Machine Learning' },
    { id: 6, name: 'Data Science' },
    { id: 7, name: 'UI/UX Design' },
    { id: 8, name: 'DevOps' },
]

const questions = [
    "What hobbies do you enjoy in your free time? (e.g., Reading, Gaming, Drawing)",
    "What subjects or activities make you feel the most accomplished?",
    "Do you prefer working in teams or alone?",
    "What is your preferred learning style? (Visual, Auditory, Hands-on)",
    "Do you like solving problems, managing tasks, or creating new things?",
    "What topics do you find yourself researching in your free time?",
    "If you could choose any career without limitations, what would it be?"
]

export default function SignupPage() {
    const [selectedSkills, setSelectedSkills] = useState<number[]>([])
    const [isSkillsOpen, setIsSkillsOpen] = useState(false)
    const [step, setStep] = useState(0)
    const [answers, setAnswers] = useState<string[]>(Array(questions.length).fill(''))
    const [loading, setLoading] = useState(false)
    const [mentorMatch, setMentorMatch] = useState<{ name: string; contact: string } | null>(null)
    const navigate = useNavigate()

    const toggleSkill = (id: number) => {
        setSelectedSkills(prev =>
            prev.includes(id) ? prev.filter(skillId => skillId !== id) : [...prev, id]
        )
    }

    const handleNext = () => {
        if (step === 0) {
            // Proceed to multi-step questions form
            setStep(1)
        } else if (step < questions.length) {
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
        newAnswers[step - 1] = e.target.value
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
                    {step === 0 && (
                        <motion.div
                            key="signupForm"
                            initial="initial"
                            animate="in"
                            exit="out"
                            variants={pageVariants}
                            transition={pageTransition}
                        >
                            <motion.h1
                                className="text-4xl font-bold mb-6 text-primary-blue text-center"
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                            >
                                Sign Up
                            </motion.h1>
                            <form className="space-y-6">
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.5, delay: 0.3 }}
                                >
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        required
                                        className="w-full px-4 py-2 rounded-md border border-gray-300 text-gray-900 placeholder-gray-45PrWcWBvSAXGj8bD2EAcwLJEf6Bkfw9Y1EknVsZCggqiNixWMwTX9HNJQ24FVfuLa4t8eXt1HPA1iUitADJLCoS5ua3WQR duration-200"
                                        placeholder="Enter your name"
                                    />
                                </motion.div>
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.5, delay: 0.4 }}
                                >
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        required
                                        className="w-full px-4 py-2 rounded-md border border-gray-300 text-gray-900 placeholder-gray-45PrWcWBvSAXGj8bD2EAcwLJEf6Bkfw9Y1EknVsZCggqiNixWMwTX9HNJQ24FVfuLa4t8eXt1HPA1iUitADJLCoS5ua3WQR duration-200"
                                        placeholder="Enter your email"
                                    />
                                </motion.div>
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.5, delay: 0.5 }}
                                >
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                    <input
                                        type="password"
                                        id="password"
                                        name="password"
                                        required
                                        className="w-full px-4 py-2 rounded-md border border-gray-300 text-gray-900 placeholder-gray-45PrWcWBvSAXGj8bD2EAcwLJEf6Bkfw9Y1EknVsZCggqiNixWMwTX9HNJQ24FVfuLa4t8eXt1HPA1iUitADJLCoS5ua3WQR duration-200"
                                        placeholder="Enter your password"
                                    />
                                </motion.div>
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.5, delay: 0.7 }}
                                    className="relative"
                                >
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Skills</label>
                                    <div
                                        className="w-full px-4 py-2 rounded-md border border-gray-300 text-gray-900 cursor-pointer flex items-center justify-between"
                                        onClick={() => setIsSkillsOpen(!isSkillsOpen)}
                                    >
                                        <span>{selectedSkills.length > 0 ? `${selectedSkills.length} selected` : 'Select your skills'}</span>
                                        <ChevronDown className={`transition-transform duration-200 ${isSkillsOpen ? 'transform rotate-180' : ''}`} />
                                    </div>
                                    <AnimatePresence>
                                        {isSkillsOpen && (
                                            <motion.ul
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                transition={{ duration: 0.2 }}
                                                className="z-50 mt-1 w-full bg-white border border-gray-300 rounded-md py-1 text-sm text-gray-700 shadow-lg max-h-60 overflow-auto"
                                            >
                                                {skillsData.map((skill) => (
                                                    <li
                                                        key={skill.id}
                                                        className={`px-4 py-2 cursor-pointer hover:bg-gray-100 transition-colors duration-150  ${selectedSkills.includes(skill.id) ? 'bg-primary-blue bg-opacity-10 text-primary-blue' : ''
                                                            }`}
                                                        onClick={() => toggleSkill(skill.id)}
                                                    >
                                                        {skill.name}
                                                    </li>
                                                ))}
                                            </motion.ul>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    <AnimatePresence>
                                        {selectedSkills.map(skillId => {
                                            const skill = skillsData.find(s => s.id === skillId)
                                            return skill ? (
                                                <motion.span
                                                    key={skill.id}
                                                    initial={{ opacity: 0, scale: 0.8 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    exit={{ opacity: 0, scale: 0.8 }}
                                                    transition={{ duration: 0.2 }}
                                                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-blue text-white"
                                                >
                                                    {skill.name}
                                                    <button
                                                        type="button"
                                                        onClick={() => toggleSkill(skill.id)}
                                                        className="ml-0.5 h-4 w-4 rounded-full inline-flex items-center justify-center hover:bg-white hover:bg-opacity-20 transition-colors duration-150"
                                                    >
                                                        <span className="sr-only">Remove {skill.name}</span>
                                                        <X className="h-3 w-3" aria-hidden="true" />
                                                    </button>
                                                </motion.span>
                                            ) : null
                                        })}
                                    </AnimatePresence>
                                </div>
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.5, delay: 0.6 }}
                                >
                                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        required
                                        className="w-full px-4 py-2 rounded-md border border-gray-300 text-gray-900 placeholder-gray-45PrWcWBvSAXGj8bD2EAcwLJEf6Bkfw9Y1EknVsZCggqiNixWMwTX9HNJQ24FVfuLa4t8eXt1HPA1iUitADJLCoS5ua3WQR duration-200"
                                        placeholder="Enter your phone number"
                                    />
                                </motion.div>
                            </form>
                            <motion.button
                                // type="submit"
                                onClick={handleNext}
                                className="w-full -z-10 flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-primary-green hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-green transition-colors duration-200"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.8 }}
                            >
                                Next <ArrowRight className="ml-2" />
                            </motion.button>
                        </motion.div>
                    )}

                    {step > 0 && step <= questions.length && !loading && !mentorMatch && (

                        <motion.div
                            key="questionsForm"
                            initial="initial"
                            animate="in"
                            exit="out"
                            variants={pageVariants}
                            transition={pageTransition}
                        >
                            <motion.h1
                                className="text-xl font-bold mb-4 text-primary-blue text-center"
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                            >
                                Question {step} of {questions.length}
                            </motion.h1>
                            <motion.p
                                className="mb-4 text-gray-700 text-center"
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.3 }}
                            >
                                {questions[step - 1]}
                            </motion.p>
                            <motion.input
                                type="text"
                                value={answers[step - 1]}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 rounded-md border border-gray-300 text-gray-900 placeholder-gray-45PrWcWBvSAXGj8bD2EAcwLJEf6Bkfw9Y1EknVsZCggqiNixWMwTX9HNJQ24FVfuLa4t8eXt1HPA1iUitADJLCoS5ua3WQR duration-200 mb-4"
                                placeholder="Type your answer..."
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5, delay: 0.4 }}
                            />
                            <motion.button
                                onClick={handleNext}
                                className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-primary-green hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-green transition-colors duration-200"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                {step === questions.length ? 'Finish' : 'Next'} <ArrowRight className="ml-2" />
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