import 'server-only'
import { getServerEnv } from '@/server/env'
import { DEFAULT_API_URL, DEFAULT_MODEL, DEFAULT_TIMEOUT_MS, type AssistantConfig } from './provider'

/** Reads the AI_* variables. Kept apart from the provider so unit tests never touch the environment. */
export function assistantConfigFromEnv(): AssistantConfig {
  const env = getServerEnv()
  const mock = env.AI_MOCK === 'true'
  const models = [env.AI_MODEL_DEFAULT ?? DEFAULT_MODEL, ...splitList(env.AI_MODEL_FALLBACKS)]
  return {
    enabled: env.AI_ENABLED === 'true' && (mock || Boolean(env.NVIDIA_API_KEY)),
    apiUrl: (env.AI_API_URL ?? DEFAULT_API_URL).replace(/\/+$/, ''),
    apiKey: env.NVIDIA_API_KEY ?? '',
    models: Array.from(new Set(models)),
    timeoutMs: env.AI_TIMEOUT_SECONDS ? env.AI_TIMEOUT_SECONDS * 1000 : DEFAULT_TIMEOUT_MS,
    mock,
  }
}

function splitList(value: string | undefined): string[] {
  return (value ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
}
