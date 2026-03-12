import type { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

export interface PhotoMeta {
  downloadURL: string;
  blurhash: string;
  filename: string;
}

export interface WeatherSnapshot {
  temperature: number;   // °C
  pressure: number;      // hPa
  windSpeed: number;     // km/h
  precipitation: number; // mm
  moonPhase: string;     // "Spln", "Novoluní", atď.
  moonIllumination: number; // 0-100 %
}

export interface CatchDocument {
  id: string;
  userId: string;
  userDisplayName: string;
  userAvatar: string;

  species: string;       // "Kapor"
  weightG: number;       // v gramoch — presnosť, nie kg
  lengthCm: number;
  method?: string;       // "Feeder", "Lov na plávok"
  bait?: string;
  depthM?: number;

  photos: PhotoMeta[];

  locationName?: string;
  locationGPS?: {
    latitude: number;
    longitude: number;
  };

  weather: WeatherSnapshot;

  caption?: string;
  isPublic: boolean;
  likes: number;
  likedBy: string[];

  createdAt: FirebaseFirestoreTypes.Timestamp;
  updatedAt: FirebaseFirestoreTypes.Timestamp;
}

export interface CatchFilter {
  species?: string;
  locationName?: string;
  dateFrom?: Date;
  dateTo?: Date;
  method?: string;
}
