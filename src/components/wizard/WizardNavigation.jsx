import { useEstimation } from '../../context/EstimationContext';
import {isStep1Valid} from './StepProjectInfo';
import {isStep2Valid} from './StepActivities';
import {isStep3Valid} from './StepComplexity';

export default function WizardNavigation() {
  const { wizardData, currentStep, goToStep } = useEstimation();

  const canGoNext = () => {
    switch (currentStep) {
      case 1:
        return isStep1Valid(wizardData);
      case 2:
        return isStep2Valid(wizardData);
      case 3:
        return isStep3Valid(wizardData);
      case 4:
        return true;
      case 5:
        return false; // No next on final step
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (canGoNext()) {
      goToStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      goToStep(currentStep - 1);
    }
  };

  const getNextButtonText = () => {
    if (currentStep === 4) return 'View Report';
    return 'Next';
  };

  return (
    <div className="flex justify-between items-center pt-6 border-t">
      <div>
        {currentStep > 1 && (
          <button onClick={handleBack} className="btn-secondary">
            Back
          </button>
        )}
      </div>

      <div className="flex items-center gap-2">
        {!canGoNext() && currentStep < 5 && (
          <span className="text-sm text-gray-500">
            Complete required fields to continue
          </span>
        )}
        {currentStep < 5 && (
          <button
            onClick={handleNext}
            disabled={!canGoNext()}
            className={`btn-primary ${!canGoNext() ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {getNextButtonText()}
          </button>
        )}
      </div>
    </div>
  );
}
