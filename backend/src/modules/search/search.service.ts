import { DocumentModel } from '@modules/documents/document.model.js';

interface SearchFilters {
  q: string;
  owner?: string;
  type?: string;
  status?: string;
  limit: number;
}

export const searchDocuments = async (filters: SearchFilters) => {
  const query: Record<string, unknown> = {};

  if (filters.q) {
    query.$text = { $search: filters.q };
  }

  if (filters.owner) {
    query['metadata.owner'] = filters.owner;
  }

  if (filters.type) {
    query['metadata.type'] = filters.type;
  }

  if (filters.status) {
    query['metadata.status'] = filters.status;
  }

  const projection = filters.q ? { score: { $meta: 'textScore' } } : {};

  const documents = await DocumentModel.find(query, projection)
    .sort(filters.q ? { score: { $meta: 'textScore' } } : { updatedAt: -1 })
    .limit(filters.limit)
    .lean();

  return documents;
};

