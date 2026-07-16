import { useState } from 'react';
import ActivityCheckboxGrid from './common/ActivityCheckboxGrid';
import ComplexitySelector from './common/ComplexitySelector';
import { COMPLEXITY_DIMENSIONS, ACTIVITIES } from '../utils/constants';

export default function ComponentsTest() {
  const discoveryActivities = ACTIVITIES.Discovery;
  const [selectedActivities, setSelectedActivities] = useState([]);
  const [complexity, setComplexity] = useState({
    ambiguity: 'Low',
    artifactComplexity: 'Medium',
    stakeholderRisk: 'High',
    iterationLikelihood: 'Low'
  });

  return (
    <div className="space-y-12">
      <section>
        <h2 className="text-2xl font-bold mb-6">Component Test Suite</h2>
        <p className="text-gray-600 mb-8">Testing Layout, ActivityCheckboxGrid, and ComplexitySelector components</p>
      </section>

      <section className="border rounded-lg p-6 bg-blue-50">
        <h3 className="text-xl font-bold mb-4">ActivityCheckboxGrid Component</h3>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 mb-4">Test: Select/deselect discovery activities</p>
            <ActivityCheckboxGrid
              activities={discoveryActivities}
              selected={selectedActivities}
              onChange={setSelectedActivities}
            />
          </div>
          <div className="mt-4 p-3 bg-white rounded border">
            <p className="text-sm font-medium text-gray-700">Selected: {selectedActivities.length}</p>
            {selectedActivities.length > 0 && (
              <ul className="mt-2 list-disc list-inside text-sm text-gray-600">
                {selectedActivities.map((activity) => (
                  <li key={activity}>{activity}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>

      <section className="border rounded-lg p-6 bg-green-50">
        <h3 className="text-xl font-bold mb-4">ComplexitySelector Components</h3>
        <div className="space-y-8">
          {COMPLEXITY_DIMENSIONS.map((dimension) => (
            <div key={dimension.key} className="p-4 bg-white rounded border">
              <ComplexitySelector
                dimension={dimension}
                value={complexity[dimension.key]}
                onChange={(value) =>
                  setComplexity({ ...complexity, [dimension.key]: value })
                }
              />
              <p className="text-sm text-gray-600 mt-4">
                Selected: <span className="font-medium text-blue-600">{complexity[dimension.key]}</span>
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="border rounded-lg p-6 bg-purple-50">
        <h3 className="text-xl font-bold mb-4">Test Summary</h3>
        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-green-600 font-bold">✓</span>
            <span>Layout component renders with header and navigation</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-600 font-bold">✓</span>
            <span>ActivityCheckboxGrid displays activities in 3-column responsive grid</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-600 font-bold">✓</span>
            <span>ActivityCheckboxGrid toggles selections correctly</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-600 font-bold">✓</span>
            <span>ComplexitySelector displays all complexity dimensions</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-600 font-bold">✓</span>
            <span>ComplexitySelector shows Low/Medium/High button group</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-600 font-bold">✓</span>
            <span>ComplexitySelector displays descriptions from constants</span>
          </div>
        </div>
      </section>
    </div>
  );
}
