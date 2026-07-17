export default function ActivityWithWeight({
  activity,
  isSelected,
  onToggle,
  adjustment = 0,
  onAdjustment
}) {
  const getAdjustmentLabel = () => {
    if (adjustment === -1) return 'Less Complex';
    if (adjustment === 1) return 'More Complex';
    return 'Typical';
  };

  const getAdjustmentStyle = () => {
    if (adjustment === -1) return 'text-success border-success';
    if (adjustment === 1) return 'text-warning border-warning';
    return 'text-gray-600 border-gray-300';
  };

  const handleDecrease = () => {
    if (adjustment > -1) {
      onAdjustment(activity.name, adjustment - 1);
    }
  };

  const handleIncrease = () => {
    if (adjustment < 1) {
      onAdjustment(activity.name, adjustment + 1);
    }
  };

  return (
    <div className="flex flex-col p-3 border rounded-lg hover:bg-gray-50 transition-colors">
      <label className="flex items-start cursor-pointer">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onToggle(activity.name)}
          className="mt-1 h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
        />
        <span className="ml-3 text-sm text-gray-900 flex-1">{activity.name}</span>
      </label>

      {isSelected && (
        <div className="mt-2 ml-7 flex items-center gap-2">
          <button
            type="button"
            onClick={handleDecrease}
            disabled={adjustment === -1}
            className="w-6 h-6 flex items-center justify-center border rounded bg-white hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed text-sm font-bold"
            aria-label="Less complex"
          >
            −
          </button>

          <span className={`text-xs font-medium px-2 py-1 border rounded ${getAdjustmentStyle()}`}>
            {getAdjustmentLabel()}
          </span>

          <button
            type="button"
            onClick={handleIncrease}
            disabled={adjustment === 1}
            className="w-6 h-6 flex items-center justify-center border rounded bg-white hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed text-sm font-bold"
            aria-label="More complex"
          >
            +
          </button>
        </div>
      )}
    </div>
  );
}
