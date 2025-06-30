'use client'
import { useEffect, useState} from 'react'
import { Sun, Moon } from 'lucide-react'


const ToggleSwitch = () => {
  const [enabled, setEnabled] = useState(true)

  useEffect(() => {
    // Check saved theme on initial mount
    const storedTheme = localStorage.getItem('theme')
    if (storedTheme === 'dark') {
      document.documentElement.classList.add('dark')
      setEnabled(false)
    } else {
      document.documentElement.classList.remove('dark')
      setEnabled(true)
    }
  }, [])

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'theme') {
        const newTheme = e.newValue
        if (newTheme === 'dark') {
          document.documentElement.classList.add('dark')
          setEnabled(false)
        } else {
          document.documentElement.classList.remove('dark')
          setEnabled(true)
        }
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])
  
  const toggleTheme = () => {
    const newEnabled = !enabled
    setEnabled(newEnabled)

    if (newEnabled) {
      // Light mode
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    } else {
      // Dark mode
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    }
  }

  return (
    <button
      onClick={toggleTheme}
      className={`relative w-12 h-6 flex items-center rounded-full transition-colors duration-300 ${
        enabled ? 'bg-yellow-400' : 'bg-gray-600'
      }`}
    >
      <div
        className={`absolute left-1 top-1 w-4 h-4 rounded-full bg-white shadow-md transform transition-transform duration-300 ${
          enabled ? 'translate-x-6' : ''
        }`}
      />
      <div className="flex justify-between w-full px-1 z-10">
        <Sun
          className={`w-4 h-4 text-white transition-opacity duration-300 ${
            enabled ? 'opacity-100' : 'opacity-50'
          }`}
        />
        <Moon
          className={` dark w-4 h-4 text-white transition-opacity duration-300 ${
            enabled ? 'opacity-50' : 'opacity-100'
          }`}
        />
      </div>
    </button>
  )
}

export default ToggleSwitch
