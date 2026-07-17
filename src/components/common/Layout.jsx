import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEstimation } from '../../context/EstimationContext';

const krogerLogo = '/kroger-logo.svg';

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
      <header className="bg-primary sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img src={krogerLogo} alt="Kroger" className="h-[33px] w-[60px] object-contain" />
              <h1 className="text-xl font-bold text-white">
                Story Points Calculator
              </h1>
            </div>
            <nav className="flex gap-6">
              <button
                onClick={handleNewEstimation}
                className={`transition-colors ${
                  isActive('/')
                    ? 'font-bold text-white'
                    : 'text-white hover:opacity-80'
                }`}
              >
                New Estimation
              </button>
              <Link
                to="/history"
                className={`transition-colors ${
                  isActive('/history')
                    ? 'font-bold text-white'
                    : 'text-white hover:opacity-80'
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
