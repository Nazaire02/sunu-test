import Workshop from '../models/Workshop.js';
import User from '../models/User.js';
import { ApiError } from '../utils/ApiError.js';
import { verifyOwnership } from './mediaService.js';
export function getWorkshop(ownerId) { return Workshop.findOne({ ownerId }); }
export async function requireWorkshop(ownerId) { const workshop = await getWorkshop(ownerId); if (!workshop) throw new ApiError(409, 'WORKSHOP_REQUIRED', 'Créez votre atelier pour continuer.'); return workshop; }
export async function saveWorkshop(ownerId, input) {
  const user = await User.findById(ownerId);
  if (!user || user.phone !== input.phone) throw new ApiError(422, 'PHONE_MISMATCH', 'Utilisez le numéro vérifié de votre compte.');
  await verifyOwnership(ownerId, [input.logo]);
  return Workshop.findOneAndUpdate({ ownerId }, { $set: input, $setOnInsert: { ownerId } }, { upsert: true, returnDocument: 'after', runValidators: true });
}
