import { I18nProvider } from '@lingui/react';
import { QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { i18n } from './i18n';

import { routeTree } from './routeTree.gen';

import './index.css';
import { GlobalSnackbar } from './components/Snackbar';
import { queryClient } from './query';

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface Register {
    router: typeof router;
  }
}

const rootElement = document.getElementById('root');
if (rootElement == null) {
  throw new Error('Root element not found');
}

createRoot(rootElement).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <I18nProvider i18n={i18n}>
        <RouterProvider router={router} />
        <GlobalSnackbar />
      </I18nProvider>
    </QueryClientProvider>
  </StrictMode>,
);
