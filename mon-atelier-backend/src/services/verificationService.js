import { config } from '../config/index.js';
import { ApiError } from '../utils/ApiError.js';
export const verificationProvider = {
  async send(phone, code) {
    console.log(config)
    if (!config.TWILIO_ACCOUNT_SID || !config.TWILIO_AUTH_TOKEN || !config.TWILIO_WHATSAPP_FROM || !config.TWILIO_WHATSAPP_CONTENT_SID) {
      throw new ApiError(503, 'WHATSAPP_NOT_CONFIGURED', 'Le service WhatsApp n’est pas encore configuré.');
    }
    let response;
    try {
      response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${encodeURIComponent(config.TWILIO_ACCOUNT_SID)}/Messages.json`, {
        method: 'POST',
        headers: {
          Authorization: `Basic ${Buffer.from(`${config.TWILIO_ACCOUNT_SID}:${config.TWILIO_AUTH_TOKEN}`).toString('base64')}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          To: `whatsapp:+225${phone}`,
          From: config.TWILIO_WHATSAPP_FROM,
          ContentSid: config.TWILIO_WHATSAPP_CONTENT_SID,
          ContentVariables: JSON.stringify({ '1': code }),
        }),
        signal: AbortSignal.timeout(15000),
      });
    } catch {
      throw new ApiError(503, 'WHATSAPP_UNAVAILABLE', 'Le service WhatsApp est temporairement indisponible.');
    }
    if (response.status === 429) throw new ApiError(429, 'WHATSAPP_RATE_LIMITED', 'Trop de tentatives WhatsApp. Réessayez plus tard.');
    if (!response.ok) throw new ApiError(503, 'WHATSAPP_UNAVAILABLE', 'Le code n’a pas pu être envoyé sur WhatsApp. Réessayez.');
  },
};
