import { useEffect } from 'react';
import { useEstimation } from '../../context/EstimationContext';
import { STORY_POINT_SCALE } from '../../utils/constants';

export default function StepReview() {
  const { wizardData, setWizardData, calculatePoints, goToStep } = useEstimation();

  useEffect(() => {
    calculatePoints();
  }, []);

  const updateOverride = (field, value) => {
    setWizardData(prev => ({ ...prev, [field]: value }));
  };

  const handleOverrideToggle = (checked) => {
    updateOverride('isOverridden', checked);
    if (!checked) {
      updateOverride('finalPoints', wizardData.calculatedPoints);
      updateOverride('overrideReason', '');
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Review & Adjust</h2>
        <p className="text-gray-600 mt-1">
          Review your inputs and calculated story points
        </p>
      </div>

      {/* Project Summary */}
      <div className="bg-white border rounded-lg p-6 space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium text-gray-900">Project Summary</h3>
            <p className="text-lg mt-2">{wizardData.projectName}</p>
            <div className="flex gap-4 mt-2 text-sm text-gray-600">
              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">
                {wizardData.stage}
              </span>
              {wizardData.weeks && <span>{wizardData.weeks} weeks</span>}
            </div>
            {wizardData.description && (
              <p className="text-sm text-gray-600 mt-2">{wizardData.description}</p>
            )}
          </div>
          <button
            onClick={() => goToStep(1)}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Edit
          </button>
        </div>
      </div>

      {/* Activities */}
      <div className="bg-white border rounded-lg p-6 space-y-4">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="font-medium text-gray-900">Selected Activities</h3>
            <p className="text-sm text-gray-500 mt-1">
              {wizardData.activities.length} activities selected
            </p>
            <ul className="mt-3 space-y-1">
              {wizardData.activities.map((activity) => (
                <li key={activity} className="text-sm text-gray-700">• {activity}</li>
              ))}
            </ul>
          </div>
          <button
            onClick={() => goToStep(2)}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Edit
          </button>
        </div>
      </div>

      {/* Complexity */}
      <div className="bg-white border rounded-lg p-6 space-y-4">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="font-medium text-gray-900">Complexity Assessment</h3>
            <div className="mt-3 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Problem/Solution Ambiguity:</span>
                <span className="font-medium">{wizardData.complexity.ambiguity}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Artifact/Deliverable Complexity:</span>
                <span className="font-medium">{wizardData.complexity.artifactComplexity}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Stakeholder/Dependency Risk:</span>
                <span className="font-medium">{wizardData.complexity.stakeholderRisk}</span>
              </div>
              {wizardData.complexity.iterationLikelihood && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Iteration Likelihood:</span>
                  <span className="font-medium">{wizardData.complexity.iterationLikelihood}</span>
                </div>
              )}
            </div>
          </div>
          <button
            onClick={() => goToStep(3)}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Edit
          </button>
        </div>
      </div>

      {/* Calculated Points */}
      <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
        <h3 className="font-medium text-gray-900 mb-4">Calculated Story Points</h3>
        <div className="text-6xl font-bold text-blue-600 mb-4">
          {wizardData.calculatedPoints}
        </div>
        <p className="text-sm text-gray-700">
          Based on your complexity assessment, this work is estimated at{' '}
          <strong>{wizardData.calculatedPoints} story points</strong>.
        </p>
      </div>

      {/* Override Option */}
      <div className="bg-white border rounded-lg p-6 space-y-4">
        <label className="flex items-start gap-3">
          <input
            type="checkbox"
            checked={wizardData.isOverridden}
            onChange={(e) => handleOverrideToggle(e.target.checked)}
            className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <div>
            <span className="font-medium text-gray-900">Manually adjust story points</span>
            <p className="text-sm text-gray-600 mt-1">
              Override the calculated value if needed
            </p>
          </div>
        </label>

        {wizardData.isOverridden && (
          <div className="space-y-4 pl-7">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Story Points
              </label>
              <div className="flex gap-2">
                {STORY_POINT_SCALE.map((points) => (
                  <button
                    key={points}
                    onClick={() => updateOverride('finalPoints', points)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      wizardData.finalPoints === points
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {points}
                  </button>
                ))}
              </div>
            </div>

            {wizardData.finalPoints === 13 && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <p className="text-amber-800 text-sm">
                  ⚠️ Consider breaking this into smaller items
                </p>
              </div>
            )}

            <div>
              <label htmlFor="overrideReason" className="block text-sm font-medium text-gray-700 mb-1">
                Reason for adjustment (optional)
              </label>
              <textarea
                id="overrideReason"
                rows="2"
                value={wizardData.overrideReason}
                onChange={(e) => updateOverride('overrideReason', e.target.value)}
                placeholder="Why are you adjusting the points?"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
