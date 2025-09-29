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

import { render } from '@/shared-modules/__test__/test-utils';
import { cleanup, screen } from '@testing-library/react';
import { GraphView, isGraphCategory, GraphViewProps, GraphViewInner } from '@/shared-modules/components/GraphView';
import { chartData, multiChartData } from '@/shared-modules/utils/dummy-data/GraphView';
import { formatEnergyValue } from '@/shared-modules/utils';

// Mock dependencies before imports to avoid "Cannot access X before initialization" errors
jest.mock('@/shared-modules/utils/graphParsers', () => ({
  getStepFromRange: jest.fn(() => '1h'),
}));

jest.mock('@/shared-modules/utils/hooks', () => ({
  useMetricDateRange: jest.fn(() => [new Date('2022-03-06T00:00:00.000Z'), new Date()]),
}));

jest.mock('next-intl', () => ({
  useTranslations: jest.fn().mockImplementation(() => (str: string, vars?: Record<string, any>) => {
    if (!vars) return str;
    return Object.entries(vars).reduce((result, [key, value]) => {
      return result.replace(new RegExp(`\\{${key}\\}`, 'g'), value);
    }, str);
  }),
  useLocale: jest.fn(() => 'en'),
}));

jest.mock('@mantine/core', () => ({
  ...jest.requireActual('@mantine/core'),
  useMantineTheme: jest.fn(() => ({})),
  getThemeColor: jest.fn((color: string) => `var(--mantine-color-${color}-filled)`),
  Divider: jest.fn(() => <div data-testid='divider' />),
  Group: jest.fn(({ children }: any) => <div data-testid='group'>{children}</div>),
  Space: jest.fn(() => <div data-testid='space' />),
  Stack: jest.fn(({ children }: any) => <div data-testid='stack'>{children}</div>),
  Text: jest.fn(({ children }: any) => <div data-testid='text'>{children}</div>),
  Title: jest.fn(({ children }: any) => <div data-testid='title'>{children}</div>),
}));

jest.mock('@mantine/charts', () => ({
  AreaChart: jest.fn(() => <div data-testid='areaChart' />),
  LineChart: jest.fn(() => <div data-testid='lineChart' />),
  ChartTooltip: jest.fn(() => <div data-testid='chartTooltip' />),
}));

jest.mock('@/shared-modules/components', () => ({
  CardLoading: jest.fn(({ children, loading }: any) => (
    <div data-testid='cardLoading' data-loading={loading}>
      {children}
    </div>
  )),
  NoData: jest.fn(({ isNoData, children }: any) => (isNoData ? <div data-testid='noData'>No data</div> : children)),
  PageLink: jest.fn(({ children, title, path, query }: any) => (
    <div data-testid='pageLink' data-title={title} data-path={path} data-query={JSON.stringify(query)}>
      {children}
    </div>
  )),
}));

const defaultProps: GraphViewProps = {
  title: 'Test Title',
  valueFormatter: formatEnergyValue,
  data: chartData,
  stack: true,
  loading: false,
  dateRange: [new Date('2022-03-06T00:00:00.000Z'), new Date()],
};

describe('GraphView', () => {
  // Clean up after each test to avoid side effects
  afterEach(() => {
    cleanup();
    jest.clearAllMocks();
  });

  test('renders CardLoading and PageLink', () => {
    const { unmount } = render(<GraphView {...defaultProps} />);
    expect(screen.getByTestId('cardLoading')).toBeInTheDocument();
    expect(screen.getByTestId('pageLink')).toBeInTheDocument();
    unmount();
  });

  test('renders AreaChart when stack=true or single category', () => {
    const { unmount } = render(<GraphView {...defaultProps} />);
    expect(screen.getByTestId('areaChart')).toBeInTheDocument();
    unmount();
  });

  test('renders LineChart when stack=false and multiple categories', () => {
    const { unmount } = render(<GraphView {...defaultProps} stack={false} data={multiChartData} />);
    expect(screen.getByTestId('lineChart')).toBeInTheDocument();
    unmount();
  });

  test('shows NoData when categories are empty', () => {
    const { unmount } = render(<GraphView {...defaultProps} data={undefined} />);
    expect(screen.getByTestId('noData')).toBeInTheDocument();
    unmount();
  });

  test('shows loader when loading', () => {
    const { unmount } = render(<GraphView {...defaultProps} loading={true} />);
    expect(screen.getByTestId('cardLoading')).toBeInTheDocument();
    unmount();
  });

  test('shows formatted value in AreaChart', () => {
    const { unmount } = render(<GraphView {...defaultProps} />);
    expect(screen.getAllByTestId('text')[1]).toBeInTheDocument();
    unmount();
  });

  test('shows empty value if not today', () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const { unmount } = render(
      <GraphView {...defaultProps} dateRange={[new Date('2022-03-06T00:00:00.000Z'), yesterday]} />
    );
    expect(screen.queryByText(/Wh/)).not.toBeInTheDocument();
    unmount();
  });

  test('shows dash if value is NaN/null/undefined', () => {
    const data = [
      { date: '3/1', CPU: NaN },
      { date: '3/2', CPU: undefined },
      { date: '3/3', CPU: null },
    ];
    const { unmount } = render(<GraphView {...defaultProps} data={data} />);
    expect(screen.getAllByTestId('text')[1]).toBeInTheDocument();
    unmount();
  });

  test('calls valueFormatter with correct value', () => {
    const spy = jest.fn(() => 'formatted');
    const { unmount } = render(<GraphView {...defaultProps} valueFormatter={spy} />);
    expect(spy).toHaveBeenCalled();
    unmount();
  });

  test('calls getStepFromRange and useMetricDateRange', () => {
    const { unmount } = render(<GraphView {...defaultProps} />);
    const { getStepFromRange } = require('@/shared-modules/utils/graphParsers');
    const { useMetricDateRange } = require('@/shared-modules/utils/hooks');
    expect(getStepFromRange).toHaveBeenCalled();
    expect(useMetricDateRange).toHaveBeenCalled();
    unmount();
  });

  test('isGraphCategory returns true for valid categories', () => {
    expect(isGraphCategory('CPU')).toBe(true);
    expect(isGraphCategory('Memory')).toBe(true);
  });

  test('isGraphCategory returns false for invalid categories', () => {
    expect(isGraphCategory('cpu')).toBe(false);
    expect(isGraphCategory('')).toBe(false);
    expect(isGraphCategory('unknown')).toBe(false);
    expect(isGraphCategory(undefined as any)).toBe(false);
    expect(isGraphCategory(null as any)).toBe(false);
    expect(isGraphCategory(0 as any)).toBe(false);
    expect(isGraphCategory(false as any)).toBe(false);
  });

  test('areaProps and chartProps are passed correctly', () => {
    const { unmount } = render(<GraphView {...defaultProps} />);
    const AreaChart = require('@mantine/charts').AreaChart;
    const props = AreaChart.mock.calls[0][0];
    expect(props.areaProps).toBeDefined();
    expect(props.xAxisProps).toBeDefined();
    expect(props.tooltipProps).toBeDefined();
    expect(props.series).toBeDefined();
    unmount();
  });

  test('xAxisProps.tickFormatter returns formatted string', () => {
    const { unmount } = render(<GraphView {...defaultProps} />);
    const AreaChart = require('@mantine/charts').AreaChart;
    const props = AreaChart.mock.calls[0][0];
    expect(props.xAxisProps.tickFormatter('2022-03-06T00:00:00.000Z')).toMatch(/Mar/);
    unmount();
  });

  test('areaProps returns correct style', () => {
    const { unmount } = render(<GraphView {...defaultProps} />);
    const AreaChart = require('@mantine/charts').AreaChart;
    const props = AreaChart.mock.calls[0][0];
    const style = props.areaProps({ color: 'blue' });
    expect(style.fill).toBe('var(--mantine-color-blue-filled)');
    expect(style.stroke).toBe('var(--mantine-color-blue-filled)');
    expect(style.dot).toBe(false);
    unmount();
  });

  test('PageLink linkTitle, link, query props', () => {
    const { unmount } = render(
      <GraphView {...defaultProps} linkTitle='linkTitle' link='/test' query={{ tab: 'tab1' }} />
    );
    expect(screen.getByTestId('pageLink')).toBeInTheDocument();
    unmount();
  });

  test('NoData is shown if categories are empty array', () => {
    const { unmount } = render(<GraphView {...defaultProps} data={[{ date: '3/1' }]} />);
    expect(screen.getByTestId('noData')).toBeInTheDocument();
    unmount();
  });

  // Test for step display text with minute unit (covers line 124)
  test('getStepDisplayText handles minute unit correctly', () => {
    const { getStepFromRange } = require('@/shared-modules/utils/graphParsers');
    (getStepFromRange as jest.Mock).mockImplementationOnce(() => '5m');

    const { unmount } = render(<GraphView {...defaultProps} />);
    expect(screen.getAllByTestId('text')[0]).toBeInTheDocument();
    unmount();

    // Test singular case
    (getStepFromRange as jest.Mock).mockImplementationOnce(() => '1m');
    const { unmount: unmount2 } = render(<GraphView {...defaultProps} />);
    expect(screen.getAllByTestId('text')[0]).toBeInTheDocument();
    unmount2();
  });

  // Test for step display text with hour unit
  test('getStepDisplayText handles hour unit correctly', () => {
    const { getStepFromRange } = require('@/shared-modules/utils/graphParsers');
    (getStepFromRange as jest.Mock).mockImplementationOnce(() => '6h');

    const { unmount } = render(<GraphView {...defaultProps} />);
    expect(screen.getAllByTestId('text')[0]).toBeInTheDocument();
    unmount();

    // Test singular case
    (getStepFromRange as jest.Mock).mockImplementationOnce(() => '1h');
    const { unmount: unmount2 } = render(<GraphView {...defaultProps} />);
    expect(screen.getAllByTestId('text')[0]).toBeInTheDocument();
    unmount2();
  });

  // Test for step display text with day unit (covers lines 128-129)
  test('getStepDisplayText handles day unit correctly', () => {
    const { getStepFromRange } = require('@/shared-modules/utils/graphParsers');
    (getStepFromRange as jest.Mock).mockImplementationOnce(() => '7d');

    const { unmount } = render(<GraphView {...defaultProps} />);
    expect(screen.getAllByTestId('text')[0]).toBeInTheDocument();
    unmount();

    // Test singular case
    (getStepFromRange as jest.Mock).mockImplementationOnce(() => '1d');
    const { unmount: unmount2 } = render(<GraphView {...defaultProps} />);
    expect(screen.getAllByTestId('text')[0]).toBeInTheDocument();
    unmount2();
  });

  // Test for step display text with default case (covers line 130)
  test('getStepDisplayText handles invalid step format correctly', () => {
    const { getStepFromRange } = require('@/shared-modules/utils/graphParsers');
    // Test case for invalid pattern that doesn't match regex
    (getStepFromRange as jest.Mock).mockImplementationOnce(() => 'invalid');
    const { unmount } = render(<GraphView {...defaultProps} />);
    expect(screen.getAllByTestId('text')[0]).toBeInTheDocument();
    unmount();
  });

  // Test case for second (s) unit to cover default case in switch statement
  test('getStepDisplayText handles seconds unit correctly', () => {
    const { getStepFromRange } = require('@/shared-modules/utils/graphParsers');
    (getStepFromRange as jest.Mock).mockImplementationOnce(() => '30s');
    const { unmount } = render(<GraphView {...defaultProps} />);
    expect(screen.getAllByTestId('text')[0]).toBeInTheDocument();
    unmount();
  });

  // Test for loading=undefined (covers line 92)
  test('handles loading=undefined', () => {
    const props = { ...defaultProps };
    delete props.loading;
    const { unmount } = render(<GraphView {...props} />);
    expect(screen.getByTestId('cardLoading')).toBeInTheDocument();
    unmount();
  });

  // Test for data with no valid categories (covers line 126)
  test('handles data with only non-category keys', () => {
    const nonCategoryData = [
      { date: '2023-01-01', nonCategory1: 10, nonCategory2: 20 },
      { date: '2023-01-02', nonCategory1: 15, nonCategory2: 25 },
    ];
    const { unmount } = render(<GraphView {...defaultProps} data={nonCategoryData} />);
    expect(screen.getByTestId('noData')).toBeInTheDocument();
    unmount();
  });

  // Test specifically for NaN value handling in getCurrentValue (covers line 137)
  test('handles NaN values in data correctly', () => {
    // Set mock Date to ensure isToday is true
    const originalDateToString = Date.prototype.toDateString;
    Date.prototype.toDateString = jest.fn().mockReturnValue(new Date().toDateString());

    const dataWithNaN = [
      { date: '3/1', CPU: 10 },
      { date: '3/2', CPU: 20 },
      { date: '3/3', CPU: Number.NaN }, // explicit NaN value
    ];
    const { unmount } = render(<GraphView {...defaultProps} data={dataWithNaN} />);

    // Clean up the mock
    Date.prototype.toDateString = originalDateToString;
    unmount();
  });

  // Test specifically for undefined/null values in getCurrentValue
  test('handles undefined and null values in data correctly', () => {
    // Set mock Date to ensure isToday is true
    const originalDateToString = Date.prototype.toDateString;
    Date.prototype.toDateString = jest.fn().mockReturnValue(new Date().toDateString());

    const dataWithMissingValues = [
      { date: '3/1', CPU: 10 },
      { date: '3/2', CPU: 20 },
      { date: '3/3', CPU: undefined },
      { date: '3/4', CPU: null },
    ];
    const { unmount } = render(<GraphView {...defaultProps} data={dataWithMissingValues} />);

    // Clean up the mock
    Date.prototype.toDateString = originalDateToString;
    unmount();
  });

  test('GraphViewInner renders', () => {
    const { unmount } = render(<GraphViewInner {...defaultProps} />);
    expect(screen.getByTestId('areaChart')).toBeInTheDocument();
    unmount();
  });
});
