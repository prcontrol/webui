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
  photobox_cable_control: boolean
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
}

export type ReactorState = {
  reactor_box: ReactorBoxState;
  power_box: PowerBoxState;
}
//all set to 0 and false for demonstration purpose
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
  });

export function register_pcr_data() {
  ws_observables.pcrdata.register((data) => {
     // Logge die gesamte empfangene Datenstruktur zur Überprüfung
    console.log("UPDATE empfangen:", JSON.stringify(data, null, 2));


    const reactor_box = data.reactor_box;
    const power_box = data.power_box;

    pcr_data.reactor_box.thermocouple_temp = reactor_box.thermocouple_temp;
    pcr_data.reactor_box.ambient_light = reactor_box.ambient_light;
    pcr_data.reactor_box.ambient_temperature = reactor_box.ambient_temperature;
    pcr_data.reactor_box.lane_1_ir_temp = reactor_box.lane_1_ir_temp;
    pcr_data.reactor_box.lane_2_ir_temp = reactor_box.lane_2_ir_temp;
    pcr_data.reactor_box.lane_3_ir_temp = reactor_box.lane_3_ir_temp;
    pcr_data.reactor_box.uv_index = reactor_box.uv_index;
    pcr_data.reactor_box.lane_1_sample_taken = reactor_box.lane_1_sample_taken;
    pcr_data.reactor_box.lane_2_sample_taken = reactor_box.lane_2_sample_taken;
    pcr_data.reactor_box.lane_3_sample_taken = reactor_box.lane_3_sample_taken;
    pcr_data.reactor_box.maintenance_mode = reactor_box.maintenance_mode;
    pcr_data.reactor_box.photobox_cable_control = reactor_box.photobox_cable_control;

    pcr_data.power_box.abmient_temperature = power_box.ambient_temperature;
    pcr_data.power_box.voltage_total = power_box.voltage_total;
    pcr_data.power_box.current_total = power_box.current_total;
    pcr_data.power_box.voltage_lane_1_front = power_box.voltage_lane_1_front;
    pcr_data.power_box.voltage_lane_1_back = power_box.voltage_lane_1_back;
    pcr_data.power_box.voltage_lane_2_front = power_box.voltage_lane_2_front;
    pcr_data.power_box.voltage_lane_2_back = power_box.voltage_lane_2_back;
    pcr_data.power_box.voltage_lane_3_front = power_box.voltage_lane_3_front;
    pcr_data.power_box.voltage_lane_3_back = power_box.voltage_lane_3_back;
    pcr_data.power_box.current_lane_1_front = power_box.current_lane_1_front;
    pcr_data.power_box.current_lane_1_back = power_box.current_lane_1_back;
    pcr_data.power_box.current_lane_2_front = power_box.current_lane_2_front;
    pcr_data.power_box.current_lane_2_back = power_box.current_lane_2_back;
    pcr_data.power_box.current_lane_3_front = power_box.current_lane_3_front;
    pcr_data.power_box.current_lane_3_back = power_box.current_lane_3_back
    pcr_data.power_box.powerbox_closed = power_box.powerbox_closed;
    pcr_data.power_box.reactorbox_closed = power_box.reactorbox_closed;
    pcr_data.power_box.led_installed_lane_1_front_and_vial = power_box.led_installed_lane_1_front_and_vial;
    pcr_data.power_box.led_installed_lane_1_back = power_box.led_installed_lane_1_back;
    pcr_data.power_box.led_installed_lane_2_front_and_vial = power_box.led_installed_lane_2_front_and_vial;
    pcr_data.power_box.led_installed_lane_2_back = power_box.led_installed_lane_2_back;
    pcr_data.power_box.led_installed_lane_3_front_and_vial = power_box.led_installed_lane_3_front_and_vial;
    pcr_data.power_box.led_installed_lane_3_back = power_box.led_installed_lane_3_back;
    pcr_data.power_box.water_detected = power_box.water_detected;

  });
}
