import { NextApiRequest, NextApiResponse } from 'next';
import { videoSchema } from '../../../schemas';
import { startProcessing } from '../../../server-actions';


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    switch (req.method) {
      case 'GET':
        // Handle GET request
        return res.status(200).json({ message: 'GET request handled' });
      case 'POST':
        // Validate and handle POST request
        const input = videoSchema.parse(req.body);
        const result = await startProcessing(input);
        return res.status(200).json(result);
      case 'PUT':
        // Handle PUT request
        return res.status(200).json({ message: 'PUT request handled' });
      case 'DELETE':
        // Handle DELETE request
        return res.status(200).json({ message: 'DELETE request handled' });
      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('[Process API Error]:', error);
    return res.status(500).json({ 
      message: 'Internal Server Error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}