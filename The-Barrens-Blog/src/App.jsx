import './App.css'
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
