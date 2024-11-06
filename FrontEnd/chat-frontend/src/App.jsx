import {Routes, Route} from 'react-router-dom'
import Home from './components/Home'
import Login from './components/Login'
import Chat from './components/Chat'
import Register from './components/Register'

function App() {
  
  return (
    <>
      <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="login" element={<Login/>}/>
          <Route path="chat" element={<Chat/>}/>
          <Route path="register" element={<Register/>}/>
      </Routes>
    </>
  )
}

export default App
