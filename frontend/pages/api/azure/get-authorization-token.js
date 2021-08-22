import { externalClient } from '../../../utils/api-client'
import { getSession } from 'next-auth/client'

const tokenEndpoint = `https://${process.env.NEXT_PUBLIC_AZURE_REGION}.api.cognitive.microsoft.com/sts/v1.0/issuetoken`
const azureSubscriptionKey = process.env.AZURE_SUBSCRIPTION_KEY

export default async function getAuthorizationToken(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET'])
    return res.status(405).end(`Method ${req.method} Not Allowed`)
  }

  try {
    // make sure the user is logged in
    const session = await getSession({ req })
    if (!session) {
      const error = new Error('Unauthenticated')
      error.statusCode = 401
      throw error
    }

    const { data } = await externalClient.post(tokenEndpoint, null, {
      headers: {
        'Ocp-Apim-Subscription-Key': azureSubscriptionKey,
      },
    })

    res.status(200).json({ token: data })
  } catch (error) {
    const statusCode = error?.statusCode ?? 500

    return res.status(statusCode).json({ message: error.error, error })
  }
}
