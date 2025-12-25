import { queryOptions } from '@tanstack/react-query';

export type DocumentMetadata = {
  scenarioId: string;
  formData: Record<string, unknown>;
};

export type DocumentWithMetadata = {
  filename: string;
  content: string;
  metadata: DocumentMetadata | null;
};

type DocsResponse = {
  docs: DocumentWithMetadata[];
};

const fetchDocs = async (
  scenarioId: string,
): Promise<DocumentWithMetadata[]> => {
  const response = await fetch(`/api/scenarios/${scenarioId}/docs`);
  if (!response.ok) {
    throw new Error(`Failed to fetch docs for scenario ${scenarioId}`);
  }
  const data = (await response.json()) as DocsResponse;
  return data.docs;
};

export const docsQueryOptions = (scenarioId: string) =>
  queryOptions({
    queryKey: ['scenarios', scenarioId, 'docs'],
    queryFn: () => fetchDocs(scenarioId),
  });
