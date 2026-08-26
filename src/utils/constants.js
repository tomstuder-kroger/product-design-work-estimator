// OLD STRUCTURE (preserved for reference during migration):
// export const ACTIVITIES = {
//   Discovery: [
//     'Research planning',
//     'Competitive analysis',
//     'Stakeholder interviews',
//     'User interviews (3-5)',
//     'User interviews (6-10)',
//     'Surveys',
//     'Usability studies',
//     'Diary study',
//     'Journey map creation',
//     'Service blueprint creation',
//     'Persona creation/update',
//     'Opportunity mapping',
//     'Research synthesis & readout'
//   ],
//   Define: [
//     'Problem statement writing',
//     'How Might We questions',
//     'Opportunity mapping',
//     'Assumption/risk mapping',
//     'Prioritization workshop',
//     'Story map creation',
//     'MVP definition',
//     'Experience principles definition',
//     'Success metrics definition',
//     'Design brief creation'
//   ],
//   Design: [
//     'User flow creation',
//     'Wireframing (low-fidelity)',
//     'Wireframing (high-fidelity)',
//     'Information architecture',
//     'UI mockups (existing patterns)',
//     'UI mockups (new patterns)',
//     'Clickable prototype',
//     'Multi-platform design (responsive)',
//     'Accessibility review',
//     'Content design',
//     'Design system work',
//     'Design handoff/specs'
//   ]
// };

export const ACTIVITIES_DATA = [
  // Discovery - Looking/Research & Strategic Synthesis
  { name: 'Research planning', defaultWeight: 1, stage: 'Discovery', category: 'Looking/Research' },
  { name: 'Competitive analysis', defaultWeight: 1, stage: 'Discovery', category: 'Looking/Research' },
  { name: 'Stakeholder interviews', defaultWeight: 1, stage: 'Discovery', category: 'Looking/Research' },
  { name: 'User interviews', defaultWeight: 2, stage: 'Discovery', category: 'Looking/Research' },
  { name: 'Surveys', defaultWeight: 1, stage: 'Discovery', category: 'Looking/Research' },
  { name: 'Usability studies', defaultWeight: 2, stage: 'Discovery', category: 'Looking/Research' },
  { name: 'Diary study', defaultWeight: 3, stage: 'Discovery', category: 'Looking/Research' },
  { name: 'Journey map creation', defaultWeight: 3, stage: 'Discovery', category: 'Understanding/Synthesis' },
  { name: 'Persona creation/update', defaultWeight: 2, stage: 'Discovery', category: 'Understanding/Synthesis' },
  { name: 'Opportunity mapping', defaultWeight: 2, stage: 'Discovery', category: 'Understanding/Synthesis' },
  { name: 'Research synthesis & readout', defaultWeight: 3, stage: 'Discovery', category: 'Understanding/Synthesis' },
  { name: 'Contextual inquiry', defaultWeight: 3, stage: 'Discovery', category: 'Looking/Research' },
  { name: 'User & market landscape exploration', defaultWeight: 3, stage: 'Discovery', category: 'Looking/Research' },
  { name: 'Feasibility & risk assessment', defaultWeight: 3, stage: 'Discovery', category: 'Understanding/Synthesis' },
  { name: 'Object Oriented Design (Data-Focused Generative Design)', defaultWeight: 3, stage: 'Discovery', category: 'Understanding/Synthesis' },
  { name: 'Gigamap', defaultWeight: 3, stage: 'Discovery', category: 'Understanding/Synthesis' },
  { name: 'Service blueprint', defaultWeight: 3, stage: 'Discovery', category: 'Understanding/Synthesis' },
  { name: 'Ecosystem Map', defaultWeight: 3, stage: 'Discovery', category: 'Understanding/Synthesis' },
  { name: 'Dependency Map', defaultWeight: 3, stage: 'Discovery', category: 'Understanding/Synthesis' },
  { name: 'Stakeholder Mapping', defaultWeight: 3, stage: 'Discovery', category: 'Understanding/Synthesis' },
  { name: 'Problem framing', defaultWeight: 3, stage: 'Discovery', category: 'Understanding/Synthesis' },
  { name: 'Brainstorm session', defaultWeight: 1, stage: 'Discovery', category: 'Understanding/Synthesis' },
  // Define - Strategic Planning & Framing
  { name: 'Problem statement writing', defaultWeight: 2, stage: 'Define', category: 'Understanding/Synthesis' },
  { name: 'How Might We questions', defaultWeight: 1, stage: 'Define', category: 'Understanding/Synthesis' },
  { name: 'Opportunity mapping', defaultWeight: 2, stage: 'Define', category: 'Understanding/Synthesis' },
  { name: 'Assumption/risk mapping', defaultWeight: 1, stage: 'Define', category: 'Understanding/Synthesis' },
  { name: 'Prioritization workshop', defaultWeight: 2, stage: 'Define', category: 'Understanding/Synthesis' },
  { name: 'Story map creation', defaultWeight: 2, stage: 'Define', category: 'Understanding/Synthesis' },
  { name: 'MVP definition', defaultWeight: 3, stage: 'Define', category: 'Understanding/Synthesis' },
  { name: 'Experience principles definition', defaultWeight: 2, stage: 'Define', category: 'Understanding/Synthesis' },
  { name: 'Success metrics definition', defaultWeight: 2, stage: 'Define', category: 'Understanding/Synthesis' },
  { name: 'Design brief creation', defaultWeight: 3, stage: 'Define', category: 'Understanding/Synthesis' },
  { name: 'User Flow Current / Desired State', defaultWeight: 2, stage: 'Define', category: 'Understanding/Synthesis' },
  { name: 'Jobs to be Done', defaultWeight: 2, stage: 'Define', category: 'Understanding/Synthesis' },
  { name: 'Painpoint Analysis', defaultWeight: 2, stage: 'Define', category: 'Understanding/Synthesis' },
  { name: 'User Story Mapping', defaultWeight: 2, stage: 'Define', category: 'Understanding/Synthesis' },
  { name: 'Data Mapping', defaultWeight: 2, stage: 'Define', category: 'Understanding/Synthesis' },
  { name: 'Visioning workshop', defaultWeight: 3, stage: 'Define', category: 'Understanding/Synthesis' },
  { name: 'Stakeholder interviews/alignment', defaultWeight: 3, stage: 'Define', category: 'Executing/Relationship Management' },
  { name: 'Design Leadership Review', defaultWeight: 3, stage: 'Define', category: 'Executing/Relationship Management' },
  { name: 'Brainstorm session', defaultWeight: 1, stage: 'Define', category: 'Understanding/Synthesis' },
  // Design - Making/Prototyping & Validation
  { name: 'User flow creation', defaultWeight: 2, stage: 'Design', category: 'Making/Prototyping' },
  { name: 'Wireframing', defaultWeight: 2, stage: 'Design', category: 'Making/Prototyping' },
  { name: 'Information architecture', defaultWeight: 2, stage: 'Design', category: 'Making/Prototyping' },
  { name: 'UI mockups', defaultWeight: 2, stage: 'Design', category: 'Making/Prototyping' },
  { name: 'Clickable prototype', defaultWeight: 2, stage: 'Design', category: 'Making/Prototyping' },
  { name: 'Multi-platform design (responsive)', defaultWeight: 3, stage: 'Design', category: 'Making/Prototyping' },
  { name: 'Accessibility review', defaultWeight: 2, stage: 'Design', category: 'Making/Prototyping' },
  { name: 'Content design', defaultWeight: 1, stage: 'Design', category: 'Making/Prototyping' },
  { name: 'Design system work', defaultWeight: 3, stage: 'Design', category: 'Making/Prototyping' },
  { name: 'Design handoff/specs', defaultWeight: 2, stage: 'Design', category: 'Executing/Relationship Management' },
  { name: 'AI Prototyping / Vibe Coding', defaultWeight: 2, stage: 'Design', category: 'Making/Prototyping' },
  { name: 'New pattern design', defaultWeight: 2, stage: 'Design', category: 'Making/Prototyping' },
  { name: 'Initial vision concepts', defaultWeight: 3, stage: 'Design', category: 'Making/Prototyping' },
  { name: 'Concept Poster', defaultWeight: 3, stage: 'Design', category: 'Making/Prototyping' },
  { name: 'Vision documentation', defaultWeight: 3, stage: 'Design', category: 'Executing/Relationship Management' },
  { name: 'Concept Testing', defaultWeight: 2, stage: 'Design', category: 'Looking/Research' },
  { name: 'Usability Testing', defaultWeight: 2, stage: 'Design', category: 'Looking/Research' },
  { name: 'A/B testing', defaultWeight: 2, stage: 'Design', category: 'Looking/Research' },
  { name: 'Documentation creation or updating', defaultWeight: 2, stage: 'Design', category: 'Executing/Relationship Management' },
  { name: 'UX review tasks for dev team', defaultWeight: 1, stage: 'Design', category: 'Executing/Relationship Management' },
  { name: 'Regular Stakeholder Updates', defaultWeight: 3, stage: 'Design', category: 'Executing/Relationship Management' },
  { name: 'Design Leadership Review', defaultWeight: 3, stage: 'Design', category: 'Executing/Relationship Management' },
  { name: 'Brainstorm session', defaultWeight: 1, stage: 'Design', category: 'Understanding/Synthesis' },
];

/**
 * Get all activities for a specific stage
 * @param {string} stage - 'Discovery', 'Define', or 'Design'
 * @returns {Array} Array of activity objects for that stage
 */
export function getActivitiesByStage(stage) {
  return ACTIVITIES_DATA.filter(activity => activity.stage === stage);
}

export const COMPLEXITY_LEVELS = {
  Low: {
    value: 1,
    label: 'Low',
    ambiguity: 'Problem/solution is well understood',
    artifactComplexity: 'Simple update or single artifact',
    stakeholderRisk: 'Single decision-maker, clear ownership',
    iterationLikelihood: 'Clear requirements, low revision risk'
  },
  Medium: {
    value: 2,
    label: 'Medium',
    ambiguity: 'Some unknowns remain',
    artifactComplexity: 'Multiple artifacts or synthesis required',
    stakeholderRisk: 'Multiple reviewers or teams',
    iterationLikelihood: 'Moderate iteration expected'
  },
  High: {
    value: 3,
    label: 'High',
    ambiguity: 'Significant uncertainty or poorly understood',
    artifactComplexity: 'Cross-journey, system-level, or highly detailed',
    stakeholderRisk: 'Many stakeholders, org dependencies',
    iterationLikelihood: 'Multiple rounds likely, evolving requirements'
  }
};

export const STORY_POINT_SCALE = [1, 2, 3, 5, 8, 13];

export const STAGE_COLORS = {
  Discovery: '#3B82F6',
  Define: '#8B5CF6',
  Design: '#10B981'
};

export const STAGE_OPTIONS = ['Discovery', 'Define', 'Design'];

export const COMPLEXITY_DIMENSIONS = [
  {
    key: 'ambiguity',
    label: 'Problem/Solution Ambiguity',
    question: 'How well-defined is the problem or solution?',
    required: true
  },
  {
    key: 'artifactComplexity',
    label: 'Artifact/Deliverable Complexity',
    question: 'How complex are the artifacts or deliverables?',
    required: true
  },
  {
    key: 'stakeholderRisk',
    label: 'Stakeholder/Dependency Risk',
    question: 'How complex is stakeholder alignment and dependencies?',
    required: true
  },
  {
    key: 'iterationLikelihood',
    label: 'Iteration Likelihood',
    question: 'How likely is significant iteration?',
    required: false
  }
];

export const PRIORITY_OPTIONS = ['High', 'Medium', 'Low'];

export const DEPENDENCY_OPTIONS = [
  'Service Designer',
  'Researcher',
  'Shared Services',
  'Another Designer'
];
