import { AccessControlModel, type AccessControlType } from './access-control.model.js';

export const listAccessControls = async () => {
  const rows = await AccessControlModel.findAll({ order: [['type', 'ASC'], ['value', 'ASC']] });
  const byType: Record<AccessControlType, string[]> = {
    allowedIp: [],
    blockedIp: [],
    allowedDevice: [],
  };
  rows.forEach((r) => byType[r.type].push(r.value));
  return byType;
};

export const replaceAccessControls = async (
  input: Partial<Record<AccessControlType, string[]>>, createdBy?: string,
) => {
  const entries: Array<{ type: AccessControlType; value: string; createdBy?: string }> = [];
  (input.allowedIp ?? []).forEach((v) => entries.push({ type: 'allowedIp', value: v, createdBy }));
  (input.blockedIp ?? []).forEach((v) => entries.push({ type: 'blockedIp', value: v, createdBy }));
  (input.allowedDevice ?? []).forEach((v) => entries.push({ type: 'allowedDevice', value: v, createdBy }));
  await AccessControlModel.destroy({ where: {} });
  if (entries.length) await AccessControlModel.bulkCreate(entries);
  return listAccessControls();
};

export const isDeniedByAccessControls = async (ip?: string, deviceId?: string) => {
  const lists = await listAccessControls();
  if (lists.blockedIp?.length && ip && lists.blockedIp.includes(ip)) return true;
  if (lists.allowedIp?.length && ip && !lists.allowedIp.includes(ip)) return true;
  if (lists.allowedDevice?.length && (!deviceId || !lists.allowedDevice.includes(deviceId))) return true;
  return false;
};

