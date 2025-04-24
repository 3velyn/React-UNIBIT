import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import SignUpPage from './components/SignUpPage';
import LoginPage from './components/LoginPage';
import HeroSection from './components/HeroSection';
import Footer from './components/Footer';
import BlogSection from './components/BlogSection';
import CreatePostPage from './components/CreatePostPage';
import BlogDetail from './components/BlogDetail';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path='/signup' element={<SignUpPage />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/blog/:id' element={<BlogDetail />} />
          <Route path='/admin/create-post' element={<CreatePostPage/>} />
          <Route path="/" element={
            <>
              <HeroSection />
              <BlogSection />
            </>
          } />
        </Routes>
        <Footer />
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
