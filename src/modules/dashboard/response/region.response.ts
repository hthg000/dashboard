import { Regions } from "../models";

export interface RegionsResponse {
  current_page:   number;
  first_page_url: string;
  last_page_url:  string;
  next_page_url:  string;
  prev_page_url:  null;
  per_page:       string;
  last_page:      number;
  from:           number;
  path:           string;
  to:             number;
  total:          number;
  data:           Regions[];
}

