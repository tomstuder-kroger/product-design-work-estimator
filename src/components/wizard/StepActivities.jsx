import { useEstimation } from '../../context/EstimationContext';
import ActivityCheckboxGrid from '../common/ActivityCheckboxGrid';
import { ACTIVITIES } from '../../utils/constants';

export default function StepActivities() {
  const { wizardData, setWizardData } = useEstimation();

  const updateActivities = (activities) => {
    setWizardData(prev => ({ ...prev, activities }));
  };

  const stageActivities = ACTIVITIES[wizardData.stage] || [];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Activities & Artifacts</h2>
        <p className="text-gray-600 mt-1">
          Select the activities and artifacts for this {wizardData.stage} work
        </p>
        <p className="text-sm text-gray-500 mt-2">
          {wizardData.activities.length} activit{wizardData.activities.length === 1 ? 'y' : 'ies'} selected
        </p>
      </div>

      <ActivityCheckboxGrid
        activities={stageActivities}
        selected={wizardData.activities}
        onChange={updateActivities}
      />

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
