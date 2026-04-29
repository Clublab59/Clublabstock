export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    let bodyData = req.body;
    
    if (!bodyData) {
      const buffers = [];
      for await (const chunk of req) {
        buffers.push(chunk);
      }
      bodyData = JSON.parse(Buffer.concat(buffers).toString());
    }
    
    if (typeof bodyData === 'string') {
      bodyData = JSON.parse(bodyData);
    }

    const { method, path, key, body } = bodyData;

    const response = await fetch('https://api.notion.com/v1' + path, {
      method: method || 'GET',
      headers: {
        'Authorization': 'Bearer ' + key,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json'
      },
      body: body ? JSON.stringify(body) : undefined
    });

    const data = await response.json();
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
