'use client'
import { useState } from 'react'
import { Sun, Moon } from 'lucide-react'

const ToggleSwitch = () => {
  const [enabled, setEnabled] = useState(true)

  const toggleTheme = () => {
    const newEnabled = !enabled
    setEnabled(newEnabled)

    if (newEnabled) {
      document.documentElement.classList.remove('dark')
    } else {
      document.documentElement.classList.add('dark')
    }
    
  }

  return (
    <button
      onClick={toggleTheme}
      className={`relative w-14 h-8 flex items-center justify-between px-1 rounded-full transition-colors duration-300 ${
        enabled ? 'bg-yellow-400' : 'bg-gray-600'
      }`}
    >
      <div
        className={`absolute w-6 h-6 rounded-full bg-white shadow-md transform transition-transform duration-300 ${
          enabled ? 'translate-x-6' : 'translate-x-0'
        }`}
        style={{ top: '4px', left: '4px' }}
      />
      <Sun
        className={`w-4 h-4 text-white z-10 transition-opacity duration-300 ${
          enabled ? 'opacity-100' : 'opacity-50'
        }`}
      />
      <Moon
        className={`w-4 h-4 text-white z-10 transition-opacity duration-300 ${
          enabled ? 'opacity-50' : 'opacity-100'
        }`}
      />
    </button>
  )
}

export default ToggleSwitch
