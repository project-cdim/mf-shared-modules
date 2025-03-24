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

import axios from 'axios';

/**
 * Execute the API request
 *
 * @param url Request destination URL
 * @returns Response data
 */
export const fetcherForPromql = (url: string) => {
  const { startDate, endDate } = getTheLastMonthRangeString();
  const urlWithDates = `${url}&start=${startDate}&end=${endDate}&step=1h`;

  return axios.get(urlWithDates).then((res) => {
    return { ...res.data, url: res.request?.responseURL };
  });
};

const getTheLastMonthRangeString = () => {
  const endDate = new Date().toISOString();
  const startDate = new Date(
    new Date().setMonth(new Date().getMonth() - 1)
  ).toISOString();

  return { startDate, endDate };
};

export const fetcherForPromqlByPost = async (url: string, params: URLSearchParams) => {
  return axios
    .post(url, params.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
    .then((response) => response.data);
};
