import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import SignUpPage from './components/SignUpPage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path='/signup' element={<SignUpPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
