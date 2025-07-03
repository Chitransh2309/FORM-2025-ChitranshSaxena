import { handleSignOut } from '@/app/action/AuthActions'
import React from 'react'

export default function Profile({name,email}:{name:string,email:string}) {
  return (
    <div className="absolute right-0 mt-45 mr-8 w-auto bg-gray-300 dark:bg-[#353434] border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg p-4 z-50">
          <div className="flex items-center gap-3">
            <div>
              <h3 className="font-bold text-black dark:text-white">{name}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">{email}</p>
            </div>
          </div>
          <button
            onClick={() => { handleSignOut()
            }}
            className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#56A37D] hover:bg-[#4d8a6b] text-white rounded-lg shadow-md transition"
          >
            Sign out
          </button>
        </div>
  )
}
