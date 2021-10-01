// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';

import Pusher from 'pusher';

import {
  ENV_PUSHER_API_KEY,
  ENV_PUSHER_APP_ID,
  ENV_PUSHER_CLUSTER,
  ENV_PUSHER_SECRET_KEY,
} from '../../constants/envs';

export type Data = {};

const handler = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  if (req.method !== 'POST') {
    return res.status(404);
  }

  const pusher = new Pusher({
    appId: ENV_PUSHER_APP_ID,
    key: ENV_PUSHER_API_KEY,
    secret: ENV_PUSHER_SECRET_KEY,
    cluster: ENV_PUSHER_CLUSTER,
  });


  await pusher.trigger('slide-1', 'event:slider-slide', req.body);
  
  res.status(204).send({});
};
export default handler;