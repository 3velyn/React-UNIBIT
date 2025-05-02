import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Navbar from "./components/Navbar";
import SignUpPage from "./components/SignUpPage";
import LoginPage from "./components/LoginPage";
import HeroSection from "./components/HeroSection";
import Footer from "./components/Footer";
import BlogSection from "./components/BlogSection";
import CreatePostPage from "./components/CreatePostPage";
import BlogDetail from "./components/BlogDetail";
import AdminPostPage from "./components/AdminPostsPage";
import EditPostForm from "./components/EditPostForm";
import AuthStateWrapper from "./components/common/AuthStateWrapper";
import {
  AdminRoute,
  ProtectedRoute,
  PublicOnlyRoute,
} from "./components/guards/ProtectedRoute";
import ProfilePage from "./components/ProfilePage";
import NotFoundPage from "./components/NotFoundPage";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AuthStateWrapper>
          <Navbar />
          <Routes>
            <Route path="/" element={
                <>
                  <HeroSection />
                  <BlogSection />
                </>
              }
            />
            <Route path="/blog/:id" element={<BlogDetail />} />

            <Route element={<PublicOnlyRoute />}>
              <Route path="/signup" element={<SignUpPage />} />
              <Route path="/login" element={<LoginPage />} />
            </Route>

            <Route element={<ProtectedRoute />}>
              <Route path="/profile" element={<ProfilePage />} />
            </Route>

            <Route element={<AdminRoute />}>
              <Route path="/admin/create-post" element={<CreatePostPage />} />
              <Route path="/admin/manage-posts" element={<AdminPostPage />} />
              <Route path="/admin/edit-post/:id" element={<EditPostForm />} />
            </Route>

            <Route path="*" element={<NotFoundPage />} />

          </Routes>
          <Footer />
        </AuthStateWrapper>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
