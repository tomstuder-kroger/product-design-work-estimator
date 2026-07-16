import { COMPLEXITY_LEVELS } from '../../utils/constants';

export default function ComplexitySelector({ dimension, value, onChange }) {
  const levels = ['Low', 'Medium', 'High'];

  return (
    <div className="space-y-3">
      <div>
        <h3 className="text-lg font-medium text-gray-900">
          {dimension.label}
          {dimension.required && <span className="text-red-500 ml-1">*</span>}
        </h3>
        <p className="text-sm text-gray-600 mt-1">{dimension.question}</p>
      </div>

      <div className="flex gap-2">
        {levels.map((level) => (
          <button
            key={level}
            type="button"
            onClick={() => onChange(level)}
            className={`flex-1 px-4 py-3 rounded-lg border-2 transition-all ${
              value === level
                ? 'border-blue-600 bg-blue-50 text-blue-900 font-medium'
                : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
            }`}
          >
            <div className="font-medium">{level}</div>
            <div className="text-xs mt-1">
              {COMPLEXITY_LEVELS[level][dimension.key]}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
