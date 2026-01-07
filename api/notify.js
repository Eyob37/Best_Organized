import webpush from 'web-push';

const publicKey = process.env.PUBLIC_VAPID_KEY;
const privateKey = process.env.PRIVATE_VAPID_KEY;

webpush.setVapidDetails(
  'mailto:test@example.com',
  publicKey,
  privateKey
);

export default async function handler(req, res) {
  const payload = JSON.stringify({
    title: 'Internet Back 🌐',
    body: 'Connection restored successfully'
  });

  try {
    await webpush.sendNotification(global.subscription, payload);
    res.status(200).json({ sent: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}