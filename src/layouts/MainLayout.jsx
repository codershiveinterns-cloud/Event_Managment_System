import { Outlet } from 'react-router-dom'
import Header from '../components/Header.jsx'
import Footer from '../components/Footer.jsx'

export default function MainLayout() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-zinc-950 text-zinc-100">
      <Header />
      <main className="min-w-0 pt-[4.6rem]">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
