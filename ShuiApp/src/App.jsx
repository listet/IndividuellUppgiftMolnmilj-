import { Route, Routes } from 'react-router-dom'
import MessagePage from './pages/messagePage/MessagePage'
import WritePage from './pages/writePage/WritePage'

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<MessagePage />} />
        <Route path="/MessagePage" element={<MessagePage />} />
        <Route path="/WritePage" element={<WritePage />} />
      </Routes>
    </>
  )
}

export default App
