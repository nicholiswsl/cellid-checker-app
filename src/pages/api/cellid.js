// src/pages/api/cellid.js
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { mcc, radioType, mnc, lac, cid } = req.query;

  if (!mcc || !radioType || !mnc || !lac || !cid) {
    return res.status(400).json({ message: 'Missing MCC, MNC, LAC, or CID' });
  }

  const UNWIREDLABS_API_KEY = process.env.UNWIREDLABS_API_KEY;
  const apiUrl = `https://ap1.unwiredlabs.com/v2/process`;

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: UNWIREDLABS_API_KEY,
        radio: parseInt(radioType), // or "lte", "wcdma", "cdma" - sesuaikan dengan jenis sel
        mcc: parseInt(mcc),
        mnc: parseInt(mnc),
        cells: [{ lac: parseInt(lac), cid: parseInt(cid) }],
        address: 1 // Untuk mendapatkan alamat yang readable
      }),
    });

    const data = await response.json();

    if (response.ok) {
      res.status(200).json(data);
    } else {
      res.status(response.status).json({ message: data.message || 'Error from Unwired Labs API' });
    }
  } catch (error) {
    console.error('Error fetching data from Unwired Labs:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}