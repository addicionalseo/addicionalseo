import { readdirSync } from 'node:fs'
import { relative, resolve } from 'node:path'
import { defineConfig } from 'vite'

const EXCLUDED_DIRS = new Set([
  '.git',
  '.playwright-mcp',
  '.vercel',
  'dist',
  'node_modules',
  'references',
  'addicionalseo-mainframe-polished-v2',
  'addicionalseo-mainframe-porting-FINAL'
])

function shouldSkipDir(dirName) {
  return (
    EXCLUDED_DIRS.has(dirName) ||
    dirName.startsWith('backup-') ||
    dirName.startsWith('_backup')
  )
}

function collectHtmlInputs(rootDir, currentDir = rootDir, inputs = {}) {
  for (const entry of readdirSync(currentDir, { withFileTypes: true })) {
    const absolutePath = resolve(currentDir, entry.name)

    if (entry.isDirectory()) {
      if (!shouldSkipDir(entry.name)) {
        collectHtmlInputs(rootDir, absolutePath, inputs)
      }
      continue
    }

    if (!entry.isFile() || !entry.name.endsWith('.html')) {
      continue
    }

    const relativePath = relative(rootDir, absolutePath).replace(/\\/g, '/')
    const key = relativePath
      .replace(/\.html$/, '')
      .replace(/\//g, '__')
      .replace(/[^a-zA-Z0-9_-]/g, '_')

    inputs[key] = absolutePath
  }

  return inputs
}

const htmlInputs = collectHtmlInputs(__dirname)

export default defineConfig({
  build: {
    rollupOptions: {
      input: htmlInputs
    }
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    allowedHosts: [
      '.trycloudflare.com'
    ]
  }
})
