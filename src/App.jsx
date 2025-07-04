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
    <div className='flex flex-col items-center'>
      <div>
        <img src={buzzLogo} className="logo"/>
      </div>
      <h1 className="text-2xl font-bold">Buzz Studios Liability Waiver Generator</h1>
      <p className="m-2">
        Enter the details below to to digitally sign the liability waiver. 
      </p>
      <WaiverInput/>
      <AdminPage/>
    </div>
  )
}

export default App
