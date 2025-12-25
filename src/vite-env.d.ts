/// <reference types="vite/client" />

type ImportMetaEnv = {
  // Server-side only (used by devServer entry)
  readonly VITE_CONFIG_PATH: string;
};

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
