import { Header } from "./components/index.js"
import { Outlet } from 'react-router-dom'
import {useSelector} from 'react-redux'
function App() {
  const currTheme = useSelector(state => state.theme)

  return (

    <div className={`${currTheme} bg-slate-100 dark:bg-slate-900 min-w-screen min-h-screen overflow-hidden`}>
      <Header />
      <Outlet />
    </div>
  )
}

export default App