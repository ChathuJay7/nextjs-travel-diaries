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
    <div className='max-w-2xl mx-auto flex justify-end p-2 gap-4 items-center'>
        {isLoggedIn && (
            <>
                <span>
                    Hello, {session?.user?.name}
                </span>
                <Button className="border bg-white shadow-sm px-2 py-0" onClick={logout}>Logout <Logout /></Button>
            </>
        )}
        {!isLoggedIn && (
            <>
                <span>
                    Not logged in
                </span>
                <Button className="border bg-white shadow-sm px-2 py-0" onClick={login}>Login <Login /></Button>
            </>
        )}
    </div>
  )
}

export default Header