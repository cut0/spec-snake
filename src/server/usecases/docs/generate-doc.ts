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

type StreamChunk = {
  type: 'text_delta';
  text: string;
};

export async function* generateDesignDocStream({
  scenario,
  formData,
  inputData,
}: GenerateDesignDocParams): AsyncGenerator<StreamChunk> {
  const promptTemplate =
    typeof scenario.prompt === 'function'
      ? scenario.prompt({ formData, inputData })
      : scenario.prompt;
  const prompt = promptTemplate.replace(
    '{{INPUT_JSON}}',
    JSON.stringify(inputData, null, 2),
  );

  for await (const msg of query({
    prompt,
    options: {
      ...(scenario.aiSettings as Options),
      includePartialMessages: true,
    },
  })) {
    if (msg.type === 'stream_event') {
      const event = msg.event as {
        type: string;
        delta?: { type: string; text?: string };
      };
      if (
        event.type === 'content_block_delta' &&
        event.delta?.type === 'text_delta' &&
        event.delta.text != null
      ) {
        yield { type: 'text_delta', text: event.delta.text };
      }
    }
  }
}
