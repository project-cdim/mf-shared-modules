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

import { useLocaleDateString } from '@/shared-modules/utils/hooks';

/**
 * Returns a formatted string representation of a date.
 *
 * @param date - The date to format.
 * @returns The formatted date string wrapped in a <time> element.
 */
export const DatetimeString = (date: Date | undefined) => {
  const dateString = useLocaleDateString(date);
  if (date)
    return (
      // Due to Next.js specifications, using the Date constructor during rendering
      // causes differences between server-side rendering and client-side rendering, resulting in errors
      // To prevent the warning message from being displayed, suppressHydrationWarning is enabled
      // Reference: https://nextjs.org/docs/messages/react-hydration-error
      <time suppressHydrationWarning>{dateString}</time>
    );
  else return <></>;
};
