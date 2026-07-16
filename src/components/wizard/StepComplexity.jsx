import { useEstimation } from '../../context/EstimationContext';
import ComplexitySelector from '../common/ComplexitySelector';
import { COMPLEXITY_DIMENSIONS } from '../../utils/constants';

export default function StepComplexity() {
  const { wizardData, setWizardData } = useEstimation();

  const updateComplexity = (key, value) => {
    setWizardData(prev => ({
      ...prev,
      complexity: {
        ...prev.complexity,
        [key]: value
      }
    }));
  };

  const requiredCount = COMPLEXITY_DIMENSIONS.filter(d => d.required).length;
  const completedRequired = COMPLEXITY_DIMENSIONS
    .filter(d => d.required)
    .filter(d => wizardData.complexity[d.key] !== '').length;

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Complexity Assessment</h2>
        <p className="text-gray-600 mt-1">
          Rate the complexity across key dimensions
        </p>
        <p className="text-sm text-gray-500 mt-2">
          {completedRequired} of {requiredCount} required dimensions assessed
        </p>
      </div>

      <div className="space-y-6">
        {COMPLEXITY_DIMENSIONS.map((dimension) => (
          <ComplexitySelector
            key={dimension.key}
            dimension={dimension}
            value={wizardData.complexity[dimension.key]}
            onChange={(value) => updateComplexity(dimension.key, value)}
          />
        ))}
      </div>

      {completedRequired < requiredCount && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800 text-sm">
            Please complete all required complexity dimensions to continue
          </p>
        </div>
      )}
    </div>
  );
}

export { isStepValid as isStep3Valid };

function isStepValid(wizardData) {
  const required = COMPLEXITY_DIMENSIONS.filter(d => d.required);
  return required.every(d => wizardData.complexity[d.key] !== '');
}
