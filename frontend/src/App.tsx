import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { InvitationPage } from './pages/InvitationPage/InvitationPage'
import { AdminPage } from './pages/AdminPage/AdminPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/invitacion/familia-orduz" replace />} />
        <Route path="/invitacion/:slug" element={<InvitationPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="*" element={<Navigate to="/invitacion/familia-orduz" replace />} />
      </Routes>
    </BrowserRouter>
  )
}