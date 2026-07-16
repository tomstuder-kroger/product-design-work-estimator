import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEstimation } from '../../context/EstimationContext';
import { generateBreakdown } from '../../utils/calculations';

export default function StepReport() {
  const { wizardData, saveEstimation, resetWizard } = useEstimation();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const breakdown = generateBreakdown(wizardData);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(breakdown);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleSave = () => {
    const id = saveEstimation();
    navigate('/history');
  };

  const handleNewEstimation = () => {
    resetWizard();
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Estimation Report</h2>
        <p className="text-gray-600 mt-1">
          Your story point estimation is complete
        </p>
      </div>

      {/* Story Points Header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg p-8 text-center">
        <div className="text-7xl font-bold mb-2">
          {wizardData.finalPoints}
        </div>
        <div className="text-xl">Story Points</div>
        {wizardData.isOverridden && wizardData.calculatedPoints !== wizardData.finalPoints && (
          <div className="text-sm mt-2 opacity-90">
            Calculated: {wizardData.calculatedPoints} → Adjusted to: {wizardData.finalPoints}
          </div>
        )}
      </div>

      {/* Report Content */}
      <div className="bg-white border rounded-lg p-6 space-y-6">
        <div>
          <h3 className="font-semibold text-gray-900 mb-2">Project Details</h3>
          <dl className="space-y-2">
            <div className="flex justify-between text-sm">
              <dt className="text-gray-600">Name:</dt>
              <dd className="font-medium">{wizardData.projectName}</dd>
            </div>
            <div className="flex justify-between text-sm">
              <dt className="text-gray-600">Stage:</dt>
              <dd>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                  {wizardData.stage}
                </span>
              </dd>
            </div>
            {wizardData.weeks && (
              <div className="flex justify-between text-sm">
                <dt className="text-gray-600">Duration:</dt>
                <dd className="font-medium">{wizardData.weeks} weeks</dd>
              </div>
            )}
            {wizardData.description && (
              <div className="text-sm">
                <dt className="text-gray-600 mb-1">Description:</dt>
                <dd className="text-gray-900">{wizardData.description}</dd>
              </div>
            )}
          </dl>
        </div>

        <div className="border-t pt-6">
          <h3 className="font-semibold text-gray-900 mb-2">Complexity Assessment</h3>
          <dl className="space-y-1 text-sm">
            <div className="flex justify-between">
              <dt className="text-gray-600">Problem/Solution Ambiguity:</dt>
              <dd className="font-medium">{wizardData.complexity.ambiguity}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-600">Artifact/Deliverable Complexity:</dt>
              <dd className="font-medium">{wizardData.complexity.artifactComplexity}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-600">Stakeholder/Dependency Risk:</dt>
              <dd className="font-medium">{wizardData.complexity.stakeholderRisk}</dd>
            </div>
            {wizardData.complexity.iterationLikelihood && (
              <div className="flex justify-between">
                <dt className="text-gray-600">Iteration Likelihood:</dt>
                <dd className="font-medium">{wizardData.complexity.iterationLikelihood}</dd>
              </div>
            )}
          </dl>
        </div>

        <div className="border-t pt-6">
          <h3 className="font-semibold text-gray-900 mb-2">Selected Activities</h3>
          <ul className="space-y-1">
            {wizardData.activities.map((activity) => (
              <li key={activity} className="text-sm text-gray-700">• {activity}</li>
            ))}
          </ul>
        </div>

        {wizardData.finalPoints === 13 && (
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

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={handleCopy}
          className="flex-1 btn-secondary"
        >
          {copied ? 'Copied!' : 'Copy to Clipboard'}
        </button>
        <button
          onClick={handleSave}
          className="flex-1 btn-primary"
        >
          Save to History
        </button>
      </div>

      <div className="text-center">
        <button
          onClick={handleNewEstimation}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          Start New Estimation
        </button>
      </div>
    </div>
  );
}
