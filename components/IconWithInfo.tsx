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

import { Tooltip } from '@mantine/core';
import {
  IconAlertCircleFilled,
  IconAlertTriangleFilled,
  IconBan,
  IconCheck,
  IconInfoCircle,
  IconPlayerPause,
  IconPlayerSkipForwardFilled,
  IconProgressCheck,
  IconProgressX,
  IconX,
} from '@tabler/icons-react';

import { useColorStyles } from '@/shared-modules/styles/styles';

type IconWithInfoType = {
  /** The label for the tooltip. */
  label: string;
  /** The type of the icon. */
  type:
    | 'check'
    | 'info'
    | 'warning'
    | 'critical'
    | 'ban'
    | 'disabled'
    | 'in_progress'
    | 'canceling'
    | 'canceled'
    | 'suspended'
    | 'skipped';
  size?: number;
};

/**
 * Renders an icon with additional information in a tooltip.
 *
 * @param props {@link IconWithInfoType}
 * @returns The rendered IconWithInfo component.
 */
export const IconWithInfo = ({ label, type, size = 20 }: IconWithInfoType) => {
  const { red, yellow, gray, green } = useColorStyles();
  const colors = {
    /** green 6 */
    green: green.color,
    /** green 6 */
    check: green.color,
    /** gray6 */
    gray: gray.color,
    /** gray6 */
    disabled: gray.color,
    /** gray6 */
    info: gray.color,
    /** yellow 7 */
    yellow: yellow.color,
    /** yellow 7 */
    warning: yellow.color,
    /** red 8 */
    red: red.color,
    /** red 8 */
    critical: red.color,
    /** red 8 */
    ban: red.color,
    /** green 6 */
    in_progress: green.color,
    /** gray6 */
    canceling: gray.color,
    /** gray6 */
    canceled: gray.color,
    /** yellow 7 */
    suspended: yellow.color,
    /** gray6 */
    skipped: gray.color,
  };

  const icon = {
    check: <IconCheck color={colors.green} size={size} />,
    info: <IconInfoCircle color={colors.gray} size={size} />,
    warning: (
      <IconAlertTriangleFilled style={{ color: colors.yellow }} size={size} />
    ),
    critical: (
      <IconAlertCircleFilled style={{ color: colors.red }} size={size} />
    ),
    ban: <IconBan color={colors.red} size={size} />,
    disabled: <IconBan color={colors.disabled} size={size} />,
    in_progress: <IconProgressCheck color={colors.in_progress} size={size} />,
    canceling: <IconProgressX color={colors.canceling} size={size} />,
    canceled: <IconX color={colors.canceled} size={size} />,
    suspended: <IconPlayerPause color={colors.suspended} size={size} />,
    skipped: (
      <IconPlayerSkipForwardFilled
        style={{ color: colors.skipped }}
        size={size}
      />
    ),
  };

  return (
    <Tooltip
      label={label}
      openDelay={300}
      closeDelay={200}
      withArrow
      color={colors[type]}
      multiline={true}
      maw={400}
    >
      {icon[type]}
    </Tooltip>
  );
};
