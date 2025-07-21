// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import { loadEnv } from "vite";
import { storyblok } from "@storyblok/astro";
import react from "@astrojs/react";

const { STORYBLOK_TOKEN } = loadEnv('', process.cwd(), 'STORYBLOK');

// https://astro.build/config
export default defineConfig({
    vite: {
        plugins: [tailwindcss()],
        server: {
            https: {
                key: './localhost-key.pem',
                cert: './localhost.pem'
            }
        }
    },

    integrations: [
        storyblok({
            accessToken: STORYBLOK_TOKEN
        }),
        react()
    ]
});