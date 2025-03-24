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

import { AreaChart, AreaChartProps, ChartTooltip, LineChart } from '@mantine/charts';
import { Divider, getThemeColor, Group, Space, Stack, Text, Title, useMantineTheme } from '@mantine/core';
import { useLocale } from 'next-intl';

import { CardLoading, NoData, PageLink } from '@/shared-modules/components';
import { APIProcessorType, ResourceListQuery } from '@/shared-modules/types';

import { CHART_COLORS } from '../constant';

// Graph category definition
export type GraphCategory =
  | APIProcessorType
  | 'Memory'
  | 'Storage'
  | 'NetworkInterface'
  | 'GraphicController'
  | 'VirtualMedia'
  | 'All';

export const isGraphCategory = (arg: string): arg is GraphCategory => {
  return [
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
  ].includes(arg);
};

export type GraphViewData = ({
  [key in GraphCategory]?: number | null; // AreaChart's number data can be string
} & {
  /** for x axis value(MM:dd, hh AM/PM format if in en locale) */
  date: string;
})[];

/** Props for the GraphView component */
export type GraphViewProps = {
  /** Title */
  title: string;
  /** Graph data */
  data: GraphViewData | undefined;
  /** Text formatter for the y-axis values. Also used in the Tooltip */
  valueFormatter: (val?: number | null) => string;
  /** Flag to make it a stacked graph */
  stack?: boolean;
  /** Link title */
  linkTitle?: string;
  /** Link destination */
  link?: string;
  /** Link destination parameter */
  query?: ResourceListQuery | { tab: string };
  /** Loading state */
  loading?: boolean;
};

/**
 * Component to display the time series area chart
 *
 * @param props {@link GraphViewProps}
 * @returns Graph JSX.Element
 */
export const GraphView = (props: GraphViewProps) => {
  return (
    <CardLoading withBorder h={'100%'} loading={props.loading ?? false}>
      <GraphViewInner {...props} />
    </CardLoading>
  );
};

export const GraphViewInner = (props: Exclude<GraphViewProps, 'loading'>) => {
  const { title, data, valueFormatter, stack, linkTitle, link, query } = props;
  const currentLanguage = useLocale();
  const theme = useMantineTheme();

  // Get keys other than date in an array
  const categories: GraphCategory[] =
    data && data.length > 0 ? Object.keys(data[0]).filter<GraphCategory>(isGraphCategory) : [];

  const isAreaChart = stack || categories.length === 1;

  const getCurrentValue = () => {
    if (data === undefined || !isAreaChart || categories.length === 0) return <Space h='xl' />;

    // If it is a stacked graph (unit J), calculate the sum of the latest values and display them
    const values = categories.reduce((sum: number | null, category) => {
      const currentVal = data[data.length - 1][category];

      // Ignore if it cannot be converted to a number
      if (Number.isNaN(currentVal) || currentVal === undefined || currentVal === null) return sum;

      // Add if the string can be converted to a number
      return (sum ?? 0) + currentVal;
    }, null);
    return (
      <Text fz='1.875rem' fw={600}>
        {valueFormatter(values)}
      </Text>
    );
  };

  const series = categories.map((category, idx) => ({
    name: category,
    color: CHART_COLORS[idx],
  }));

  const chartProps: Pick<
    AreaChartProps,
    | 'className'
    | 'h'
    | 'data'
    | 'dataKey'
    | 'series'
    | 'connectNulls'
    | 'strokeDasharray'
    | 'tickLine'
    | 'valueFormatter'
    | 'withLegend'
    | 'tooltipProps'
    | 'xAxisProps'
  > = {
    className: 'h-72 mt-4',
    h: '100%',
    data: data || [],
    dataKey: 'date',
    series: series,
    connectNulls: false,
    strokeDasharray: '0 0',
    tickLine: 'x',
    valueFormatter: valueFormatter,
    withLegend: true,
    tooltipProps: {
      content: ({ label, payload }) => (
        <ChartTooltip
          label={label}
          // @ts-ignore
          payload={payload?.toReversed()}
          series={series}
          valueFormatter={valueFormatter}
        />
      ),
    },
    xAxisProps: {
      interval: 'equidistantPreserveStart',
      tickFormatter: (v: string) => getDateTimeStringWithoutMinuteAndSecond(v, currentLanguage),
    },
  };

  return (
    <Stack justify='flex-end' h={'100%'}>
      <PageLink title={linkTitle} path={link} query={query} color='rgb(55 65 81 / var(--tw-text-opacity))'>
        <Group mih='2.90625rem' justify='space-between' align='end'>
          <Title order={3} size='h4'>
            {title}
          </Title>
          {getCurrentValue()}
        </Group>
      </PageLink>
      <Divider mb='auto' />
      <NoData isNoData={categories.length <= 0}>
        {isAreaChart ? (
          <AreaChart
            {...chartProps}
            type='stacked'
            // For display problem. if chart render successfully without this props, remove it.
            areaProps={(series) => ({
              fill: getThemeColor(series.color, theme),
              stroke: getThemeColor(series.color, theme),
              dot: false,
            })}
          />
        ) : (
          <LineChart {...chartProps} curveType='linear' withDots={false} />
        )}
      </NoData>
    </Stack>
  );
};

const getDateTimeStringWithoutMinuteAndSecond = (date: string, currentLanguage: string) => {
  return new Date(date).toLocaleString(currentLanguage, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
  });
};
