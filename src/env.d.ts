/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_ENDPOINT?: string;
  readonly VITE_API_URL?: string;
  // add any other VITE_... variables you use
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}