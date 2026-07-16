import { useEstimation } from '../context/EstimationContext';
import WizardStepper from '../components/wizard/WizardStepper';
import WizardNavigation from '../components/wizard/WizardNavigation';
import StepProjectInfo from '../components/wizard/StepProjectInfo';
import StepActivities from '../components/wizard/StepActivities';
import StepComplexity from '../components/wizard/StepComplexity';
import StepReview from '../components/wizard/StepReview';
import StepReport from '../components/wizard/StepReport';

export default function WizardPage() {
  const { currentStep } = useEstimation();

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <StepProjectInfo />;
      case 2:
        return <StepActivities />;
      case 3:
        return <StepComplexity />;
      case 4:
        return <StepReview />;
      case 5:
        return <StepReport />;
      default:
        return <StepProjectInfo />;
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <WizardStepper />

      <div className="bg-white rounded-lg shadow-sm border p-8 min-h-[500px]">
        {renderStep()}
      </div>

      {currentStep < 5 && <WizardNavigation />}
    </div>
  );
}
