import { reactive } from "vue";
import { ws_observables } from "./main";

type ReactorBoxState = {
  thermocouble_temp: number
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
  photobox_cable_control: boolean
}

type PowerBoxState = {
  abmient_temperature: number
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
}

export type ReactorState = {
  reactor_box: ReactorBoxState;
  power_box: PowerBoxState;
}
//all set to 0 and false for demonstration purpose

export function genPcrData(): ReactorState {
  const _pcrData = reactive(
    {
      reactor_box: {
        thermocouble_temp: 0,
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
        photobox_cable_control: false,
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
      }
    }
  );

  console.log("Registering callback")

  ws_observables.pcrdata.register(({reactor_box, power_box}) => {
    _pcrData.power_box = power_box;
    _pcrData.reactor_box = reactor_box;
    console.log("Receiving callback");
  });

  return _pcrData;
}
