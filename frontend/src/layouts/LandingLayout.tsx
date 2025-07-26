import { Outlet } from 'react-router-dom';
import { Navbar } from '@/components/ui/LandingPage/Navbar';
import { Footer } from '@/components/ui/footer';

export const LandingLayout = () => {
  return (
    <div className="landing-layout flex flex-col justify-between min-h-screen">
      {/* <Navbar /> */}
      <div className="content flex-1 flex flex-col">
        <Outlet />
      </div>
      <footer>
        <Footer />
      </footer>
    </div>
  )
}