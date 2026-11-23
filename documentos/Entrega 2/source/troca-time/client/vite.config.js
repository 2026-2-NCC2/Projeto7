import { fileURLToPath, URL } from 'node:url'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        // permite importar com '@/components/...' em vez de '../../../components/...'
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
        },
    },
    css: {
        modules: {
            // no CSS as classes ficam em kebab-case (.etapa-nome) e no JSX em camelCase (styles.etapaNome)
            localsConvention: 'camelCaseOnly',
        },
    },
})
