import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

import type { AiContext, Scenario } from '../../definitions';
import {
  type DocumentWithMetadata,
  addMetadataToContent,
  parseMetadata,
} from '../helpers/docs/metadata';

export const getOutputDir = (scenario: Scenario): string => {
  return scenario.outputDir ?? join(process.cwd(), 'output');
};

type ReadDocumentResult =
  | { success: true; doc: DocumentWithMetadata }
  | { success: false; error: 'not_found' | 'scenario_mismatch' };

export const readDocument = async (
  scenario: Scenario,
  filename: string,
): Promise<ReadDocumentResult> => {
  const outputDir = getOutputDir(scenario);
  const filePath = join(outputDir, filename);

  try {
    const rawContent = await readFile(filePath, 'utf-8');
    const { metadata, content } = parseMetadata(rawContent);

    if (metadata?.scenarioId !== scenario.id) {
      return { success: false, error: 'scenario_mismatch' };
    }

    return {
      success: true,
      doc: { filename, content, metadata },
    };
  } catch {
    return { success: false, error: 'not_found' };
  }
};

export const getDocumentsForScenario = async (
  scenario: Scenario,
): Promise<DocumentWithMetadata[]> => {
  const outputDir = getOutputDir(scenario);

  try {
    const files = await readdir(outputDir);
    const mdFiles = files.filter((file) => file.endsWith('.md'));

    const docs = await Promise.all(
      mdFiles.map(async (filename) => {
        const result = await readDocument(scenario, filename);
        return result.success ? result.doc : null;
      }),
    );

    return docs.filter((doc) => doc != null);
  } catch {
    return [];
  }
};

type SaveDocumentOptions = {
  scenario: Scenario;
  scenarioId: string;
  filename: string;
  content: string;
  formData: Record<string, unknown>;
};

export const saveDocument = async ({
  scenario,
  scenarioId,
  filename,
  content,
  formData,
}: SaveDocumentOptions): Promise<{ outputPath: string }> => {
  const outputDir = getOutputDir(scenario);
  const outputPath = join(outputDir, filename);

  const contentWithMetadata = addMetadataToContent(content, {
    scenarioId,
    formData,
  });

  await mkdir(outputDir, { recursive: true });
  await writeFile(outputPath, contentWithMetadata, 'utf-8');

  return { outputPath };
};

export const getFilename = (
  scenario: Scenario,
  scenarioId: string,
  content: string,
  formData: Record<string, unknown>,
  aiContext: AiContext,
): string => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');

  const filename = scenario.filename;
  if (filename != null) {
    return typeof filename === 'function'
      ? filename({
          scenarioId,
          timestamp,
          content,
          formData,
          aiContext,
        })
      : filename;
  }

  return `design-doc-${scenarioId}-${timestamp}.md`;
};
