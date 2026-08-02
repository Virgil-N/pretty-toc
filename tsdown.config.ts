import { defineConfig } from 'tsdown'
import url from '@rollup/plugin-url';

export default defineConfig({
  dts: {
    tsgo: true,
  },
  exports: true,
  plugins: [url()]
})
