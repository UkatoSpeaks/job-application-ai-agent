import { JobAgentResponse } from '@/types';

const APPLICATION_RESULT_KEY = 'job-agent-result';

export function saveApplicationResult(result: JobAgentResponse): void {
  sessionStorage.setItem(APPLICATION_RESULT_KEY, JSON.stringify(result));
}

export function getApplicationResult(): JobAgentResponse | null {
  const storedResult = sessionStorage.getItem(APPLICATION_RESULT_KEY);
  if (!storedResult) return null;

  try {
    return JSON.parse(storedResult) as JobAgentResponse;
  } catch {
    sessionStorage.removeItem(APPLICATION_RESULT_KEY);
    return null;
  }
}
