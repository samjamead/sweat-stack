export interface StravaActivity {
  id: number;
  name: string;
  distance: number;
  moving_time: number;
  elapsed_time: number;
  total_elevation_gain: number;
  type: string;
  sport_type: string;
  start_date: string;
  start_date_local: string;
  timezone: string;
  start_latlng: number[];
  end_latlng: number[];
  achievement_count: number;
  kudos_count: number;
  comment_count: number;
  athlete_count: number;
  map: {
    id: string;
    summary_polyline: string;
    resource_state: number;
  };
  average_speed: number;
  max_speed: number;
  average_watts: number;
  kilojoules: number;
  average_heartrate?: number;
  max_heartrate?: number;
}
