import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEstimation } from '../../context/EstimationContext';

export default function Layout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { resetWizard } = useEstimation();

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path === '/history' && location.pathname.startsWith('/history')) return true;
    return false;
  };

  const handleNewEstimation = () => {
    resetWizard();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">
              Story Points Calculator
            </h1>
            <nav className="flex gap-6">
              <button
                onClick={handleNewEstimation}
                className={`font-medium transition-colors ${
                  isActive('/')
                    ? 'text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                New Estimation
              </button>
              <Link
                to="/history"
                className={`font-medium transition-colors ${
                  isActive('/history')
                    ? 'text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                History
              </Link>
            </nav>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
