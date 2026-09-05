# Oracle activation

The third selection makes one request. The complete interpretation and card meanings appear together after it finishes. Failed interpretations leave the canonical meanings available; retries count as new attempts.

## Server-only Vercel environment variables

- OPENAI_API_KEY: project API secret (never a VITE_ variable).
- ORACLE_AI_ENABLED: true when ready; false is the emergency off switch.
- ORACLE_MODEL: gpt-4.1-mini (default).
- STORAGE_KV_REST_API_URL and STORAGE_KV_REST_API_TOKEN: automatically supplied by the connected database. The original UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN names also work. Never use the read-only token.
- ORACLE_LIMIT_SECRET: optional separate long random secret used to pseudonymize network addresses; defaults to the private database token. Rotating it or the fallback token resets visitor counters, but not the global monthly counter.
- ORACLE_MONTHLY_READING_LIMIT: 1000 by default, shared across the production site.

Production limits are two attempts per network address per 60-second window, ten per UTC day, and 1000 site-wide per UTC calendar month. Counters reserve atomically BEFORE OpenAI calls, including failed calls. No questions or readings are stored in the limiter. Monthly limits count attempts, not dollars. Preserve the Redis database and limit secret; clearing counters resets protection. Configure provider spending controls separately.

Missing or unavailable counter storage blocks AI requests rather than allowing unlimited access. Network-based limits can group households and can be evaded through changing networks; the global cap still limits total paid attempts. This is rate limiting, not a human-verification CAPTCHA. A managed bot challenge can be added for stronger bot filtering.

## Private development

ORACLE_DEV_UNLIMITED=true bypasses counters ONLY on a Vercel preview or a local NODE_ENV=development server outside Vercel. Never set this on publicly accessible previews: first enable preview deployment protection. Production always enforces limits regardless of this flag. Paid development calls still incur provider costs. Vite alone does not serve the API; use a protected Vercel preview or a server supporting Vercel functions.

## Launch checks

1. Connect the Redis database and secrets; confirm the preview is protected.
2. Add the OpenAI project key and billing controls privately in Vercel.
3. Enable AI and redeploy the protected preview; test a complete reading.
4. With bypass off, verify limits and missing-storage rejection before production activation.
5. Deploy production with bypass off. Confirm one completed reading and review OpenAI usage.

Current code has not been verified against real Redis or OpenAI credentials. Do not consider activation complete until those integration checks pass.
