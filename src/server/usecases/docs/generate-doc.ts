import {
  type Options,
  type SDKResultMessage,
  query,
} from '@anthropic-ai/claude-agent-sdk';

import type { AiContext, Scenario } from '../../../definitions';

type GenerateDesignDocParams = {
  scenario: Scenario;
  formData: Record<string, unknown>;
  aiContext: AiContext;
};

export const generateDesignDoc = async ({
  scenario,
  formData,
  aiContext,
}: GenerateDesignDocParams): Promise<string> => {
  const prompt = scenario.prompt({ formData, aiContext });

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
  aiContext,
}: GenerateDesignDocParams): AsyncGenerator<StreamChunk> {
  const prompt = scenario.prompt({ formData, aiContext });

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
