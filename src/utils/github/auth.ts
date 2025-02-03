import { SignJWT } from 'jose';

export async function generateGitHubAppJWT(appId: string, privateKey: string): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  
  try {
    // Convert PEM private key to Uint8Array
    const encoder = new TextEncoder();
    const privateKeyBytes = encoder.encode(privateKey);

    // Create and sign the JWT
    const token = await new SignJWT({
      iat: now - 60, // Issued 60 seconds ago to account for clock drift
      exp: now + (10 * 60), // Expires in 10 minutes
      iss: appId
    })
      .setProtectedHeader({ alg: 'RS256' })
      .sign(privateKeyBytes);

    return token;
  } catch (error) {
    console.error('Error generating GitHub App JWT:', error);
    throw new Error('Failed to generate GitHub App JWT');
  }
}

export async function getGitHubAppInstallations(jwt: string) {
  try {
    const response = await fetch('https://api.github.com/app/installations', {
      headers: {
        'Accept': 'application/vnd.github+json',
        'Authorization': `Bearer ${jwt}`,
        'X-GitHub-Api-Version': '2022-11-28'
      }
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching GitHub App installations:', error);
    throw error;
  }
}