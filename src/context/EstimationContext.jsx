import { createContext, useContext, useState, useEffect } from 'react';
import { calculateStoryPoints, calculateTShirtSize, generateBreakdown } from '../utils/calculations';
import { saveHistory as saveHistoryToStorage, loadHistory, saveDraft, clearDraft } from '../utils/storage';

const EstimationContext = createContext(null);

const initialWizardData = {
  projectName: '',
  teamMemberName: '',
  assignee: '',
  portfolio: '',
  domainTeam: '',
  priority: '',
  stage: '',
  tShirtSize: '',
  weeks: '',
  description: '',
  activities: [],
  activityAdjustments: {},
  dependencies: [],
  customDependencies: [],
  complexity: {
    ambiguity: '',
    artifactComplexity: '',
    stakeholderRisk: '',
    iterationLikelihood: ''
  },
  calculatedPoints: 0,
  finalPoints: 0,
  calculatedTShirtSize: '',
  finalTShirtSize: '',
  isOverridden: false,
  isPointsOverridden: false,
  isTShirtOverridden: false,
  overrideReason: '',
  pointsOverrideReason: '',
  tShirtOverrideReason: ''
};

export function EstimationProvider({ children }) {
  const [wizardData, setWizardData] = useState(initialWizardData);
  const [currentStep, setCurrentStep] = useState(1);
  const [history, setHistory] = useState([]);
  const [visitedSteps, setVisitedSteps] = useState([1]);

  // Load history on mount
  useEffect(() => {
    const loadedHistory = loadHistory();
    setHistory(loadedHistory);
  }, []);

  // Auto-save draft when wizard data changes
  useEffect(() => {
    if (currentStep > 1) {
      saveDraft(wizardData, currentStep);
    }
  }, [wizardData, currentStep]);

  const goToStep = (step) => {
    setCurrentStep(step);
    if (!visitedSteps.includes(step)) {
      setVisitedSteps([...visitedSteps, step]);
    }
  };

  const calculatePoints = () => {
    const points = calculateStoryPoints(
      wizardData.complexity,
      wizardData.activities,
      wizardData.activityAdjustments,
      wizardData.weeks
    );
    const tShirtSize = calculateTShirtSize(points);
    setWizardData(prev => ({
      ...prev,
      calculatedPoints: points,
      finalPoints: prev.isPointsOverridden ? prev.finalPoints : points,
      calculatedTShirtSize: tShirtSize,
      finalTShirtSize: prev.isTShirtOverridden ? prev.finalTShirtSize : tShirtSize
    }));
    return points;
  };

  const saveEstimation = () => {
    const estimation = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      projectName: wizardData.projectName,
      teamMemberName: wizardData.teamMemberName,
      assignee: wizardData.assignee,
      portfolio: wizardData.portfolio,
      domainTeam: wizardData.domainTeam,
      priority: wizardData.priority,
      stage: wizardData.stage,
      weeks: wizardData.weeks,
      description: wizardData.description,
      activities: wizardData.activities,
      activityAdjustments: wizardData.activityAdjustments,
      dependencies: wizardData.dependencies,
      customDependencies: wizardData.customDependencies,
      complexity: wizardData.complexity,
      calculatedPoints: wizardData.calculatedPoints,
      finalPoints: wizardData.finalPoints,
      calculatedTShirtSize: wizardData.calculatedTShirtSize,
      finalTShirtSize: wizardData.finalTShirtSize,
      isOverridden: wizardData.isOverridden,
      isPointsOverridden: wizardData.isPointsOverridden,
      isTShirtOverridden: wizardData.isTShirtOverridden,
      overrideReason: wizardData.overrideReason,
      pointsOverrideReason: wizardData.pointsOverrideReason,
      tShirtOverrideReason: wizardData.tShirtOverrideReason,
      calculationBreakdown: generateBreakdown(wizardData)
    };

    const newHistory = [estimation, ...history];
    setHistory(newHistory);
    saveHistoryToStorage(newHistory);
    clearDraft();

    return estimation.id;
  };

  const loadEstimation = (id) => {
    const estimation = history.find(e => e.id === id);
    if (!estimation) return;

    // Clone estimation with new ID and timestamp
    setWizardData({
      ...estimation,
      id: undefined, // Will get new ID on save
      timestamp: undefined
    });
    setCurrentStep(1);
    setVisitedSteps([1]);
  };

  const deleteEstimation = (id) => {
    const newHistory = history.filter(e => e.id !== id);
    setHistory(newHistory);
    saveHistoryToStorage(newHistory);
  };

  const resetWizard = () => {
    setWizardData(initialWizardData);
    setCurrentStep(1);
    setVisitedSteps([1]);
    clearDraft();
  };

  const value = {
    wizardData,
    setWizardData,
    currentStep,
    goToStep,
    visitedSteps,
    history,
    calculatePoints,
    saveEstimation,
    loadEstimation,
    deleteEstimation,
    resetWizard
  };

  return (
    <EstimationContext.Provider value={value}>
      {children}
    </EstimationContext.Provider>
  );
}

export function useEstimation() {
  const context = useContext(EstimationContext);
  if (!context) {
    throw new Error('useEstimation must be used within EstimationProvider');
  }
  return context;
}
