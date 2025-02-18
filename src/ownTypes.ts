export type ExperimentTemplate = {
  uid: number
  name: string
  date: string
  config_file: HardwareConfig
  active_lane: number
  led_front: LED
  led_front_intensity: number
  led_front_distance_to_vial: number
  led_front_exposure_time: number
  led_back: LED
  led_back_intensity: number
  led_back_distance_to_vial: number
  led_back_exposure_time: number
  time_points_sample_taking: number[]
  position_thermocouple: string
}

export type HardwareConfig = {
  uid: number
  name: string
  tinkerforge_bricklets: TinkerforgeBricklet[]
  software_version: string
  date: string
  default_distance_led_vial: number
  default_position_thermocouple: string
  default_pwm_channels: number[]
  default_temperature_threshold: number
  default_uv_threshold: number
  default_sensor_query_interval: number
  default_reaction_vessel_volume: number
}

export type LED = {
  uid: number
  name: string
  fwhm: number
  max_of_emission: number
  min_wavelength: number
  max_wavelength: number
  color: string
  max_current: number
  manufacturer_id: number
  order_id: number
  date_soldering: number
  soldered_by: number
  operating_time: number
  defect: boolean
  emission_spectrum: EmmissionPair[]
  emission_spectrum_recorded_on: string
}

export type EmmissionPair = {
  wavelength: number
  intensity: number
}

export type TinkerforgeBricklet = {
  uid: number
  name: string
  version: string
  defective: boolean
  date_bought: string
}

export type fileType = {
  uid: number
  description: string
}

