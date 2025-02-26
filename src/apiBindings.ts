/* eslint-disable @typescript-eslint/no-explicit-any */
import { Experiment, ExperimentTemplate, HardwareConfig, LED } from './configTypes';
import axios, { AxiosResponse } from 'axios';

function upload_config(conf: object, route: string): Promise<AxiosResponse<any, any>> {
  const json_data = JSON.stringify(conf);

  console.log(`Uploading to route ${route}: ${json_data}`);

  const json_file = new Blob([json_data], {
    type: 'application/json',
  });
  const fd = new FormData();
  fd.append('json_file', json_file, 'formData.json');

  return axios.post(route, fd, {
    headers: {
      'Content-Type': 'multipart/form-data',
    }
  });
}

function get_config(route: string, uid: number): Promise<object> {
  return axios.get(route, {
    params: {
      uid: uid
    }
  })
  .then(resp => {
    return resp.data;
  })
  .catch(err => alert(`Error: Could not find uid ${uid} on route ${route} (${err})`))
}

function list_configs(route: string): Promise<{ uid: number, description: string }[]> {
  return axios.get(route)
    .then(response => { return response.data["results"]; })
    .catch(error => console.log(`Failed to get list of configs at ${route}: ${error}`));
}

export function upload_led(led: LED): Promise<AxiosResponse<any, any>> {
  return upload_config(led, "led");
}

export function upload_template(template: ExperimentTemplate): Promise<AxiosResponse<any, any>> {
  console.log(template);
  return upload_config(template, "exp_tmp");
}

export function upload_hw_conf(hw: HardwareConfig): Promise<AxiosResponse<any, any>> {
  return upload_config(hw, "config");
}

export function list_leds(): Promise<{ uid: number, description: string}[]> {
  return list_configs("list_led");
}

export function list_templates(): Promise<{ uid: number, description: string}[]> {
  return list_configs("list_exp_tmp");
}

export function list_hw_confs(): Promise<{ uid: number, description: string}[]> {
  return list_configs("list_config");
}

export function list_experiments(): Promise<{ uid: number, description: string}[]> {
  return list_configs("list_experiment");
}

export function get_led(uid: number): Promise<LED> {
  return get_config("led", uid) as Promise<LED>;
}

export function get_template(uid: number): Promise<ExperimentTemplate> {
  return get_config("exp_tmp", uid) as Promise<ExperimentTemplate>;
}

export function get_hw_conf(uid: number): Promise<HardwareConfig> {
  return get_config("config", uid) as Promise<HardwareConfig>;
}

export function get_experiment(uid: number): Promise<Experiment> {
  return get_config("experiment", uid) as Promise<Experiment>;
}
