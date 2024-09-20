import { Route, Routes } from 'react-router-dom'
import MessagePage from './pages/messagePage/MessagePage'

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<MessagePage />} />
        <Route path="/MessagePage" element={<MessagePage />} />
      </Routes>
    </>
  )
}

export default App
