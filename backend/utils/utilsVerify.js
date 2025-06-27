import 'dotenv/config';
import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';

// Configura el cliente SNS con las credenciales y la región
export const snsClient = new SNSClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  }
});