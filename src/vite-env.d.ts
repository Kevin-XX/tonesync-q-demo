/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_TENCENT_SECRET_ID: string
  readonly VITE_TENCENT_SECRET_KEY: string
  readonly VITE_TENCENT_REGION: string
  readonly VITE_HUNYUAN_MODEL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
