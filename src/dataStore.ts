import { reactive } from "vue";
import { ws_observables } from "./main";

type ReactorBoxState = {
  thermocouple_temp: number
  ambient_light:  number
  ambient_temperature: number
  lane_1_ir_temp: number
  lane_2_ir_temp: number
  lane_3_ir_temp: number
  uv_index: number
  lane_1_sample_taken: boolean
  lane_2_sample_taken: boolean
  lane_3_sample_taken: boolean
  maintenance_mode: boolean
  cable_control: boolean
}

type PowerBoxState = {
  ambient_temperature: number
  voltage_total: number
  current_total: number
  voltage_lane_1_front: number
  voltage_lane_1_back: number
  voltage_lane_2_front: number
  voltage_lane_2_back: number
  voltage_lane_3_front: number
  voltage_lane_3_back: number
  current_lane_1_front: number
  current_lane_1_back: number
  current_lane_2_front: number
  current_lane_2_back: number
  current_lane_3_front: number
  current_lane_3_back: number

  powerbox_closed: boolean
  reactorbox_closed: boolean
  led_installed_lane_1_front_and_vial: boolean
  led_installed_lane_1_back: boolean
  led_installed_lane_2_front_and_vial: boolean
  led_installed_lane_2_back: boolean
  led_installed_lane_3_front_and_vial: boolean
  led_installed_lane_3_back: boolean
  water_detected: boolean
  cable_control: boolean
}

type ControllerState = {
  reactor_box_connected: boolean
  power_box_connected: boolean
  sample_lane_1: boolean
  sample_lane_2: boolean
  sample_lane_3: boolean
  exp_running_lane_1: boolean
  exp_running_lane_2: boolean
  exp_running_lane_3: boolean
  uv_installed: boolean
  ambient_temp_status: ThresholdStatus
  IR_temp_1_threshold_status: ThresholdStatus
  IR_temp_2_threshold_status: ThresholdStatus
  IR_temp_3_threshold_status: ThresholdStatus
  thermocouple_theshold_status: ThresholdStatus
}

export enum ThresholdStatus {
  OK = 0,
  EXCEEDED = 1,
  OK_AGAIN = 2,
  ABORT = 3
}

export type ReactorState = {
  reactor_box: ReactorBoxState;
  power_box: PowerBoxState;
  controller: ControllerState;
}

export const pcr_data = reactive(
  {
    reactor_box: {
      thermocouple_temp: 0,
      ambient_light:  0,
      ambient_temperature: 0,
      lane_1_ir_temp: 0,
      lane_2_ir_temp: 0,
      lane_3_ir_temp: 0,
      uv_index: 0,
      lane_1_sample_taken: false,
      lane_2_sample_taken: false,
      lane_3_sample_taken: false,
      maintenance_mode: false,
      cable_control: false,
    },

    power_box: {
      abmient_temperature: 0,
      voltage_total: 0,
      current_total: 0,
      voltage_lane_1_front: 0,
      voltage_lane_1_back: 0,
      voltage_lane_2_front: 0,
      voltage_lane_2_back: 0,
      voltage_lane_3_front: 0,
      voltage_lane_3_back: 0,
      current_lane_1_front: 0,
      current_lane_1_back: 0,
      current_lane_2_front: 0,
      current_lane_2_back: 0,
      current_lane_3_front: 0,
      current_lane_3_back: 0,

      powerbox_closed: false,
      reactorbox_closed: false,
      led_installed_lane_1_front_and_vial: false,
      led_installed_lane_1_back: false,
      led_installed_lane_2_front_and_vial: false,
      led_installed_lane_2_back: false,
      led_installed_lane_3_front_and_vial: false,
      led_installed_lane_3_back: false,
      water_detected: false,
      cable_control: false,
    },

    controller: {
      reactor_box_connected: false,
      power_box_connected: false,
      sample_lane_1: false,
      sample_lane_2: false,
      sample_lane_3: false,
      exp_running_lane_1: false,
      exp_running_lane_2: false,
      exp_running_lane_3: false,
      uv_installed: false,
      ambient_temp_status: ThresholdStatus.OK,
      IR_temp_1_threshold_status: ThresholdStatus.OK,
      IR_temp_2_threshold_status: ThresholdStatus.OK,
      IR_temp_3_threshold_status: ThresholdStatus.OK,
      thermocouple_theshold_status: ThresholdStatus.OK,
    }
  });

export function register_pcr_data() {
  ws_observables.pcrdata.register((data: Partial<ReactorState>) => {
     // Logge die gesamte empfangene Datenstruktur zur Überprüfung
    console.log("UPDATE empfangen:", JSON.stringify(data, null, 2));

    Object.assign(pcr_data.reactor_box, data.reactor_box);
    Object.assign(pcr_data.power_box, data.power_box);
    Object.assign(pcr_data.controller, data.controller);

  });
}
