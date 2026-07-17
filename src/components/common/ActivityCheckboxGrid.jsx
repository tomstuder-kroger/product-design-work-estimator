export default function ActivityCheckboxGrid({ activities, selected, onChange }) {
  const handleToggle = (activity) => {
    if (selected.includes(activity)) {
      onChange(selected.filter(a => a !== activity));
    } else {
      onChange([...selected, activity]);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
      {activities.map((activity) => (
        <label
          key={activity}
          className="flex items-start p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
        >
          <input
            type="checkbox"
            checked={selected.includes(activity)}
            onChange={() => handleToggle(activity)}
            className="mt-1 h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
          />
          <span className="ml-3 text-sm text-gray-900">{activity}</span>
        </label>
      ))}
    </div>
  );
}
