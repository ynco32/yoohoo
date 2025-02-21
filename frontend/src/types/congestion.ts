export interface ApiStatus {
  code: string;
  message: string;
  totalCount: number;
}

export interface RltmData {
  datetime: string;
  congestion: number;
  congestionLevel: number;
  type: number;
}

export interface Contents {
  poiId: string;
  poiName: string;
  rltm: RltmData[];
}

export interface ApiResponse {
  status: ApiStatus;
  contents: Contents;
}

export interface ProcessedCongestion {
  locationNumber: number;
  latitude: number;
  longitude: number;
  congestion: number;
  congestionLevel: number;
}

export interface LocationInfo {
  locationNumber: number;
  latitude: number;
  longitude: number;
}
