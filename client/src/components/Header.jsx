import React from 'react'
import { FaSearch } from "react-icons/fa"
import { NavLink } from 'react-router-dom'

function Header() {
    return (
        <header className='bg-slate-200 p-2 min-w-screen shadow-sm'>
            <div className='flex justify-between items-center p-2 '>
                {/* title */}
                <NavLink to='/'>
                    <h1 className="title text-sm sm:text-lg md:text-xl font-bold">
                        <span className='text-slate-500'>Real</span>
                        <span className='text-slate-700'>Estate</span>
                    </h1>
                </NavLink>

                {/* search bar */}
                <form>
                    <div className="shadow-md search-bar bg-slate-100 rounded-md flex items-center px-3 py-2 w-28 sm:w-64 md:w-80">
                        <input type="text" name="search" id="search" placeholder='Search...'
                            className='bg-transparent outline-none w-full text-sm sm:text-base'
                        />
                        <FaSearch className='text-slate-500' />
                    </div>
                </form>

                {/* nav items */}
                <nav>
                    <ul className='flex gap-3 px-2 font-semibold text-slate-700'>
                        <NavLink to='/'>
                            <li className='nav-link'>Home</li>
                        </NavLink>
                        <NavLink to='/about'>
                            <li className='nav-link'>About</li>
                        </NavLink>
                        <NavLink to='/sign-in'>
                            <li className='nav-link'>Sign-in</li>
                        </NavLink>
                    </ul>
                </nav>
            </div>
        </header>
    )
}

export default Header