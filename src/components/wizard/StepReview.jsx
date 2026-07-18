import { useEffect } from 'react';
import { useEstimation } from '../../context/EstimationContext';
import { STORY_POINT_SCALE } from '../../utils/constants';
import { calculateTShirtSize } from '../../utils/calculations';

export default function StepReview() {
  const { wizardData, setWizardData, calculatePoints, goToStep } = useEstimation();

  useEffect(() => {
    calculatePoints();
  }, []);

  // Recalculate T-shirt size when points change
  useEffect(() => {
    if (wizardData.finalPoints && !wizardData.isTShirtOverridden) {
      const newTShirtSize = calculateTShirtSize(wizardData.finalPoints);
      if (newTShirtSize !== wizardData.calculatedTShirtSize) {
        setWizardData(prev => ({
          ...prev,
          calculatedTShirtSize: newTShirtSize,
          finalTShirtSize: newTShirtSize
        }));
      }
    }
  }, [wizardData.finalPoints, wizardData.isTShirtOverridden, wizardData.calculatedTShirtSize, setWizardData]);

  const updateOverride = (field, value) => {
    setWizardData(prev => ({ ...prev, [field]: value }));
  };

  const handleOverrideToggle = (checked) => {
    updateOverride('isOverridden', checked);
    updateOverride('isPointsOverridden', checked);
    if (!checked) {
      updateOverride('finalPoints', wizardData.calculatedPoints);
      updateOverride('overrideReason', '');
      updateOverride('pointsOverrideReason', '');
    }
  };

  const handleTShirtOverrideToggle = (checked) => {
    updateOverride('isTShirtOverridden', checked);
    if (!checked) {
      updateOverride('finalTShirtSize', wizardData.calculatedTShirtSize);
      updateOverride('tShirtOverrideReason', '');
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Review & Adjust</h2>
        <p className="text-gray-600 mt-1">
          Review your inputs and calculated complexity score
        </p>
      </div>

      {/* Project Summary */}
      <div className="bg-white border rounded-lg p-6 space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium text-gray-900">Project Summary</h3>
            <p className="text-lg mt-2">{wizardData.projectName}</p>
            <div className="mt-2 space-y-1 text-sm text-gray-600">
              <p><span className="font-medium">Team Member:</span> {wizardData.teamMemberName}</p>
              <p><span className="font-medium">Portfolio:</span> {wizardData.portfolio}</p>
              <p><span className="font-medium">Domain/Team:</span> {wizardData.domainTeam}</p>
            </div>
            <div className="flex gap-4 mt-2 text-sm text-gray-600">
              <span className={`px-2 py-1 rounded text-white text-xs font-medium ${
                wizardData.stage === 'Discovery' ? 'bg-discovery' :
                wizardData.stage === 'Define' ? 'bg-define' :
                'bg-design'
              }`}>
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
            className="text-sm text-primary hover:text-primary-dark"
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
            className="text-sm text-primary hover:text-primary-dark"
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
            className="text-sm text-primary hover:text-primary-dark"
          >
            Edit
          </button>
        </div>
      </div>

      {/* Calculated Points */}
      <div className="bg-primary/5 border-2 border-primary/20 rounded-lg p-6">
        <h3 className="font-medium text-gray-900 mb-4">Calculated Complexity Score</h3>
        <div className="text-6xl font-bold text-primary mb-4">
          {wizardData.calculatedPoints}
        </div>
        <p className="text-sm text-gray-700 mb-4">
          Based on your complexity assessment ({wizardData.activities.length} activities, {wizardData.weeks || 'no'} weeks), this work is estimated at{' '}
          <strong>{wizardData.calculatedPoints} points</strong>.
        </p>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
          <p className="text-sm text-blue-900 font-medium mb-2">ℹ️ About This Calculation</p>
          <p className="text-sm text-blue-800">
            This is a structured estimation framework for design work, not traditional software story pointing.
            It brings rigor and explainability to design estimation by using a formula-based approach with weighted
            inputs across complexity dimensions, activities, and duration. The output helps justify estimates to
            stakeholders and provides consistent scoring across design projects.
          </p>
        </div>
      </div>

      {/* Epic-Level Warning */}
      {wizardData.calculatedPoints === 13 && (
        <div className="bg-amber-50 border-2 border-amber-300 rounded-lg p-6">
          <div className="space-y-3">
            <p className="text-amber-900 font-semibold text-lg flex items-center gap-2">
              <span className="text-2xl">⚠️</span>
              Epic-Level Work Detected
            </p>
            <p className="text-amber-800">
              This estimation indicates epic-level complexity. Consider breaking this work into smaller stories:
            </p>
            <div className="bg-white/50 rounded p-4">
              <p className="text-amber-900 font-medium text-sm mb-2">Recommended breakdown approach:</p>
              <ul className="text-amber-800 text-sm space-y-1.5 ml-4">
                <li>• Separate Discovery, Define, and Design phases into individual stories</li>
                <li>• Split by user journey or feature area</li>
                <li>• Identify discrete deliverables that can be estimated independently</li>
                <li>• Each resulting story should be 8 points or less</li>
              </ul>
            </div>
            <div className="bg-amber-100 rounded p-3">
              <p className="text-amber-900 text-sm font-medium">Breaking down large work items improves:</p>
              <div className="grid grid-cols-2 gap-2 mt-2 text-sm text-amber-800">
                <div>✓ Estimation accuracy</div>
                <div>✓ Risk management</div>
                <div>✓ Team throughput visibility</div>
                <div>✓ Delivery predictability</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Override Option */}
      <div className="bg-white border rounded-lg p-6 space-y-4">
        <label className="flex items-start gap-3">
          <input
            type="checkbox"
            checked={wizardData.isOverridden}
            onChange={(e) => handleOverrideToggle(e.target.checked)}
            className="mt-1 h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
          />
          <div>
            <span className="font-medium text-gray-900">Manually adjust complexity score</span>
            <p className="text-sm text-gray-600 mt-1">
              Override the calculated value if needed
            </p>
          </div>
        </label>

        {wizardData.isOverridden && (
          <div className="space-y-4 pl-7">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Complexity Score
              </label>
              <div className="flex gap-2">
                {STORY_POINT_SCALE.map((points) => (
                  <button
                    key={points}
                    onClick={() => updateOverride('finalPoints', points)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      wizardData.finalPoints === points
                        ? 'bg-primary text-white'
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
                <div className="space-y-2">
                  <p className="text-amber-900 font-semibold text-sm">
                    ⚠️ Epic-Level Work Detected
                  </p>
                  <p className="text-amber-800 text-sm">
                    This estimation indicates epic-level complexity. Consider breaking this work into smaller stories:
                  </p>
                  <ul className="text-amber-800 text-sm list-disc list-inside space-y-1 ml-2">
                    <li>Separate Discovery, Define, and Design phases into individual stories</li>
                    <li>Split by user journey or feature area</li>
                    <li>Identify discrete deliverables that can be estimated independently</li>
                    <li>Each resulting story should be 8 points or less</li>
                  </ul>
                  <p className="text-amber-800 text-sm font-medium mt-2">
                    Breaking down large work items improves estimation accuracy, throughput visibility, risk management, and delivery predictability.
                  </p>
                </div>
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>
          </div>
        )}
      </div>

      {/* T-Shirt Size */}
      <div className="bg-white border rounded-lg p-6 space-y-4">
        <div>
          <h3 className="font-semibold text-gray-900">Recommended T-Shirt Size</h3>
          <p className="text-2xl font-bold text-primary mt-2">
            {wizardData.calculatedTShirtSize}
          </p>
          <p className="text-sm text-gray-600 mt-1">
            Based on complexity score of {wizardData.isPointsOverridden ? wizardData.finalPoints : wizardData.calculatedPoints}
          </p>
        </div>

        <label className="flex items-start gap-3">
          <input
            type="checkbox"
            checked={wizardData.isTShirtOverridden}
            onChange={(e) => handleTShirtOverrideToggle(e.target.checked)}
            className="mt-1 h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
          />
          <div>
            <span className="font-medium text-gray-900">Override recommended size</span>
            <p className="text-sm text-gray-600 mt-1">
              Manually set a different T-shirt size if needed
            </p>
          </div>
        </label>

        {wizardData.isTShirtOverridden && (
          <div className="space-y-4 pl-7">
            <div>
              <label htmlFor="customTShirtSize" className="block text-sm font-medium text-gray-700 mb-1">
                Custom T-Shirt Size
              </label>
              <select
                id="customTShirtSize"
                value={wizardData.finalTShirtSize}
                onChange={(e) => updateOverride('finalTShirtSize', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              >
                <option value="">Select size...</option>
                <option value="XS">XS - Extra Small</option>
                <option value="S">S - Small</option>
                <option value="M">M - Medium</option>
                <option value="L">L - Large</option>
                <option value="XL">XL - Extra Large</option>
              </select>
            </div>

            <div>
              <label htmlFor="tShirtReason" className="block text-sm font-medium text-gray-700 mb-1">
                Reason for Override <span className="text-gray-500 text-sm">(optional)</span>
              </label>
              <input
                type="text"
                id="tShirtReason"
                placeholder="e.g., More stakeholder coordination than typical"
                value={wizardData.tShirtOverrideReason}
                onChange={(e) => updateOverride('tShirtOverrideReason', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
