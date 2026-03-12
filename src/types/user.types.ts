import type { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

export interface UserStats {
  catchCount: number;
  totalWeightG: number;
  biggestCatchG: number;
  biggestCatchSpecies: string;
}

export interface UserDocument {
  uid: string;
  displayName: string;
  username: string;      // @handle — lowercase, unique
  bio?: string;          // max 300 znakov
  avatarURL?: string;
  avatarBlurhash?: string;

  stats: UserStats;

  karma: number;
  badges: string[];

  createdAt: FirebaseFirestoreTypes.Timestamp;
  updatedAt: FirebaseFirestoreTypes.Timestamp;
}
