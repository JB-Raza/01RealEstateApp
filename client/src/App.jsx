import { Header } from "./components/index.js"
import { Outlet } from 'react-router-dom'

function App() {

  return (
    <div>
      <Header />
      <Outlet />
    </div>
  )
}

export default App