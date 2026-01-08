import {
  type Options,
  type SDKResultMessage,
  query,
} from '@anthropic-ai/claude-agent-sdk';

import type { PromptContext, Scenario } from '../../../definitions';

type GenerateDesignDocParams = {
  scenario: Scenario;
  formData: Record<string, unknown>;
  promptContext: PromptContext;
};

export const generateDesignDoc = async ({
  scenario,
  formData,
  promptContext,
}: GenerateDesignDocParams): Promise<string> => {
  const prompt = scenario.prompt({ formData, promptContext });

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
  promptContext,
}: GenerateDesignDocParams): AsyncGenerator<StreamChunk> {
  const prompt = scenario.prompt({ formData, promptContext });

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
