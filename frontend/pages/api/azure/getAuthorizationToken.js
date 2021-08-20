const tokenEndpoint = `https://${process.env.NEXT_PUBLIC_AZURE_REGION}.api.cognitive.microsoft.com/sts/v1.0/issuetoken`
const azureSubscriptionKey = process.env.AZURE_SUBSCRIPTION_KEY

export default async function getAuthorizationToken(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET'])
    return res.status(405).end(`Method ${req.method} Not Allowed`)
  }

  try {
    // TODO: add session verification
    const response = await fetch(tokenEndpoint, {
      method: 'POST',
      headers: {
        'Ocp-Apim-Subscription-Key': azureSubscriptionKey,
      },
    })

    const authorizationToken = await response.text()

    res.status(200).json({ token: authorizationToken })
  } catch (error) {
    const statusCode = error?.statusCode ?? 500

    return res.status(statusCode).json({ message: error.error, error })
  }
}
