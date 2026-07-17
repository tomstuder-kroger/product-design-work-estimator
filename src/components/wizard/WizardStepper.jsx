import { useEstimation } from '../../context/EstimationContext';

const STEPS = [
  { number: 1, label: 'Project Info' },
  { number: 2, label: 'Activities' },
  { number: 3, label: 'Complexity' },
  { number: 4, label: 'Review' },
  { number: 5, label: 'Report' }
];

export default function WizardStepper() {
  const { currentStep, visitedSteps, goToStep } = useEstimation();

  const canNavigateTo = (stepNumber) => {
    return visitedSteps.includes(stepNumber);
  };

  return (
    <nav aria-label="Progress">
      <ol className="flex items-center justify-between max-w-3xl mx-auto">
        {STEPS.map((step, index) => (
          <li key={step.number} className="relative flex-1">
            {/* Connector Line */}
            {index < STEPS.length - 1 && (
              <div
                className={`absolute top-5 left-1/2 w-full h-0.5 ${
                  currentStep > step.number ? 'bg-primary' : 'bg-gray-300'
                }`}
                aria-hidden="true"
              />
            )}

            {/* Step Button */}
            <button
              onClick={() => canNavigateTo(step.number) && goToStep(step.number)}
              disabled={!canNavigateTo(step.number)}
              className={`relative flex flex-col items-center group ${
                canNavigateTo(step.number) ? 'cursor-pointer' : 'cursor-not-allowed'
              }`}
            >
              <span
                className={`h-10 w-10 rounded-full flex items-center justify-center border-2 transition-all ${
                  currentStep === step.number
                    ? 'border-primary bg-primary text-white'
                    : currentStep > step.number
                    ? 'border-primary bg-blue-50 text-primary'
                    : 'border-gray-300 bg-white text-gray-500'
                } ${canNavigateTo(step.number) && currentStep !== step.number ? 'group-hover:border-primary' : ''}`}
              >
                {currentStep > step.number ? (
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <span>{step.number}</span>
                )}
              </span>
              <span
                className={`mt-2 text-xs font-medium ${
                  currentStep === step.number
                    ? 'text-primary'
                    : currentStep > step.number
                    ? 'text-gray-700'
                    : 'text-gray-500'
                }`}
              >
                {step.label}
              </span>
            </button>
          </li>
        ))}
      </ol>
    </nav>
  );
}
