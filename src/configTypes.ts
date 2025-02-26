export type ExperimentTemplate = {
  uid: number
  name: string
  date: string
  config_file: HardwareConfig | null
  active_lane: number
  led_front: LED | null
  led_front_intensity: number
  led_front_distance_to_vial: number
  led_front_exposure_time: number
  led_back: LED | null
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

export type EventPair = {
  timepoint: number
  event: string
}

export type MeasuredDataAtTimePoint = {
  timepoint: number
  temperature_thermocouple: number
  ambient_temp_strombox: number
  ambient_temp_photobox: number
  voltage_lane1: number
  current_lane1: number
  ir_temp_lane1: number
  voltage_lane2: number
  current_lane2: number
  ir_temp_lane2: number
  voltage_lane3: number
  current_lane3: number
  ir_temp_lane3: number
  uv_index: number
  ambient_light: number
}

export type Experiment = {
  uid: number
  name: string
  lab_notebook_entry: string
  date: string
  config_file: HardwareConfig
  template_uid: number
  active_lane: number
  led_front: LED | null
  led_front_intensity: number
  led_front_distance_to_vial: number
  led_front_exposure_time: number
  led_back: LED | null
  led_back_intensity: number
  led_back_distance_to_vial: number
  led_back_exposure_time: number
  time_points_sample_taking: number[]
  size_sample: number
  parallel_experiments: number[]
  position_thermocouple: string
  error_occured: boolean
  experiment_cancelled: boolean
  event_log: EventPair[]
  measured_data: MeasuredDataAtTimePoint[]
}
