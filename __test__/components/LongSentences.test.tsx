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

import React from 'react';
import { render, screen } from '@testing-library/react';
import { LongSentences } from '@/shared-modules/components/LongSentences';

describe('LongSentences Component', () => {
  const mockElementSize = (scrollWidth: number, clientWidth: number, scrollHeight: number, clientHeight: number) => {
    Object.defineProperty(HTMLElement.prototype, 'scrollWidth', {
      configurable: true,
      value: scrollWidth,
    });
    Object.defineProperty(HTMLElement.prototype, 'clientWidth', {
      configurable: true,
      value: clientWidth,
    });
    Object.defineProperty(HTMLElement.prototype, 'scrollHeight', {
      configurable: true,
      value: scrollHeight,
    });
    Object.defineProperty(HTMLElement.prototype, 'clientHeight', {
      configurable: true,
      value: clientHeight,
    });
  };

  afterEach(() => {
    // Reset mocks
    jest.restoreAllMocks();
  });

  test('renders the text content correctly', () => {
    render(<LongSentences text='This is a test sentence.' />);
    expect(screen.getByText('This is a test sentence.')).toBeInTheDocument();
  });

  test('truncates text correctly when it exceeds one line', () => {
    // Set the mock size (create overflow by setting scrollWidth > clientWidth)
    mockElementSize(200, 100, 50, 50);

    render(<LongSentences text='This is a very long sentence that should be truncated.' lines={1} truncate={true} />);
    const divElement = screen.getByText('This is a very long sentence that should be truncated.');

    expect(divElement).toHaveStyle('overflow: hidden');
    expect(divElement).toHaveStyle('text-overflow: ellipsis');
  });

  // FIXME - This test is failing because the computedStyle is not returning the correct value
  // test('truncates text correctly when it exceeds three lines', () => {
  //   // Set the mock size (create overflow by setting scrollHeight > clientHeight)
  //   mockElementSize(100, 100, 150, 50);

  //   render(
  //     <LongSentences
  //       text='This is a very long sentence that spans multiple lines and should be truncated.'
  //       lines={3}
  //       truncate={true}
  //     />
  //   );
  //   const divElement = screen.getByText(
  //     'This is a very long sentence that spans multiple lines and should be truncated.'
  //   );

  //   expect(divElement).toHaveStyle('overflow: hidden');
  //   // Use getComputedStyle to check -webkit-line-clamp
  //   const computedStyle = window.getComputedStyle(divElement);
  //   console.log(computedStyle);
  //   screen.debug();
  //   // expect(computedStyle.webkitLineClamp).toBe('3');
  //   expect(divElement).toHaveStyle('-webkit-line-clamp: 3');
  // });

  test('sets title attribute to props.title when provided and text is truncated to one line', () => {
    mockElementSize(200, 100, 50, 50); // Simulate text exceeding one line

    render(
      <LongSentences
        text='This is a very long sentence that should be truncated.'
        lines={1}
        truncate={true}
        title='Custom Title'
      />
    );
    const divElement = screen.getByText('This is a very long sentence that should be truncated.');
    expect(divElement).toHaveAttribute('title', 'Custom Title');
  });

  test('sets title attribute to props.text when props.title is not provided and text is truncated to one line', () => {
    mockElementSize(200, 100, 50, 50); // Simulate text exceeding one line

    render(<LongSentences text='This is a very long sentence that should be truncated.' lines={1} truncate={true} />);
    const divElement = screen.getByText('This is a very long sentence that should be truncated.');
    expect(divElement).toHaveAttribute('title', 'This is a very long sentence that should be truncated.');
  });

  test('sets title attribute to props.title when provided and text is truncated to three lines', () => {
    mockElementSize(100, 100, 150, 50); // Simulate text exceeding three lines

    render(
      <LongSentences
        text='This is a very long sentence that spans multiple lines and should be truncated.'
        lines={3}
        truncate={true}
        title='Custom Title'
      />
    );
    const divElement = screen.getByText(
      'This is a very long sentence that spans multiple lines and should be truncated.'
    );
    expect(divElement).toHaveAttribute('title', 'Custom Title');
  });

  test('sets title attribute to props.text when props.title is not provided and text is truncated to three lines', () => {
    mockElementSize(100, 100, 150, 50); // Simulate text exceeding three lines

    render(
      <LongSentences
        text='This is a very long sentence that spans multiple lines and should be truncated.'
        lines={3}
        truncate={true}
      />
    );
    const divElement = screen.getByText(
      'This is a very long sentence that spans multiple lines and should be truncated.'
    );
    expect(divElement).toHaveAttribute(
      'title',
      'This is a very long sentence that spans multiple lines and should be truncated.'
    );
  });

  test('does not truncate text and does not set title attribute when truncate is false', () => {
    mockElementSize(100, 100, 50, 50); // Simulate no overflow

    render(<LongSentences text='This is a long sentence but not truncated.' truncate={false} />);
    const divElement = screen.getByText('This is a long sentence but not truncated.');

    expect(divElement).toHaveStyle('overflow: visible');
    expect(divElement).not.toHaveStyle('text-overflow: ellipsis');
    expect(divElement).not.toHaveAttribute('title');
  });
});
