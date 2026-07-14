import { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Header from './components/Header';
import ProtectedRoute from './routes/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import CategoryPage from './pages/CategoryPage';
import TransactionPage from './pages/TransactionPage';
import BudgetPage from './pages/BudgetPage';
import ProfilePage from './pages/ProfilePage';

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="*"
        element={
          <div className="shell">
            <Navbar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            {sidebarOpen && (
              <div
                className="sidebar-overlay visible"
                onClick={() => setSidebarOpen(false)}
              />
            )}
            <div className="main-area">
              <Header onMenuToggle={() => setSidebarOpen((o) => !o)} />
              <main>
                <Routes>
                  <Route element={<ProtectedRoute />}>
                    <Route path="/" element={<DashboardPage />} />
                    <Route path="/categories" element={<CategoryPage />} />
                    <Route path="/transactions" element={<TransactionPage />} />
                    <Route path="/budgets" element={<BudgetPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                  </Route>
                </Routes>
              </main>
            </div>
          </div>
        }
      />
    </Routes>
  );
}
