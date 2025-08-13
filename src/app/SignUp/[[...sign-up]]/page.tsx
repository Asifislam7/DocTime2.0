import { SignUpButton, SignedOut, SignedIn } from '@clerk/nextjs'
import React from 'react'

const Page = () => {
  return (
    <div className='flex justify-center items-center h-screen'>
      <SignedOut>
        <SignUpButton mode="modal">
          <button className="px-4 py-2 bg-blue-600 text-white rounded">
            Sign Up
          </button>
        </SignUpButton>
      </SignedOut>
      <SignedIn>
        <p className="text-lg">You are already signed in.</p>
      </SignedIn>
    </div>
  )
}

export default Page
