import { createBrowserRouter } from 'react-router-dom';
import { LandingLayout } from '@/layouts/LandingLayout';
import { LandingPage, ContactPage, FAQPage } from '@/pages/home';
import LoginPage from '@components/auth/LoginPage';
import SignupPage from '@components/auth/SignupPage';

const router = createBrowserRouter([
    {
        path: '/',
        element: <LandingLayout />,
        children: [
            { index: true, element: <LandingPage /> },
            { path: 'contact', element: <ContactPage /> },
            { path: 'faq', element: <FAQPage /> }
        ]
    },
    {
        path: '/login',
        element: <LoginPage />
    },
    {
        path: '/signup',
        element: <SignupPage />
    }
]); 

export default router;