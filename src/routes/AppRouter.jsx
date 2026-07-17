import { Route, Routes } from 'react-router-dom'
import ProtectedRoute from '../components/ProtectedRoute.jsx'
import AdminLayout from '../layouts/AdminLayout.jsx'
import MainLayout from '../layouts/MainLayout.jsx'
import Login from '../pages/admin/Login.jsx'
import ForgotPassword from '../pages/admin/ForgotPassword.jsx'
import Signup from '../pages/admin/Signup.jsx'
import Dashboard from '../pages/admin/Dashboard.jsx'
import AddEvent from '../pages/admin/AddEvent.jsx'
import BookingsManager from '../pages/admin/BookingsManager.jsx'
import AddStaff from '../pages/admin/AddStaff.jsx'
import GalleryManager from '../pages/admin/GalleryManager.jsx'
import Profile from '../pages/admin/Profile.jsx'
import Home from '../pages/Home.jsx'
import About from '../pages/About.jsx'
import Events from '../pages/Events.jsx'
import Services from '../pages/Services.jsx'
import Contact from '../pages/Contact.jsx'
import Faq from '../pages/Faq.jsx'
import PrivacyPolicy from '../pages/PrivacyPolicy.jsx'
import TermsAndConditions from '../pages/TermsAndConditions.jsx'

export default function AppRouter() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/events" element={<Events />} />
        <Route path="/services" element={<Services />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
      </Route>

      <Route path="/admin/login" element={<Login />} />
      <Route path="/admin/forgot-password" element={<ForgotPassword />} />
      <Route path="/admin/signup" element={<Signup />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/admin/dashboard" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="events" element={<AddEvent />} />
          <Route path="bookings" element={<BookingsManager />} />
          <Route path="staff" element={<AddStaff />} />
          <Route path="gallery" element={<GalleryManager />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Route>
    </Routes>
  )
}
