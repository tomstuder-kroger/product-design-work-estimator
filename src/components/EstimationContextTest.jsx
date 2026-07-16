import { useEstimation } from '../context/EstimationContext';

export function EstimationContextTest() {
  const context = useEstimation();

  if (!context) {
    return <div className="text-red-600">Error: Context not available</div>;
  }

  const {
    wizardData,
    currentStep,
    visitedSteps,
    history,
    goToStep,
    setWizardData,
    calculatePoints,
    saveEstimation,
    deleteEstimation,
    loadEstimation,
    resetWizard
  } = context;

  return (
    <div className="p-4 bg-blue-50 border border-blue-200 rounded">
      <h3 className="text-lg font-bold mb-4">Estimation Context Test</h3>

      <div className="space-y-4">
        <div>
          <h4 className="font-semibold">Current Step: {currentStep}</h4>
          <button
            onClick={() => goToStep(2)}
            className="mt-2 px-3 py-1 bg-blue-600 text-white rounded text-sm"
          >
            Go to Step 2
          </button>
          <button
            onClick={() => goToStep(3)}
            className="mt-2 ml-2 px-3 py-1 bg-blue-600 text-white rounded text-sm"
          >
            Go to Step 3
          </button>
        </div>

        <div>
          <h4 className="font-semibold">Visited Steps: {visitedSteps.join(', ')}</h4>
        </div>

        <div>
          <h4 className="font-semibold">Wizard Data Summary:</h4>
          <pre className="bg-white p-2 rounded text-xs overflow-auto max-h-40">
            {JSON.stringify(
              {
                projectName: wizardData.projectName,
                stage: wizardData.stage,
                weeks: wizardData.weeks,
                complexity: wizardData.complexity,
                calculatedPoints: wizardData.calculatedPoints,
                finalPoints: wizardData.finalPoints
              },
              null,
              2
            )}
          </pre>
        </div>

        <div>
          <h4 className="font-semibold">Test Operations:</h4>
          <button
            onClick={() => {
              setWizardData(prev => ({
                ...prev,
                projectName: 'Test Project',
                stage: 'Design',
                weeks: '2',
                complexity: {
                  ambiguity: 'High',
                  artifactComplexity: 'Medium',
                  stakeholderRisk: 'Low',
                  iterationLikelihood: 'Medium'
                }
              }));
            }}
            className="px-3 py-1 bg-green-600 text-white rounded text-sm"
          >
            Set Test Data
          </button>

          <button
            onClick={() => {
              const points = calculatePoints();
              console.log('Calculated Points:', points);
            }}
            className="ml-2 px-3 py-1 bg-purple-600 text-white rounded text-sm"
          >
            Calculate Points
          </button>

          <button
            onClick={() => {
              const id = saveEstimation();
              console.log('Saved estimation with ID:', id);
            }}
            className="ml-2 px-3 py-1 bg-indigo-600 text-white rounded text-sm"
          >
            Save Estimation
          </button>

          <button
            onClick={() => resetWizard()}
            className="ml-2 px-3 py-1 bg-red-600 text-white rounded text-sm"
          >
            Reset
          </button>
        </div>

        <div>
          <h4 className="font-semibold">History Count: {history.length}</h4>
          {history.length > 0 && (
            <div className="mt-2 bg-white p-2 rounded text-xs max-h-40 overflow-auto">
              {history.slice(0, 3).map((item, idx) => (
                <div key={idx} className="mb-2 pb-2 border-b">
                  <div><strong>ID:</strong> {item.id?.substring(0, 8)}...</div>
                  <div><strong>Project:</strong> {item.projectName}</div>
                  <div><strong>Points:</strong> {item.finalPoints}</div>
                  <button
                    onClick={() => deleteEstimation(item.id)}
                    className="text-red-600 text-xs hover:underline"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
