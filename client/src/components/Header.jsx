import { FaSearch } from "react-icons/fa"
import { Link, NavLink, useNavigate } from 'react-router-dom'
import {useSelector, useDispatch} from 'react-redux'
import {toggleTheme} from '../redux/themeSlice.js'
import { useState } from "react"


function Header() {
    const [searchTerm, setSearchTerm] = useState("")
    const currUser = useSelector((state) => state.user.currentUser)
    const currTheme = useSelector((state) => state.theme)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleSearchSubmit = async (e) => {
        e.preventDefault()
        if(searchTerm.length === 0) return
        const res = await fetch(`/api/listings/search?searchTerm=${searchTerm}`)
        const data = await res.json()

        if(data.success){
            navigate(`/search?${searchTerm}`, {state: {listings: data.listings}})
        }
        
    }


    return (
        <header className='bg-white p-2 w-full min-w-screen shadow-slate-300 shadow-md dark:bg-slate-800 dark:shadow-slate-700'>
            <div className='flex justify-between items-center p-2 '>
                {/* title */}
                <NavLink to='/'>
                    <h1 className="title text-sm sm:text-lg md:text-xl font-bold">
                        <span className='text-slate-500 dark:text-slate-400'>Real</span>
                        <span className='text-slate-700 dark:text-slate-100'>Estate</span>
                    </h1>
                </NavLink>

                {/* search bar */}
                <form
                onSubmit={handleSearchSubmit}>
                    <div className="shadow-slate-300 shadow-md bg-slate-100 dark:shadow-none dark:bg-slate-700 rounded-md flex items-center px-3 py-2 sm:w-64 md:w-80">
                        <input type="text" name="search" placeholder='Search...' value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                            className='bg-transparent outline-none w-full text-sm sm:text-base font-semibold text-slate-600 dark:text-slate-200'
                        />
                        <button><FaSearch className='text-slate-500' /></button>
                    </div>
                </form>

                {/* nav items */}
                <nav>
                    <ul className='flex gap-3 px-2 font-semibold text-slate-700 dark:text-slate-400 items-center'>
                        <NavLink to='/'>
                            <li className='nav-link hidden sm:inline'>Home</li>
                        </NavLink>
                        <NavLink to='/about'>
                            <li className='nav-link hidden sm:inline'>About</li>
                        </NavLink>

                        {currUser && currUser.avatar ? (
                            <Link to="/profile">
                                <img src={currUser.avatar}
                                    className="rounded-full w-10 h-10 object-cover"
                                />
                            </Link>
                        ) : (
                            <NavLink to='/signin'>
                                <li className='nav-link'>Sign-in</li>
                            </NavLink>
                        )}
                        {/* dark theme toggle button */}
                        <button
                            onClick={() => dispatch(toggleTheme())}
                            className="p-2 rounded-md bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600"
                        >
                            {currTheme =="light" ? "🌙" : "☀️"}
                        </button>

                    </ul>
                </nav>
            </div>
        </header>
    )
}

export default Header
