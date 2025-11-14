import { bulkUpsertLocalizationResources, deleteLocalizationResource, getLocalizationResources, } from './localization.service.js';
export const getLocalizationResourcesHandler = async (req, res) => {
    const result = await getLocalizationResources({
        language: req.query.lang?.toString(),
        namespace: req.query.namespace?.toString(),
    });
    res.status(200).json({
        success: true,
        data: result,
    });
};
export const upsertLocalizationResourcesHandler = async (req, res) => {
    const userId = req.user?.id;
    const payload = req.body;
    const resources = await bulkUpsertLocalizationResources(payload, userId);
    res.status(200).json({
        success: true,
        data: resources,
    });
};
export const deleteLocalizationResourceHandler = async (req, res) => {
    const { namespace, key, language } = req.params;
    await deleteLocalizationResource(namespace, key, language);
    res.status(204).send();
};
