import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { code } = req.query;

  if (!code) {
    return res.status(400).json({ error: 'No code provided' });
  }

  try {
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        client_id: process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      }),
    });

    const data = await tokenResponse.json();
    
    // Store the token securely
    res.setHeader(
      'Set-Cookie',
      `github_token=${data.access_token}; Path=/; HttpOnly; Secure; SameSite=Strict`
    );

    // Return a success page that closes itself
    res.send(`
      <html>
        <body>
          <script>
            window.opener.postMessage({ type: 'github-auth-success' }, '*');
            window.close();
          </script>
          Authentication successful! You can close this window.
        </body>
      </html>
    `);
  } catch (error) {
    console.error('Error exchanging code for token:', error);
    res.status(500).send(`
      <html>
        <body>
          <script>
            window.opener.postMessage({ type: 'github-auth-error' }, '*');
            window.close();
          </script>
          Authentication failed. You can close this window.
        </body>
      </html>
    `);
  }
} 