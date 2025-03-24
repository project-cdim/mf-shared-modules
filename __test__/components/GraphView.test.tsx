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

import { AreaChart, LineChart } from '@mantine/charts';
import { screen } from '@testing-library/react';

import { render } from '@/shared-modules/__test__/test-utils';
import { GraphView, GraphViewProps, isGraphCategory } from '@/shared-modules/components';
import {
  APIDeviceAvailable,
  APIDeviceHealth,
  APIDeviceState,
  APIDeviceType,
  ResourceListQuery,
} from '@/shared-modules/types';
import { formatEnergyValue } from '@/shared-modules/utils';
import { chartData, multiChartData } from '@/shared-modules/utils/dummy-data/GraphView';

jest.mock('@luigi-project/client', () => ({
  addInitListener: jest.fn(),
}));

jest.mock('@mantine/charts', () => ({
  ...jest.requireActual('@mantine/charts'),
  AreaChart: jest.fn().mockImplementation(() => <div data-testid='areaChart'></div>),
  LineChart: jest.fn().mockImplementation(() => <div data-testid='lineChart'></div>),
}));

jest.mock('next/link', () => {
  return function MockComponent(props: {
    href: {
      pathname: string;
      query: ResourceListQuery;
    };
  }) {
    return (
      <>
        <p data-testid='Mock_Link_pathname'>{props.href.pathname}</p>

        {Object.keys(props.href.query).map((key) => {
          if (
            key === 'cxlSwitchId' ||
            key === 'type' ||
            key === 'allocatednode' ||
            key === 'state' ||
            key === 'health' ||
            key === 'resourceAvailable'
          ) {
            return (
              <p data-testid={`Mock_Link_query_${key}`} key={`Mock_Link_query_${key}`}>
                {props.href.query[key]?.join(',')}
              </p>
            );
          }
        })}
      </>
    );
  };
});

describe('GraphView', () => {
  describe.each`
    data              | isStack      | theLatestValue
    ${chartData}      | ${true}      | ${87}
    ${chartData}      | ${false}     | ${87}
    ${chartData}      | ${undefined} | ${87}
    ${multiChartData} | ${true}      | ${122}
  `('AreaChart', ({ data, isStack, theLatestValue }) => {
    test('Render a AreaChart', () => {
      const props: GraphViewProps = {
        title: 'Title',
        valueFormatter: formatEnergyValue,
        data: data,
        stack: isStack,
        loading: false,
      };
      const { container } = render(<GraphView {...props} />);

      expect(container).not.toDisplayLoader();

      const title = screen.getByRole('heading');
      expect(title).toHaveTextContent(props.title);

      const currentValue = screen.getByRole('heading').nextSibling;
      expect(currentValue).toHaveTextContent(`${theLatestValue} Wh`);

      const areaChart = screen.getByTestId('areaChart');
      expect(areaChart).toBeVisible();

      const categories = Object.keys(data[0]).filter(isGraphCategory);
      const series = (AreaChart as unknown as jest.Mock).mock.lastCall[0].series;
      expect(series.map((s: { name: any }) => s.name)).toEqual(categories);
    });

    test('If it is loading, render a loader', () => {
      const props: GraphViewProps = {
        title: 'Title',
        valueFormatter: formatEnergyValue,
        data: undefined,
        stack: isStack,
        loading: true,
      };
      const { container } = render(<GraphView {...props} />);

      expect(container).toDisplayLoader();

      const title = screen.getByRole('heading');
      expect(title).toHaveTextContent(props.title);

      const currentValue = screen.getByRole('heading').nextSibling;
      expect(currentValue).toBeEmptyDOMElement();

      const areaChart = screen.queryByTestId('areaChart');
      const lineChart = screen.queryByTestId('lineChart');
      expect(areaChart).toBeNull();
      expect(lineChart).toBeNull();
    });

    test.each`
      theLatestValue
      ${undefined}
      ${null}
      ${NaN}
    `('If the lastest value is not number, "- <unit>" is displayed', ({ theLatestValue }) => {
      const dataWithoutTheLatestValue = data.map((item: { [x: string]: any }, idx: number) => {
        // Change the value of the key other than the date key to theLatestValue
        if (idx === data.length - 1) {
          const a: { [key: string]: any } = {};
          Object.keys(item).forEach((key) => {
            if (key !== 'date') {
              a[key] = theLatestValue;
            } else {
              a[key] = item[key];
            }
          });
          return a;
        }
        return item;
      });

      const props: GraphViewProps = {
        title: 'Title',
        valueFormatter: formatEnergyValue,
        data: dataWithoutTheLatestValue,
        stack: isStack,
      };
      render(<GraphView {...props} />);

      const title = screen.getByRole('heading');
      expect(title).toHaveTextContent(props.title);

      const currentValue = screen.getByRole('heading').nextSibling;
      expect(currentValue).toHaveTextContent('- Wh');

      const areaChart = screen.getByTestId('areaChart');
      expect(areaChart).toBeVisible();
    });

    test.each([undefined, [], [{ date: '3/6' }, { date: '3/7' }]])(
      'If data does not contain any category, the latest value and a chart are not displayed: data=%o',
      (dataWithoutCategory) => {
        const props: GraphViewProps = {
          title: 'Title',
          valueFormatter: formatEnergyValue,
          data: dataWithoutCategory,
          stack: isStack,
        };
        render(<GraphView {...props} />);

        const title = screen.getByRole('heading');
        expect(title).toHaveTextContent(props.title);

        const currentValue = screen.getByRole('heading').nextSibling;
        expect(currentValue).toBeEmptyDOMElement();

        const noDataText = screen.getByText('No data');
        expect(noDataText).toBeVisible();

        const areaChart = screen.queryByTestId('areaChart');
        const lineChart = screen.queryByTestId('lineChart');
        expect(areaChart).toBeNull();
        expect(lineChart).toBeNull();
      }
    );

    test("xAxisTickFormatter should return 'MM dd, hh' format", () => {
      const props: GraphViewProps = {
        title: 'Title',
        valueFormatter: formatEnergyValue,
        data: data,
        stack: isStack,
      };
      render(<GraphView {...props} />);

      // @ts-ignore next-line
      const tickFormatter = AreaChart.mock.calls[0][0].xAxisProps.tickFormatter;
      expect(tickFormatter('2022-03-06T00:00:00.000Z')).toBe('Mar 6, 12 AM');
      expect(tickFormatter('2022-03-06T23:00:00.000Z')).toBe('Mar 6, 11 PM');
    });

    test('areaProps should be passed', () => {
      const props: GraphViewProps = {
        title: 'Title',
        valueFormatter: formatEnergyValue,
        data: data,
        stack: isStack,
      };
      render(<GraphView {...props} />);

      // @ts-ignore next-line
      const areaProps = AreaChart.mock.calls[0][0].areaProps;
      // areaProps is a function
      const result = areaProps({ color: 'blue' });
      expect(result.fill).toBe('var(--mantine-color-blue-filled)');
      expect(result.stroke).toBe('var(--mantine-color-blue-filled)');
      expect(result.result).toBeFalsy();
    });
  });

  describe.each`
    isStack
    ${false}
    ${undefined}
  `('LineChart', ({ isStack }) => {
    test('Render a LineChart: stack=%o', () => {
      const props: GraphViewProps = {
        title: 'Title',
        valueFormatter: formatEnergyValue,
        data: multiChartData,
        stack: isStack,
        loading: false,
      };

      const { container } = render(<GraphView {...props} />);

      expect(container).not.toDisplayLoader();

      const title = screen.getByRole('heading');
      expect(title).toHaveTextContent(props.title);

      const currentValue = screen.getByRole('heading').nextSibling;
      expect(currentValue).toBeEmptyDOMElement();

      const lineChart = screen.getByTestId('lineChart');
      expect(lineChart).toBeVisible();

      const categories = Object.keys(multiChartData[0]).filter(isGraphCategory);
      const series = (LineChart as unknown as jest.Mock).mock.lastCall[0].series;
      expect(series.map((s: { name: any }) => s.name)).toEqual(categories);
    });

    test('If it is loading, render a loader', () => {
      const props: GraphViewProps = {
        title: 'Title',
        valueFormatter: formatEnergyValue,
        data: undefined,
        stack: isStack,
        loading: true,
      };
      const { container } = render(<GraphView {...props} />);

      expect(container).toDisplayLoader();

      const title = screen.getByRole('heading');
      expect(title).toHaveTextContent(props.title);

      const currentValue = screen.getByRole('heading').nextSibling;
      expect(currentValue).toBeEmptyDOMElement();

      const areaChart = screen.queryByTestId('areaChart');
      const lineChart = screen.queryByTestId('lineChart');
      expect(areaChart).toBeNull();
      expect(lineChart).toBeNull();
    });

    test.each([undefined, [], [{ date: '3/6' }, { date: '3/7' }]])(
      'If data does not contain any category, the latest value and a chart are not displayed: data=%o',
      (dataWithoutCategory) => {
        const props: GraphViewProps = {
          title: 'Title',
          valueFormatter: formatEnergyValue,
          data: dataWithoutCategory,
          stack: isStack,
        };
        render(<GraphView {...props} />);

        const title = screen.getByRole('heading');
        expect(title).toHaveTextContent(props.title);

        const currentValue = screen.getByRole('heading').nextSibling;
        expect(currentValue).toBeEmptyDOMElement();

        const noDataText = screen.getByText('No data');
        expect(noDataText).toBeVisible();

        const areaChart = screen.queryByTestId('areaChart');
        const lineChart = screen.queryByTestId('lineChart');
        expect(areaChart).toBeNull();
        expect(lineChart).toBeNull();
      }
    );

    test("xAxisTickFormatter should return 'MM dd, hh' format", () => {
      const props: GraphViewProps = {
        title: 'Title',
        valueFormatter: formatEnergyValue,
        data: multiChartData,
        stack: isStack,
      };
      render(<GraphView {...props} />);

      // @ts-ignore next-line
      const tickFormatter = LineChart.mock.calls[0][0].xAxisProps.tickFormatter;
      expect(tickFormatter('2022-03-06T00:00:00.000Z')).toBe('Mar 6, 12 AM');
      expect(tickFormatter('2022-03-06T23:00:00.000Z')).toBe('Mar 6, 11 PM');
    });
  });

  test.each([true, false])('The specified color and link are reflected for any graph, stack=%p', (stack) => {
    const props: GraphViewProps = {
      title: 'Title',
      valueFormatter: formatEnergyValue,
      data: chartData,
      stack: stack,
      link: 'test',
      query: {
        cxlSwitchId: ['test', 'test2'] as string[],
        type: ['CPU'] as APIDeviceType[],
        allocatednode: ['test'] as string[],
        state: ['Enabled'] as APIDeviceState[],
        health: ['OK'] as APIDeviceHealth[],
        resourceAvailable: ['Available'] as APIDeviceAvailable[],
      } as ResourceListQuery,
    };
    render(<GraphView {...props} />);

    // const query: ResourceListQuery | undefined = props.query;
    const query = props.query as ResourceListQuery;
    query.cxlSwitchId?.forEach((item) => {
      expect(screen.getByTestId(`Mock_Link_query_cxlSwitchId`)).toHaveTextContent(item);
    });

    query.type?.forEach((item) => {
      expect(screen.getByTestId(`Mock_Link_query_type`)).toHaveTextContent(item);
    });

    query.allocatednode?.forEach((item) => {
      expect(screen.getByTestId(`Mock_Link_query_allocatednode`)).toHaveTextContent(item);
    });

    query.state?.forEach((item) => {
      expect(screen.getByTestId(`Mock_Link_query_state`)).toHaveTextContent(item);
    });

    query.health?.forEach((item) => {
      expect(screen.getByTestId(`Mock_Link_query_health`)).toHaveTextContent(item);
    });

    query.resourceAvailable?.forEach((item: string) => {
      expect(screen.getByTestId(`Mock_Link_query_resourceAvailable`)).toHaveTextContent(item);
    });
  });

  describe('isGraphCategory', () => {
    test.each([
      'Accelerator',
      'CPU',
      'DSP',
      'FPGA',
      'GPU',
      'UnknownProcessor',
      'Memory',
      'Storage',
      'NetworkInterface',
      'GraphicController',
      'VirtualMedia',
      'All',
    ])('It should be a supported category', (category) => {
      const result = isGraphCategory(category);

      expect(result).toBe(true);
    });

    test.each([
      'accelerator',
      'cpu',
      'dsp',
      'fpga',
      'gpu',
      'Unknownprocessor',
      'unknownProcessor',
      'unknownprocessor',
      'memory',
      'storage',
      'Networkinterface',
      'networkInterface',
      'networkinterface',
      'Graphiccontroller',
      'graphicController',
      'graphiccontroller',
      'Virtualmedia',
      'virtualMedia',
      'virtualmedia',
      'all',
    ])('It should be an unsupported category', (category) => {
      const result = isGraphCategory(category);

      expect(result).toBe(false);
    });
  });
});
