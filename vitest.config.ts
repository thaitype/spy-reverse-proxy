import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    alias: {
      /**
       * Absolute path to the root of the project
       * https://vitest.dev/guide/common-errors#cannot-find-module-relative-path
       */
      '@/': new URL('./src/', import.meta.url).pathname, 
    }
  }
})