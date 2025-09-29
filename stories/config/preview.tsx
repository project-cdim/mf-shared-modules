import { Box, MantineProvider } from '@mantine/core';
import type { Preview } from '@storybook/react';
import { NextIntlClientProvider } from 'next-intl';
import { Layout } from '@/shared-modules/components';
import '@mantine/core/styles.css';
// import '@/styles/globals.css';

const preview: Preview = {
  decorators: [
    (Story) => (
      <NextIntlClientProvider locale='ja'>
        <MantineProvider>
          <Layout>
            <Box m={-24}>
              <Story />
            </Box>
          </Layout>
        </MantineProvider>
      </NextIntlClientProvider>
    ),
  ],
  // tags: ['autodocs'],
};

export default preview;
