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
  size_sample: number
  measurement_interval: number
  position_thermocouple: string
}

export type HardwareConfig = {
  uid: number
  name: string
  date: string
  default_distance_led_vial: string
  default_position_thermocouple: string
  default_temperature_threshold: number
  default_uv_threshold: number
  default_reaction_vessel_volume: number
}

export type LED = {
  uid: number
  name: string
  max_current_ma: number
  min_wavelength: number
  max_wavelength: number
  color: string
  fwhm: number
  max_of_emission: number
  soldered_by_on: string
  defect: boolean
  emission_spectrum: string
  misc: string
}

export type fileType = {
  uid: number
  description: string
}

