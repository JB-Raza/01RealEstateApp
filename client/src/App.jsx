import React from 'react'
import {Outlet} from 'react-router-dom'

function App() {
  return (
    <div>
      <Outlet />
      <h1 className="bg-green-400">hello</h1>      
    </div>
  )
}

export default App
