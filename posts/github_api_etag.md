---
title: How to implement etags in github
publish_date: 2024-02-12
---

Recently we encountered an interesting proglem in one of our internal tool that heavly uses github api.
The tool is responsible for created ephemeral development environments when developers open a pull request.

Example of a code block
```typescript
export async function requesthWithEtag(endpoint: string, requestData = {}) {
  const octokit = await createOctokitClient({ caller: 'fetchWithEtag' });
  const redisKey = `github:etags:${endpoint}`;

  const redis = new Redis(REDIS_PORT, REDIS_URL);
  try {
    const etag = await redis.hget(redisKey, 'etag');
    const headers = etag ? { headers: { 'If-None-Match': etag } } : {};

    const resp = await octokit.request(endpoint, { ...requestData, ...headers });

    await redis.hset(redisKey, 'etag', resp.headers.etag, 'data', JSON.stringify(resp.data));

    // expire cache after x seconds
    await redis.expire(redisKey, 600);

    return resp;
  } catch (err) {
    if (err.status === 304) {
      const cachedData = await redis.hget(redisKey, 'data');
      return { data: JSON.parse(cachedData) };
    } else {
      console.error(`[GITHUB Request], ${err}`);
    }
  }
}
 ```
