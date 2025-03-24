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

/** An array of timestamp and metric value string pairs */
export type APIPromQLMetrics = [number, string][];

/** Type definition of PromQL response */
export type APIPromQL = {
  status: string;
  data: {
    resultType: string;
    result: {
      metric: {
        __name__?: string;
        instance: string;
        job: string;
        data_label: string;
      };
      values: [
        /** unix timestamp */
        number,
        /** value string */
        string,
      ][];
    }[];
  };
  stats: {
    seriesFetched: string;
  };
};

/** Type definition of PromQL response for a single point */
export type APIPromQLSingle = {
  status: string;
  data: {
    resultType: string;
    result: {
      metric: {
        __name__?: string;
        instance?: string;
        job?: string;
        data_label: string;
      };
      value: [
        /** unix timestamp */
        number,
        /** value string */
        string,
      ];
    }[];
  };
  stats: {
    seriesFetched: string;
  };
};

export type APIPromQLRange = {
  status: string;
  data: {
    resultType: string;
    result: {
      metric: {
        data_label: string;
      };
      values: APIPromQLMetrics;
    }[];
  };
  stats: {
    seriesFetched: string;
  };
};
