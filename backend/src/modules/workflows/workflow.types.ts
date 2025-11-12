export interface CreateWorkflowInput {
  name: string;
  documentId: string;
  initiator: string;
  steps: {
    name: string;
    assignees: string[];
    dueDate?: string;
  }[];
}

export interface AdvanceWorkflowInput {
  workflowId: string;
  action: 'approve' | 'reject' | 'reassign';
  comments?: string;
  assignees?: string[];
}

