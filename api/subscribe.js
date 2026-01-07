import webpush from 'web-push';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  // TEMP: in real app save to DB
  global.subscription = req.body;

  res.status(201).json({ success: true });
}