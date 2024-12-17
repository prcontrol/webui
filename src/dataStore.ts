import { reactive } from "vue";
import webSocket from './webSocket';

type ReactorBoxState = {
  thermocouple_temp: number
  ambient_light: number
  ambient_temperature: number
  lane_ir_temp1: number
  lane_ir_temp2:number
  lane_ir_temp3: number
  uv_index: number

  lane_sample_taken1: boolean
  lane_sample_taken2: boolean
  lane_sample_taken3: boolean
  maintenance_mode: boolean
  photobox_cable_control: boolean
}

type PowerBoxState = {
  abmient_temperature: number
  voltage_total: number
  current_total: number
  voltage_lane1: number
  voltage_lane2: number
  voltage_lane3: number
  current_lane1: number
  current_lane2: number
  current_lane3: number
}

type ReactorState = {
  reactor_box: ReactorBoxState;
  power_box: PowerBoxState;
}

export const pcrData = reactive({
  allData: {
    reactor_box: {
        thermocouple_temp: 0,
        ambient_light: 0,
        ambient_temperature: 0,
        lane_ir_temp1: 0,
        lane_ir_temp2: 0,
        lane_ir_temp3: 0,
        uv_index: 0,
        lane_sample_taken1: false,
        lane_sample_taken2: false,
        lane_sample_taken3: false,
        maintenance_mode: false,
        photobox_cable_control: false,
    },
    power_box: {
        abmient_temperature: 0,
        voltage_total: 0,
        current_total: 0,
        voltage_lane1: 0,
        voltage_lane2: 0,
        voltage_lane3: 0,
        current_lane1: 0,
        current_lane2: 0,
        current_lane3: 0,
    }
  } as ReactorState,


  initWebSocket(url: string): void {
    webSocket.openWebSocket(url);

    //Get header data
    webSocket.subscribe('pcr_data', (message) => {
      this.allData = {...this.allData, ...message.data};
    });
  },
})
