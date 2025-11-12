import { Op, type WhereOptions } from 'sequelize';

import { DocumentModel, DocumentVersionModel } from '@modules/documents/document.model.js';
import { toManagedDocument } from '@modules/documents/document.service.js';

interface SearchFilters {
  q: string;
  owner?: string;
  type?: string;
  status?: string;
  limit: number;
}

export const searchDocuments = async (filters: SearchFilters) => {
  const where: WhereOptions = {};

  if (filters.owner) {
    Object.assign(where, { owner: filters.owner });
  }

  if (filters.type) {
    Object.assign(where, { type: filters.type });
  }

  if (filters.status) {
    Object.assign(where, { status: filters.status });
  }

  if (filters.q) {
    const pattern = `%${filters.q}%`;
    Object.assign(where, {
      [Op.or]: [
        { title: { [Op.like]: pattern } },
        { type: { [Op.like]: pattern } },
        { category: { [Op.like]: pattern } },
        { owner: { [Op.like]: pattern } },
        { department: { [Op.like]: pattern } },
      ],
    });
  }

  const documents = await DocumentModel.findAll({
    where,
    include: [
      {
        model: DocumentVersionModel,
        as: 'versions',
      },
    ],
    order: [
      ['updatedAt', 'DESC'],
      [{ model: DocumentVersionModel, as: 'versions' }, 'versionNumber', 'ASC'],
    ],
    limit: filters.limit,
  });

  return documents.map(toManagedDocument);
};

