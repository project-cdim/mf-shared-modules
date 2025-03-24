/*
 * Copyright 2025 NEC Corporation.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License. You may obtain
 * a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 */

'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';

import { Button } from '@mantine/core';
import { useTranslations } from 'next-intl';

import { MessageBox } from '@/shared-modules/components';

type ErrorBoundaryProps = {
  children?: ReactNode;
  t: (key: string) => string;
};

type ErrorBoundaryState = {
  hasError: boolean;
};

/**
 * ErrorBoundaryClass is a React component that wraps its children components and handles any errors that occur within them.
 * It renders a custom fallback UI when an error occurs and provides a reload button to reset the error state.
 */
class ErrorBoundaryClass extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);

    /** Define a state variable to track whether there is an error or not */
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    /** Update state so the next render will show the fallback UI */
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    /**
     * You can use your own error logging service here
     * this.setState({ ...this.state, errorInfo: errorInfo.componentStack.toString() });
     */
    console.log({ error, errorInfo });
  }

  render() {
    const { t } = this.props;

    /** Check if an error has occurred */
    if (this.state.hasError) {
      /** Render a custom fallback UI */
      return (
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            gap: '20px 0',
          }}
        >
          <MessageBox
            type='error'
            title={t('A runtime error has occurred')}
            message={
              <>
                <div>{t('Click the reload button')}</div>
                <div>
                  {t(
                    'If the problem persists, please contact your administrator'
                  )}
                </div>
              </>
            }
          />

          <Button
            type='button'
            onClick={() => this.setState({ hasError: false })}
          >
            {t('Reload')}
          </Button>
        </div>
      );
    }

    // Return children components in case of no error
    return <>{this.props.children}</>;
  }
}

/**
 * Wrap the ErrorBoundaryClass with a function component to use the useTranslations hook.
 */
export const ErrorBoundary: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const t = useTranslations();
  return <ErrorBoundaryClass t={t}>{children}</ErrorBoundaryClass>;
};
