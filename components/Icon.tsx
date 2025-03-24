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

import {
  IconAlertCircleFilled,
  IconAlertTriangleFilled,
  IconBan,
  IconCheck,
  IconPlayerPause,
} from '@tabler/icons-react';

import { useColorStyles } from '../styles/styles';
import { APPStatus } from '../types';

const useHook = (props: { status: APPStatus | undefined; size?: number }) => {
  const { red, yellow, gray, green } = useColorStyles();

  const map = new Map([
    ['Critical', { icon: IconAlertCircleFilled, color: red.color }],
    ['Failed', { icon: IconAlertCircleFilled, color: red.color }],
    ['Warning', { icon: IconAlertTriangleFilled, color: yellow.color }],
    ['Suspended', { icon: IconPlayerPause, color: yellow.color }],
    ['OK', { icon: IconCheck, color: green.color }],
    ['Disabled', { icon: IconBan, color: gray.color }],
    ['Available', { icon: IconCheck, color: green.color }],
    ['Unavailable', { icon: IconBan, color: red.color }],
    ['ALL', {}],
    [undefined, {}],
  ]);

  const IconTag = map.get(props.status)?.icon || undefined;

  const size = props.size ?? 40;

  const color = map.get(props.status)?.color || undefined;

  return {
    IconTag,
    size,
    style: { minWidth: '38px' },
    color,
  };
};

const Component = ({
  IconTag,
  size,
  style,
  color,
}: ReturnType<typeof useHook>) => {
  if (IconTag)
    return <IconTag size={size} style={style} color={color}></IconTag>;
  return null;
};

export const Icon = (props: Parameters<typeof useHook>[0]) => (
  <Component {...useHook(props)} />
);
