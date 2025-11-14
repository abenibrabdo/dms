import { sequelize } from '@core/database.js';
import { NotFoundError } from '@core/errors.js';
import { LocalizationResourceModel, } from './localization.model.js';
export const getLocalizationResources = async (query) => {
    const where = {};
    if (query.language) {
        where.language = query.language;
    }
    if (query.namespace) {
        where.namespace = query.namespace;
    }
    const resources = await LocalizationResourceModel.findAll({
        where,
        order: [
            ['namespace', 'ASC'],
            ['language', 'ASC'],
            ['key', 'ASC'],
        ],
    });
    const grouped = resources.reduce((acc, resource) => {
        const ns = resource.namespace;
        if (!acc[ns]) {
            acc[ns] = {};
        }
        acc[ns][resource.key] = resource.value;
        return acc;
    }, {});
    return {
        language: query.language ?? null,
        namespaces: Object.keys(grouped),
        resources: grouped,
    };
};
export const upsertLocalizationResource = async (payload, updatedBy) => {
    const [resource] = await LocalizationResourceModel.upsert({
        namespace: payload.namespace,
        key: payload.key,
        language: payload.language,
        value: payload.value,
        description: payload.description,
        updatedBy,
    }, {
        returning: true,
        conflictFields: ['namespace', 'key', 'language'],
    });
    return resource.get({ plain: true });
};
export const bulkUpsertLocalizationResources = async (payload, updatedBy) => {
    return sequelize.transaction(async (transaction) => {
        const results = [];
        for (const entry of payload) {
            const [resource] = await LocalizationResourceModel.upsert({
                namespace: entry.namespace,
                key: entry.key,
                language: entry.language,
                value: entry.value,
                description: entry.description,
                updatedBy,
            }, {
                returning: true,
                conflictFields: ['namespace', 'key', 'language'],
                transaction,
            });
            results.push(resource.get({ plain: true }));
        }
        return results;
    });
};
export const deleteLocalizationResource = async (namespace, key, language) => {
    const deleted = await LocalizationResourceModel.destroy({
        where: { namespace, key, language },
    });
    if (!deleted) {
        throw new NotFoundError('Localization resource not found');
    }
};
