/* eslint-disable @typescript-eslint/no-explicit-any */
import { LED } from './configTypes';
import axios, { AxiosResponse } from 'axios';

export function upload_led(led: LED): Promise<AxiosResponse<any, any>> {
  console.log(`Uploading led ${led}`);

  const json_file = new Blob([JSON.stringify(led)], {
    type: 'application/json',
  });
  const fd = new FormData();
  fd.append('json_file', json_file, 'formData.json');

  return axios.post('led', fd, {
    headers: {
      'Content-Type': 'multipart/form-data',
    }
  })
}
