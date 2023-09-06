import { signIn, signOut, useSession } from 'next-auth/react'
import React from 'react'
import Button from './Button'
import Logout from './icons/Logout'
import Login from './icons/Login'

const Header = () => {

    const { data: session } = useSession()
    const isLoggedIn = !!session?.user?.email

    const logout = () => {
        signOut()
    }

    const login = () => {
        signIn('google')
    }

  return (
    <div className='max-w-full mx-auto flex justify-between gap-4 items-center bg-gradient-to-r from-[#b3ffd9] to-[#23eb87] p-4'>
        {isLoggedIn && (
            <>
                <span>
                    Hello, {session?.user?.name}
                </span>
                <Button className="border bg-white shadow-sm px-2 py-0 " loginBtn onClick={logout}>Logout <Logout /></Button>
            </>
        )}
        {!isLoggedIn && (
            <>
                <span>
                    Not logged in
                </span>
                <Button className="border bg-white shadow-sm px-2 py-0 " loginBtn onClick={login}>Login <Login /></Button>
            </>
        )}
    </div>
  )
}

export default Header
