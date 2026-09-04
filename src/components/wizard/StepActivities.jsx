import { useState } from 'react';
import { useEstimation } from '../../context/EstimationContext';
import ActivityWithWeight from '../common/ActivityWithWeight';
import { getActivitiesByStage, DEPENDENCY_OPTIONS } from '../../utils/constants';

export default function StepActivities() {
  const { wizardData, setWizardData } = useEstimation();
  const [customDependencyInput, setCustomDependencyInput] = useState('');

  const stageActivities = getActivitiesByStage(wizardData.stage);

  const handleToggle = (activityName) => {
    if (wizardData.activities.includes(activityName)) {
      // Remove activity and its adjustment
      setWizardData(prev => ({
        ...prev,
        activities: prev.activities.filter(a => a !== activityName),
        activityAdjustments: {
          ...prev.activityAdjustments,
          [activityName]: undefined
        }
      }));
    } else {
      // Add activity with default adjustment of 0
      setWizardData(prev => ({
        ...prev,
        activities: [...prev.activities, activityName],
        activityAdjustments: {
          ...prev.activityAdjustments,
          [activityName]: 0
        }
      }));
    }
  };

  const handleAdjustment = (activityName, adjustment) => {
    setWizardData(prev => ({
      ...prev,
      activityAdjustments: {
        ...prev.activityAdjustments,
        [activityName]: adjustment
      }
    }));
  };

  const adjustedCount = Object.values(wizardData.activityAdjustments).filter(
    adj => adj !== 0 && adj !== undefined
  ).length;

  const handleDependencyToggle = (dependency) => {
    if (wizardData.dependencies.includes(dependency)) {
      setWizardData(prev => ({
        ...prev,
        dependencies: prev.dependencies.filter(d => d !== dependency)
      }));
    } else {
      setWizardData(prev => ({
        ...prev,
        dependencies: [...prev.dependencies, dependency]
      }));
    }
  };

  const handleAddCustomDependency = () => {
    const trimmed = customDependencyInput.trim();
    if (trimmed && !wizardData.customDependencies.includes(trimmed)) {
      setWizardData(prev => ({
        ...prev,
        customDependencies: [...prev.customDependencies, trimmed]
      }));
      setCustomDependencyInput('');
    }
  };

  const handleRemoveCustomDependency = (dependency) => {
    setWizardData(prev => ({
      ...prev,
      customDependencies: prev.customDependencies.filter(d => d !== dependency)
    }));
  };

  const handleCustomDependencyKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddCustomDependency();
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Activities & Artifacts</h2>
        <p className="text-gray-600 mt-1">
          Select the activities and artifacts for this {wizardData.stage} work
        </p>
        <p className="text-sm text-gray-500 mt-2">
          {wizardData.activities.length} activit{wizardData.activities.length === 1 ? 'y' : 'ies'} selected
          {adjustedCount > 0 && ` (${adjustedCount} adjusted)`}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {stageActivities.map((activity) => (
          <ActivityWithWeight
            key={activity.name}
            activity={activity}
            isSelected={wizardData.activities.includes(activity.name)}
            onToggle={handleToggle}
            adjustment={wizardData.activityAdjustments[activity.name] || 0}
            onAdjustment={handleAdjustment}
          />
        ))}
      </div>

      {wizardData.activities.length === 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800 text-sm">
            Please select at least one activity to continue
          </p>
        </div>
      )}

      <div className="border-t pt-6 mt-8">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Dependencies</h3>
          <p className="text-gray-600 text-sm mt-1">
            Select team members or resources needed for this work (optional)
          </p>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {DEPENDENCY_OPTIONS.map((dependency) => (
              <label
                key={dependency}
                className={`flex items-center gap-2 p-3 border-2 rounded-lg cursor-pointer transition-all ${
                  wizardData.dependencies.includes(dependency)
                    ? 'border-primary bg-primary/5'
                    : 'border-gray-300 hover:border-primary/50'
                }`}
              >
                <input
                  type="checkbox"
                  checked={wizardData.dependencies.includes(dependency)}
                  onChange={() => handleDependencyToggle(dependency)}
                  className="w-4 h-4 text-primary rounded focus:ring-primary"
                />
                <span className="text-sm font-medium text-gray-900">{dependency}</span>
              </label>
            ))}
          </div>

          <div>
            <label htmlFor="customDependency" className="block text-sm font-medium text-gray-700 mb-2">
              Add Custom Dependencies
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                id="customDependency"
                value={customDependencyInput}
                onChange={(e) => setCustomDependencyInput(e.target.value)}
                onKeyPress={handleCustomDependencyKeyPress}
                placeholder="e.g., Product Manager, Content Writer..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              />
              <button
                type="button"
                onClick={handleAddCustomDependency}
                disabled={!customDependencyInput.trim()}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add
              </button>
            </div>
          </div>

          {wizardData.customDependencies.length > 0 && (
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Custom Dependencies:</p>
              <div className="flex flex-wrap gap-2">
                {wizardData.customDependencies.map((dependency) => (
                  <span
                    key={dependency}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                  >
                    {dependency}
                    <button
                      type="button"
                      onClick={() => handleRemoveCustomDependency(dependency)}
                      className="ml-1 text-primary hover:text-primary-dark"
                      aria-label={`Remove ${dependency}`}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          <div>
            <label htmlFor="dependencyDetails" className="block text-sm font-medium text-gray-700 mb-2">
              Provide Dependency Details <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <textarea
              id="dependencyDetails"
              value={wizardData.dependencyDetails || ''}
              onChange={(e) => setWizardData(prev => ({ ...prev, dependencyDetails: e.target.value }))}
              rows={3}
              placeholder="Add any additional context about these dependencies..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export { isStepValid as isStep2Valid };

function isStepValid(wizardData) {
  return wizardData.activities.length > 0;
}
