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

import { useMantineTheme } from '@mantine/core';

export const useColorStyles = () => {
  const theme = useMantineTheme();
  return {
    red: {
      color: theme.colors.red[8],
      backgroundColor: theme.colors.red[2],
    },
    yellow: {
      color: theme.colors.yellow[7],
      backgroundColor: theme.colors.yellow[2],
    },
    blue: {
      backgroundColor: theme.colors.blue[1],
    },
    gray: {
      color: theme.colors.gray[6],
      backgroundColor: theme.colors.gray[3],
    },
    lightgray: {
      backgroundColor: theme.colors.gray[1],
    },
    green: {
      color: theme.colors.green[6],
    },
  };
};
