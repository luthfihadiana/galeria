import { createApi } from 'unsplash-js';
import nodeFetch from 'node-fetch';

const unsplash = createApi({
  accessKey: process.env.NEXT_UNSPLASH_ACCESS_KEY,
  fetch: nodeFetch,
});

export default unsplash;