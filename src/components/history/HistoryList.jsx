import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEstimation } from '../../context/EstimationContext';
import { STAGE_OPTIONS } from '../../utils/constants';

export default function HistoryList() {
  const { history, loadEstimation, deleteEstimation } = useEstimation();
  const navigate = useNavigate();

  const [stageFilter, setStageFilter] = useState('All');
  const [pointsFilter, setPointsFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('date-desc');

  const filteredHistory = history.filter((est) => {
    // Stage filter
    if (stageFilter !== 'All' && est.stage !== stageFilter) return false;

    // Points filter
    if (pointsFilter !== 'All') {
      if (pointsFilter === '1-3' && (est.finalPoints < 1 || est.finalPoints > 3)) return false;
      if (pointsFilter === '5' && est.finalPoints !== 5) return false;
      if (pointsFilter === '8' && est.finalPoints !== 8) return false;
      if (pointsFilter === '13' && est.finalPoints !== 13) return false;
    }

    // Search filter
    if (searchQuery && !est.projectName.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    return true;
  }).sort((a, b) => {
    if (sortBy === 'date-desc') return new Date(b.timestamp) - new Date(a.timestamp);
    if (sortBy === 'date-asc') return new Date(a.timestamp) - new Date(b.timestamp);
    if (sortBy === 'points-high') return b.finalPoints - a.finalPoints;
    if (sortBy === 'points-low') return a.finalPoints - b.finalPoints;
    return 0;
  });

  const handleClone = (id) => {
    loadEstimation(id);
    navigate('/');
  };

  const handleDelete = (id, name) => {
    if (confirm(`Delete estimation "${name}"?`)) {
      deleteEstimation(id);
    }
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const getPointsColor = (points) => {
    if (points <= 3) return 'text-green-600 bg-green-50';
    if (points === 5) return 'text-yellow-600 bg-yellow-50';
    if (points === 8) return 'text-orange-600 bg-orange-50';
    return 'text-red-600 bg-red-50';
  };

  if (history.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📊</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">No estimations yet</h2>
        <p className="text-gray-600 mb-6">Create your first story point estimation to get started</p>
        <button
          onClick={() => navigate('/')}
          className="btn-primary"
        >
          Create First Estimation
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Estimation History</h1>
        <p className="text-gray-600 mt-1">{history.length} total estimations</p>
      </div>

      {/* Filters */}
      <div className="bg-white border rounded-lg p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Stage</label>
            <select
              value={stageFilter}
              onChange={(e) => setStageFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
            >
              <option value="All">All Stages</option>
              {STAGE_OPTIONS.map(stage => (
                <option key={stage} value={stage}>{stage}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Points</label>
            <select
              value={pointsFilter}
              onChange={(e) => setPointsFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
            >
              <option value="All">All Points</option>
              <option value="1-3">1-3 points</option>
              <option value="5">5 points</option>
              <option value="8">8 points</option>
              <option value="13">13 points</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
            >
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="points-high">Points (High to Low)</option>
              <option value="points-low">Points (Low to High)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        <div className="text-sm text-gray-600">
          Showing {filteredHistory.length} of {history.length} estimations
        </div>
      </div>

      {/* History Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredHistory.map((estimation) => (
          <div
            key={estimation.id}
            className="bg-white border rounded-lg p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-3">
              <span className={`px-2 py-1 text-xs font-medium rounded ${
                estimation.stage === 'Discovery' ? 'bg-discovery text-white' :
                estimation.stage === 'Define' ? 'bg-define text-white' :
                'bg-design text-white'
              }`}>
                {estimation.stage}
              </span>
              <div className={`text-3xl font-bold ${getPointsColor(estimation.finalPoints)}`}>
                {estimation.finalPoints}
              </div>
            </div>

            <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
              {estimation.projectName}
            </h3>

            <div className="text-sm text-gray-600 mb-4">
              {estimation.activities.length} activities
              {estimation.weeks && ` · ${estimation.weeks} weeks`}
            </div>

            <div className="text-xs text-gray-500 mb-4">
              {formatDate(estimation.timestamp)}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => navigate(`/history/${estimation.id}`)}
                className="flex-1 px-3 py-1.5 text-sm text-primary hover:text-primary-dark"
              >
                View
              </button>
              <button
                onClick={() => handleClone(estimation.id)}
                className="flex-1 px-3 py-1.5 text-sm bg-gray-50 text-gray-700 rounded hover:bg-gray-100"
              >
                Clone
              </button>
              <button
                onClick={() => handleDelete(estimation.id, estimation.projectName)}
                className="px-3 py-1.5 text-sm bg-red-50 text-red-700 rounded hover:bg-red-100"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
