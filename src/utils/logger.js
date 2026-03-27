import db from '../db';

export async function addLog(action, type = 'INFO', details = '') {
  await db.logs.add({
    timestamp: new Date().toISOString(),
    action,
    type,
    details
  });
}