import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import buzzLogo from '/default-img.png'
import './App.css'
import WaiverInput from './components/WaiverInput'
import AdminPage from './components/AdminPage'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <img src={buzzLogo} className="logo" alt="Vite logo" />
      </div>
      <h1>Buzz Studios Liability Waiver Generator</h1>
      <p>
        Enter your name, GTID, and check the box to digitally sign the liability waiver. 
      </p>
      <WaiverInput/>
      <AdminPage/>
    </>
  )
}

export default App
