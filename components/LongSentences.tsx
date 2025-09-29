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

import React, { useRef, useLayoutEffect, useState } from 'react';

type Props = {
  text: string;
  lines?: number;
  truncate?: boolean;
  title?: string;
};

export const LongSentences = ({ text, lines = 1, truncate = true, title }: Props) => {
  const divRef = useRef<HTMLDivElement>(null);
  const [isTruncated, setIsTruncated] = useState(false);

  useLayoutEffect(() => {
    if (divRef.current) {
      const element = divRef.current;
      const isOverflowing = element.scrollWidth > element.clientWidth || element.scrollHeight > element.clientHeight;
      setIsTruncated(isOverflowing);
    }
  }, [text, lines, truncate]);

  const style = {
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical' as const,
    overflow: truncate ? 'hidden' : 'visible',
    textOverflow: truncate ? 'ellipsis' : 'clip',
    WebkitLineClamp: truncate ? lines.toString() : 'unset',
  };

  return (
    <div ref={divRef} style={style} title={isTruncated ? title || text : undefined}>
      {text}
    </div>
  );
};
