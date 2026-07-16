import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/common/Layout';
import WizardPage from './pages/WizardPage';
import HistoryPage from './pages/HistoryPage';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<WizardPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/history/:id" element={<div className="text-center py-12">History detail will go here</div>} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
