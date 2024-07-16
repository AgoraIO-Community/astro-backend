import { loadEnv } from 'vite'
import { defineConfig } from 'vitest/config'

export default defineConfig(({ mode }) => {
    // Load env file based on `mode` in the current working directory.
    // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
    const env = loadEnv(mode, process.cwd(), '')

    return {
        define: {
            'process.env.APP_ID': JSON.stringify(env.APP_ID),
            'process.env.APP_CERTIFICATE': JSON.stringify(env.APP_CERTIFICATE),
        },
    }
})