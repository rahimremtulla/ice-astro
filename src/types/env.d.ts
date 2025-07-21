/// <reference types="astro/client" />

interface ImportMetaEnv {
    readonly PUBLIC_STORYBLOK_TOKEN: string;
    readonly PUBLIC_ENABLE_LOGS?: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}