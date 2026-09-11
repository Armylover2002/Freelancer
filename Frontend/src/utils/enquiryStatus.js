export const STATUS_LABELS = {
  NEW: 'New',
  CONTACTED: 'Contacted',
  DISCOVERY_CALL: 'Discovery Call',
  PROPOSAL_SENT: 'Proposal Sent',
  NEGOTIATION: 'Negotiation',
  WON: 'Won',
  LOST: 'Lost',
  PROJECT: 'Project',
};

export const ENQUIRY_STATUS_ORDER = [
  'NEW',
  'CONTACTED',
  'DISCOVERY_CALL',
  'PROPOSAL_SENT',
  'NEGOTIATION',
  'WON',
  'LOST',
  'PROJECT',
];

// Customer-facing explanation of each stage, shown on the public "Track Your Request" page.
export const STATUS_CUSTOMER_MESSAGES = {
  NEW: "We've received your request and our team is reviewing it.",
  CONTACTED: "We've reached out to you to discuss your project further.",
  DISCOVERY_CALL: 'A discovery call has been scheduled or completed to understand your requirements in detail.',
  PROPOSAL_SENT: "We've sent you a proposal covering scope, pricing and timeline.",
  NEGOTIATION: "We're finalizing the scope and commercial details with you.",
  WON: 'Your project has been confirmed - welcome aboard! Our team will be in touch about next steps.',
  LOST: 'This request is not moving forward at this time. Feel free to reach out if anything changes.',
  PROJECT: 'Your project is now in active development.',
};
