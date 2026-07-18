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
    navigate('/');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Estimation Report</h2>
        <p className="text-gray-600 mt-1">
          Your complexity score estimation is complete
        </p>
      </div>

      {/* Summary Grid */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="bg-primary/10 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Complexity Score</p>
          <p className="text-3xl font-bold text-primary">{wizardData.finalPoints}</p>
          {wizardData.isPointsOverridden && wizardData.calculatedPoints !== wizardData.finalPoints && (
            <p className="text-xs text-gray-500 mt-1">
              (calculated: {wizardData.calculatedPoints})
            </p>
          )}
        </div>

        <div className="bg-primary/10 p-4 rounded-lg">
          <p className="text-sm text-gray-600">T-Shirt Size</p>
          <p className="text-3xl font-bold text-primary">{wizardData.finalTShirtSize}</p>
          {wizardData.isTShirtOverridden && wizardData.calculatedTShirtSize !== wizardData.finalTShirtSize && (
            <p className="text-xs text-gray-500 mt-1">
              (calculated: {wizardData.calculatedTShirtSize})
            </p>
          )}
        </div>
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
              <dt className="text-gray-600">Team Member:</dt>
              <dd className="font-medium">{wizardData.teamMemberName}</dd>
            </div>
            <div className="flex justify-between text-sm">
              <dt className="text-gray-600">Portfolio:</dt>
              <dd className="font-medium">{wizardData.portfolio}</dd>
            </div>
            <div className="flex justify-between text-sm">
              <dt className="text-gray-600">Domain/Team:</dt>
              <dd className="font-medium">{wizardData.domainTeam}</dd>
            </div>
            <div className="flex justify-between text-sm">
              <dt className="text-gray-600">Stage:</dt>
              <dd>
                <span className={`px-2 py-1 rounded text-white text-xs font-medium ${
                  wizardData.stage === 'Discovery' ? 'bg-discovery' :
                  wizardData.stage === 'Define' ? 'bg-define' :
                  'bg-design'
                }`}>
                  {wizardData.stage}
                </span>
              </dd>
            </div>
            <div className="flex justify-between text-sm">
              <dt className="text-gray-600">T-Shirt Size:</dt>
              <dd>
                <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs font-medium">
                  {wizardData.tShirtSize}
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
            <div className="bg-amber-50 border border-amber-300 rounded-lg p-6">
              <div className="space-y-3">
                <p className="text-amber-900 font-semibold text-lg flex items-center gap-2">
                  <span className="text-2xl">⚠️</span>
                  Epic-Level Work - Breakdown Recommended
                </p>
                <p className="text-amber-800">
                  This 13-point estimation indicates epic-level complexity. For better estimation accuracy and delivery predictability, consider breaking this work into smaller stories:
                </p>
                <div className="bg-white/50 rounded p-4">
                  <p className="text-amber-900 font-medium text-sm mb-2">Recommended approach:</p>
                  <ul className="text-amber-800 text-sm space-y-1.5 ml-4">
                    <li>• Separate Discovery, Define, and Design phases into individual stories</li>
                    <li>• Split by user journey or feature area</li>
                    <li>• Identify discrete deliverables that can be estimated independently</li>
                    <li>• Target each story at 8 points or less</li>
                  </ul>
                </div>
                <div className="bg-amber-100 rounded p-3">
                  <p className="text-amber-900 text-sm font-medium">Benefits of breaking down epic-level work:</p>
                  <div className="grid grid-cols-2 gap-2 mt-2 text-sm text-amber-800">
                    <div>✓ Improved estimation accuracy</div>
                    <div>✓ Better risk management</div>
                    <div>✓ Clearer team throughput</div>
                    <div>✓ More predictable delivery</div>
                  </div>
                </div>
              </div>
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
          className="text-primary hover:text-primary-dark text-sm font-medium"
        >
          Start New Estimation
        </button>
      </div>
    </div>
  );
}
