import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { EstimationContextTest } from './components/EstimationContextTest';
import Layout from './components/common/Layout';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<EstimationContextTest />} />
          <Route path="/history" element={<div className="text-center py-12">History will go here</div>} />
          <Route path="/history/:id" element={<div className="text-center py-12">History detail will go here</div>} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
