import sharp from 'sharp';
import Media from '../models/Media.js';
import { signToken, verifyToken } from './tokenService.js';
import { config } from '../config/index.js';
import { ApiError, notFound } from '../utils/ApiError.js';
export async function uploadMedia(ownerId, file) {
  if (!file) throw new ApiError(422, 'IMAGE_REQUIRED', 'Choisissez une image.');
  let image;
  try {
    const source = sharp(file.buffer, { limitInputPixels: 25000000 });
    const metadata = await source.metadata();
    if (!['jpeg', 'png', 'webp'].includes(metadata.format) || (metadata.pages ?? 1) > 1) throw new Error('format');
    image = await source.rotate().resize(1600, 1600, { fit: 'inside', withoutEnlargement: true }).webp({ quality: 80 }).toBuffer();
  } catch { throw new ApiError(415, 'UNSUPPORTED_IMAGE', 'Utilisez une photo JPG, PNG ou WebP non animée.'); }
  if (image.length > 2 * 1024 * 1024) throw new ApiError(413, 'IMAGE_TOO_LARGE', 'Choisissez une image plus petite.');
  const media = await Media.create({ ownerId, data: image, size: image.length });
  return media._id;
}
export async function mediaUrl(id, auth) {
  if (!id) return '';
  const token = await signToken(auth.userId, auth.session, 'media', { mediaId: id });
  return `${config.PUBLIC_URL}/api/v1/media/${id}?token=${token}`;
}
export async function verifyOwnership(ownerId, ids, session) {
  const unique = [...new Set(ids.filter(Boolean))];
  if (!unique.length) return;
  const count = await Media.countDocuments({ _id: { $in: unique }, ownerId }).session(session ?? null);
  if (count !== unique.length) throw new ApiError(422, 'INVALID_MEDIA', 'Une photo n’appartient pas à votre atelier.');
}
export async function readMedia(id, token) {
  const auth = await verifyToken(token, 'media');
  if (auth.payload.mediaId !== id) throw notFound();
  const media = await Media.findOne({ _id: id, ownerId: auth.userId }).select('+data');
  if (!media) throw notFound();
  return media;
}
