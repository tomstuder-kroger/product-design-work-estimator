import { useEstimation } from '../../context/EstimationContext';
import { STAGE_OPTIONS, PRIORITY_OPTIONS, ACCEPTANCE_CRITERIA_BY_STAGE } from '../../utils/constants';

export default function StepProjectInfo() {
  const { wizardData, setWizardData } = useEstimation();

  const updateField = (field, value) => {
    setWizardData(prev => ({ ...prev, [field]: value }));
  };

  const acConfig = ACCEPTANCE_CRITERIA_BY_STAGE[wizardData.stage];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Project Information</h2>
        <p className="text-gray-600 mt-1">Tell us about the work you're estimating</p>
      </div>

      <div>
        <label htmlFor="projectName" className="block text-sm font-medium text-gray-700 mb-1">
          Title / Summary <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="projectName"
          value={wizardData.projectName}
          onChange={(e) => updateField('projectName', e.target.value)}
          placeholder="e.g., Create onboarding journey map"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
        />
        {wizardData.projectName.length > 0 && wizardData.projectName.length < 3 && (
          <p className="text-red-500 text-sm mt-1">Minimum 3 characters required</p>
        )}
      </div>

      <div>
        <label htmlFor="teamMemberName" className="block text-sm font-medium text-gray-700 mb-1">
          Reporter <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="teamMemberName"
          value={wizardData.teamMemberName}
          onChange={(e) => updateField('teamMemberName', e.target.value)}
          placeholder="e.g., Jane Smith"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
        />
        {wizardData.teamMemberName.length === 0 && (
          <p className="text-gray-500 text-sm mt-1">Required field</p>
        )}
      </div>

      <div>
        <label htmlFor="assignee" className="block text-sm font-medium text-gray-700 mb-1">
          Assignee <span className="text-gray-500 text-sm">(optional)</span>
        </label>
        <input
          type="text"
          id="assignee"
          value={wizardData.assignee}
          onChange={(e) => updateField('assignee', e.target.value)}
          placeholder="Who will be assigned to this work?"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
        />
      </div>

      <div>
        <label htmlFor="portfolio" className="block text-sm font-medium text-gray-700 mb-1">
          Portfolio
        </label>
        <input
          type="text"
          id="portfolio"
          value={wizardData.portfolio}
          onChange={(e) => updateField('portfolio', e.target.value)}
          placeholder="e.g., Customer Experience"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
        />
      </div>

      <div>
        <label htmlFor="domainTeam" className="block text-sm font-medium text-gray-700 mb-1">
          Team <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="domainTeam"
          value={wizardData.domainTeam}
          onChange={(e) => updateField('domainTeam', e.target.value)}
          placeholder="e.g., F-ITEM-PIM Deprecation-Ready Set Deliver"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
        />
        {wizardData.domainTeam.length === 0 && (
          <p className="text-gray-500 text-sm mt-1">Required field</p>
        )}
      </div>

      <div>
        <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
          Priority <span className="text-red-500">*</span>
        </label>
        <select
          id="priority"
          value={wizardData.priority}
          onChange={(e) => updateField('priority', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
        >
          <option value="">Select priority...</option>
          {PRIORITY_OPTIONS.map((priority) => (
            <option key={priority} value={priority}>
              {priority}
            </option>
          ))}
        </select>
        {wizardData.priority === '' && (
          <p className="text-gray-500 text-sm mt-1">Required field</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Stage <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {STAGE_OPTIONS.map((stage) => (
            <button
              key={stage}
              type="button"
              onClick={() => updateField('stage', stage)}
              className={`p-4 border-2 rounded-lg transition-all font-medium ${
                wizardData.stage === stage
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-primary/40 bg-white text-primary hover:border-primary hover:bg-primary/5'
              }`}
            >
              <div>{stage}</div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="weeks" className="block text-sm font-medium text-gray-700 mb-1">
          Duration (Weeks) <span className="text-gray-500 text-sm">(optional)</span>
        </label>
        <input
          type="number"
          id="weeks"
          min="0"
          step="1"
          value={wizardData.weeks}
          onChange={(e) => updateField('weeks', e.target.value)}
          placeholder="e.g., 2"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
        />
        <p className="text-sm text-gray-500 mt-1">How many weeks allocated?</p>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description <span className="text-gray-500 text-sm">(optional)</span>
        </label>
        <textarea
          id="description"
          rows="3"
          maxLength="500"
          value={wizardData.description}
          onChange={(e) => updateField('description', e.target.value)}
          placeholder="Add any additional context..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
        />
        <p className="text-sm text-gray-500 mt-1">
          {wizardData.description.length}/500 characters
        </p>
      </div>

      {acConfig && (
        <div>
          <label htmlFor="acceptanceCriteria" className="block text-sm font-medium text-gray-700 mb-1">
            {acConfig.label}{' '}
            {acConfig.required ? (
              <span className="text-red-500">*</span>
            ) : (
              <span className="text-gray-500 text-sm">(optional)</span>
            )}
          </label>
          <textarea
            id="acceptanceCriteria"
            rows="5"
            value={wizardData.acceptanceCriteria}
            onChange={(e) => updateField('acceptanceCriteria', e.target.value)}
            placeholder="One criterion per line"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
          />
          {acConfig.required && wizardData.acceptanceCriteria.trim().length === 0 && (
            <p className="text-gray-500 text-sm mt-1">Required field</p>
          )}
          <div className="mt-2 text-sm text-gray-500">
            <p className="font-medium">Starter ideas:</p>
            <ul className="list-disc pl-5 mt-1 space-y-0.5">
              {acConfig.hints.map((hint) => (
                <li key={hint}>{hint}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <div className="pt-4">
        <p className="text-sm text-gray-600">
          <span className="text-red-500">*</span> Required fields
        </p>
      </div>
    </div>
  );
}

export { isStepValid as isStep1Valid };

function isStepValid(wizardData) {
  const acRequired = ACCEPTANCE_CRITERIA_BY_STAGE[wizardData.stage]?.required;
  return (
    wizardData.projectName.length >= 3 &&
    wizardData.teamMemberName.length > 0 &&
    wizardData.domainTeam.length > 0 &&
    wizardData.priority !== '' &&
    wizardData.stage !== '' &&
    (wizardData.weeks === '' || Number(wizardData.weeks) > 0) &&
    (!acRequired || (wizardData.acceptanceCriteria || '').trim().length > 0)
  );
}
