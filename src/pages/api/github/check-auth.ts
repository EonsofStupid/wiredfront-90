import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = req.cookies.github_token;
  
  if (!token) {
    return res.json({ authenticated: false });
  }

  try {
    // Verify the token with GitHub
    const response = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    res.json({ authenticated: response.ok });
  } catch (error) {
    res.json({ authenticated: false });
  }
} 