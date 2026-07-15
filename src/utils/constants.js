export const ACTIVITIES = {
  Discovery: [
    'Research planning',
    'Competitive analysis',
    'Stakeholder interviews',
    'User interviews (3-5)',
    'User interviews (6-10)',
    'Surveys',
    'Usability studies',
    'Diary study',
    'Journey map creation',
    'Service blueprint creation',
    'Persona creation/update',
    'Opportunity mapping',
    'Research synthesis & readout'
  ],
  Define: [
    'Problem statement writing',
    'How Might We questions',
    'Opportunity mapping',
    'Assumption/risk mapping',
    'Prioritization workshop',
    'Story map creation',
    'MVP definition',
    'Experience principles definition',
    'Success metrics definition',
    'Design brief creation'
  ],
  Design: [
    'User flow creation',
    'Wireframing (low-fidelity)',
    'Wireframing (high-fidelity)',
    'Information architecture',
    'UI mockups (existing patterns)',
    'UI mockups (new patterns)',
    'Clickable prototype',
    'Multi-platform design (responsive)',
    'Accessibility review',
    'Content design',
    'Design system work',
    'Design handoff/specs'
  ]
};

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
