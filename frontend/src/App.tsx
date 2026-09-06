import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import { Dashboard } from './pages/Dashboard'
import { CreateJob } from './pages/CreateJob'
import { UpdateJob } from './pages/UpdateJob'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="create-job-application" element={<CreateJob />} />
        <Route path="edit-job-application/:id" element={<UpdateJob />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
