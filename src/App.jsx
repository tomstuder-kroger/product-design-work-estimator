import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">Story Points Calculator</h1>
              <nav className="flex gap-4">
                <Link to="/" className="text-blue-600 hover:text-blue-800">New Estimation</Link>
                <Link to="/history" className="text-blue-600 hover:text-blue-800">History</Link>
              </nav>
            </div>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<div>Wizard will go here</div>} />
            <Route path="/history" element={<div>History will go here</div>} />
            <Route path="/history/:id" element={<div>History detail will go here</div>} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
