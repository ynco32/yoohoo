import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  sassOptions: {
    includePaths: [path.join(process.cwd(), 'src/assets/styles')],
    prependData: `@use "abstracts/variables" as *;`,
  },
};

export default nextConfig;
