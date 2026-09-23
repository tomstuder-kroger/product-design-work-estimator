import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEstimation } from '../../context/EstimationContext';

export default function HistoryDetail({ estimation }) {
  const { loadEstimation, deleteEstimation } = useEstimation();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(estimation.calculationBreakdown);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleClone = () => {
    loadEstimation(estimation.id);
    navigate('/');
  };

  const handleDelete = () => {
    if (confirm(`Delete estimation "${estimation.projectName}"?`)) {
      deleteEstimation(estimation.id);
      navigate('/history');
    }
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  const getPointsColor = (points) => {
    if (points <= 3) return 'text-green-600 bg-green-50';
    if (points === 5) return 'text-yellow-600 bg-yellow-50';
    if (points === 8) return 'text-orange-600 bg-orange-50';
    return 'text-red-600 bg-red-50';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <button
          onClick={() => navigate('/history')}
          className="text-primary hover:text-primary-dark"
        >
          History
        </button>
        <span className="text-gray-400">/</span>
        <span className="text-gray-900 font-medium truncate">{estimation.projectName}</span>
      </div>

      {/* Actions Bar */}
      <div className="flex justify-between items-center">
        <button
          onClick={() => navigate('/history')}
          className="text-gray-600 hover:text-gray-900 flex items-center gap-1"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to History
        </button>

        <div className="flex gap-2">
          <button onClick={handleCopy} className="btn-secondary text-sm">
            {copied ? 'Copied!' : 'Copy Report'}
          </button>
          <button onClick={handleClone} className="btn-secondary text-sm">
            Clone
          </button>
          <button onClick={handleDelete} className="btn-destructive text-sm">
            Delete
          </button>
        </div>
      </div>

      {/* Story Points Header */}
      <div className={`rounded-lg p-8 text-center ${getPointsColor(estimation.finalPoints)}`}>
        <div className="text-7xl font-bold mb-2">
          {estimation.finalPoints}
        </div>
        <div className="text-xl font-medium">Story Points</div>
        {estimation.isOverridden && estimation.calculatedPoints !== estimation.finalPoints && (
          <div className="text-sm mt-2 opacity-75">
            Calculated: {estimation.calculatedPoints} → Adjusted to: {estimation.finalPoints}
          </div>
        )}
        <div className="text-xs mt-3 opacity-75">
          Created {formatDate(estimation.timestamp)}
        </div>
      </div>

      {/* Report Content */}
      <div className="bg-white border rounded-lg p-6 space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Project Details</h2>
          <dl className="space-y-3">
            <div>
              <dt className="text-sm text-gray-600 mb-1">Title / Summary</dt>
              <dd className="text-gray-900 font-medium">{estimation.projectName}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-600 mb-1">Reporter</dt>
              <dd className="text-gray-900 font-medium">{estimation.teamMemberName}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-600 mb-1">Portfolio</dt>
              <dd className="text-gray-900 font-medium">{estimation.portfolio}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-600 mb-1">Team</dt>
              <dd className="text-gray-900 font-medium">{estimation.domainTeam}</dd>
            </div>
            <div className="flex gap-8">
              <div>
                <dt className="text-sm text-gray-600 mb-1">Stage</dt>
                <dd>
                  <span className={`px-2 py-1 text-xs font-medium rounded ${
                    estimation.stage === 'Discovery' ? 'bg-discovery text-white' :
                    estimation.stage === 'Define' ? 'bg-define text-white' :
                    estimation.stage === 'Design' ? 'bg-design text-white' :
                    'bg-delivery text-white'
                  }`}>
                    {estimation.stage}
                  </span>
                </dd>
              </div>
              <div>
                <dt className="text-sm text-gray-600 mb-1">T-Shirt Size</dt>
                <dd>
                  <span className="px-2 py-1 text-xs font-medium rounded bg-purple-100 text-purple-800">
                    {estimation.tShirtSize}
                  </span>
                </dd>
              </div>
              {estimation.weeks && (
                <div>
                  <dt className="text-sm text-gray-600 mb-1">Duration</dt>
                  <dd className="text-gray-900 font-medium">{estimation.weeks} weeks</dd>
                </div>
              )}
            </div>
            {estimation.description && (
              <div>
                <dt className="text-sm text-gray-600 mb-1">Description</dt>
                <dd className="text-gray-900">{estimation.description}</dd>
              </div>
            )}
          </dl>
        </div>

        <div className="border-t pt-6">
          <h3 className="font-semibold text-gray-900 mb-3">Complexity Assessment</h3>
          <dl className="space-y-2">
            <div className="flex justify-between">
              <dt className="text-sm text-gray-600">Problem/Solution Ambiguity:</dt>
              <dd className="text-sm font-medium">{estimation.complexity.ambiguity}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-sm text-gray-600">Artifact/Deliverable Complexity:</dt>
              <dd className="text-sm font-medium">{estimation.complexity.artifactComplexity}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-sm text-gray-600">Stakeholder/Dependency Risk:</dt>
              <dd className="text-sm font-medium">{estimation.complexity.stakeholderRisk}</dd>
            </div>
            {estimation.complexity.iterationLikelihood && (
              <div className="flex justify-between">
                <dt className="text-sm text-gray-600">Iteration Likelihood:</dt>
                <dd className="text-sm font-medium">{estimation.complexity.iterationLikelihood}</dd>
              </div>
            )}
          </dl>
        </div>

        <div className="border-t pt-6">
          <h3 className="font-semibold text-gray-900 mb-3">
            Selected Activities ({estimation.activities.length})
          </h3>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {estimation.activities.map((activity) => (
              <li key={activity} className="text-sm text-gray-700">• {activity}</li>
            ))}
          </ul>
        </div>

        {estimation.overrideReason && (
          <div className="border-t pt-6">
            <h3 className="font-semibold text-gray-900 mb-2">Adjustment Reason</h3>
            <p className="text-sm text-gray-700">{estimation.overrideReason}</p>
          </div>
        )}

        {estimation.finalPoints === 13 && (
          <div className="border-t pt-6">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <p className="text-amber-900 font-medium">⚠️ Recommendation</p>
              <p className="text-amber-800 text-sm mt-1">
                This work may be too large. Consider breaking into smaller Discovery, Define, or Design items.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
