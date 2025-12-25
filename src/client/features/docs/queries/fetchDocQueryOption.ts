import { queryOptions } from '@tanstack/react-query';

import type { DocumentWithMetadata } from './fetchDocsQueryOption';

type DocResponse = {
  doc: DocumentWithMetadata;
};

const fetchDoc = async (
  scenarioId: string,
  filename: string,
): Promise<DocumentWithMetadata> => {
  const response = await fetch(
    `/api/scenarios/${encodeURIComponent(scenarioId)}/docs/${encodeURIComponent(filename)}`,
  );
  if (!response.ok) {
    throw new Error('Failed to fetch doc');
  }
  const data = (await response.json()) as DocResponse;
  return data.doc;
};

export const docQueryOptions = (scenarioId: string, filename: string) =>
  queryOptions({
    queryKey: ['scenarios', scenarioId, 'docs', filename],
    queryFn: () => fetchDoc(scenarioId, filename),
  });
