import {
  type Options,
  type SDKResultMessage,
  query,
} from '@anthropic-ai/claude-agent-sdk';

import type { InputData, Scenario } from '../../../definitions';

type GenerateDesignDocParams = {
  scenario: Scenario;
  formData: Record<string, unknown>;
  inputData: InputData;
};

export const generateDesignDoc = async ({
  scenario,
  formData,
  inputData,
}: GenerateDesignDocParams): Promise<string> => {
  const promptTemplate =
    typeof scenario.prompt === 'function'
      ? scenario.prompt({ formData, inputData })
      : scenario.prompt;
  const prompt = promptTemplate.replace(
    '{{INPUT_JSON}}',
    JSON.stringify(inputData, null, 2),
  );

  let message: SDKResultMessage | null = null;

  for await (const msg of query({
    prompt,
    options: scenario.aiSettings as Options,
  })) {
    if (msg.type === 'result' && msg.subtype === 'success') {
      message = msg;
    }
  }

  if (message == null) {
    throw new Error('Query failed');
  }

  return message.result;
};
