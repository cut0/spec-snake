export type DocumentMetadata = {
  scenarioId: string;
  formData: Record<string, unknown>;
};

export type DocumentWithMetadata = {
  filename: string;
  content: string;
  metadata: DocumentMetadata | null;
};

const METADATA_START = '<!-- design-docs-metadata';
const METADATA_END = '-->';

export const serializeMetadata = (metadata: DocumentMetadata): string => {
  return `${METADATA_START}\n${JSON.stringify(metadata, null, 2)}\n${METADATA_END}`;
};

export const parseMetadata = (
  content: string,
): { metadata: DocumentMetadata | null; content: string } => {
  const metadataStartIndex = content.lastIndexOf(METADATA_START);
  if (metadataStartIndex === -1) {
    return { metadata: null, content };
  }

  const metadataEndIndex = content.indexOf(METADATA_END, metadataStartIndex);
  if (metadataEndIndex === -1) {
    return { metadata: null, content };
  }

  try {
    const metadataJson = content
      .slice(metadataStartIndex + METADATA_START.length, metadataEndIndex)
      .trim();
    const metadata = JSON.parse(metadataJson) as DocumentMetadata;
    const cleanContent = content.slice(0, metadataStartIndex).trim();
    return { metadata, content: cleanContent };
  } catch {
    return { metadata: null, content };
  }
};

export const addMetadataToContent = (
  content: string,
  metadata: DocumentMetadata,
): string => {
  return `${content}\n\n${serializeMetadata(metadata)}`;
};
