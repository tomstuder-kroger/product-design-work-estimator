import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEstimation } from '../../context/EstimationContext';
import { loadDraft, clearDraft } from '../../utils/storage';

export default function DraftRecoveryModal() {
  const [draft, setDraft] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const { setWizardData, goToStep } = useEstimation();
  const navigate = useNavigate();

  useEffect(() => {
    const savedDraft = loadDraft();
    if (savedDraft) {
      setDraft(savedDraft);
      setShowModal(true);
    }
  }, []);

  const handleResume = () => {
    if (draft) {
      setWizardData(draft.wizardData);
      goToStep(draft.currentStep);
      setShowModal(false);
      navigate('/');
    }
  };

  const handleStartFresh = () => {
    clearDraft();
    setShowModal(false);
  };

  if (!showModal || !draft) return null;

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return 'a few minutes ago';
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6 space-y-4">
        <h2 className="text-xl font-bold text-gray-900">Unsaved Estimation Found</h2>
        <p className="text-gray-600">
          You have an unsaved estimation from {formatDate(draft.lastSaved)}.
          Would you like to resume where you left off?
        </p>

        {draft.wizardData.projectName && (
          <div className="bg-gray-50 rounded p-3">
            <p className="text-sm text-gray-600">Title / Summary:</p>
            <p className="font-medium text-gray-900">{draft.wizardData.projectName}</p>
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={handleStartFresh}
            className="flex-1 btn-secondary"
          >
            Start Fresh
          </button>
          <button
            onClick={handleResume}
            className="flex-1 btn-primary"
          >
            Resume
          </button>
        </div>
      </div>
    </div>
  );
}
