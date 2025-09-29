import type { StorybookConfig } from '@storybook/nextjs';
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin';

const config: StorybookConfig = {
  framework: '@storybook/nextjs',
  stories: ['../**/*.stories.@(ts|tsx)'],
  core: {
    disableTelemetry: true,
  },
  addons: ['@storybook/addon-docs', '@storybook/addon-controls'],
  webpackFinal: async (config) => {
    if (config.resolve) {
      config.resolve.plugins = [
        ...(config.resolve.plugins || []),
        new TsconfigPathsPlugin({
          extensions: config.resolve.extensions,
        }),
      ];
    }
    return config;
  },
};

export default config;
