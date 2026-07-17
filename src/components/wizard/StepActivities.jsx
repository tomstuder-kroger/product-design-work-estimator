import { useEstimation } from '../../context/EstimationContext';
import ActivityWithWeight from '../common/ActivityWithWeight';
import { getActivitiesByStage } from '../../utils/constants';

export default function StepActivities() {
  const { wizardData, setWizardData } = useEstimation();

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
    </div>
  );
}

export { isStepValid as isStep2Valid };

function isStepValid(wizardData) {
  return wizardData.activities.length > 0;
}
