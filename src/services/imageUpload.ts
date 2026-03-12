import * as ImageManipulator from 'expo-image-manipulator';
import { Image } from 'expo-image';
import storage from '@react-native-firebase/storage';

export const SELECTION_LIMIT = 5;

export async function compressImage(uri: string): Promise<ImageManipulator.ImageResult> {
  return ImageManipulator.manipulateAsync(
    uri,
    [{ resize: { width: 1200 } }],
    { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
  );
}

export async function uploadCatchPhoto(
  uri: string,
  userId: string,
  catchId: string,
  filename: string,
  onProgress?: (pct: number) => void
): Promise<{ downloadURL: string; blurhash: string }> {
  // 1. Kompressia — resize na max 1200px, JPEG 0.8
  const compressed = await compressImage(uri);

  // 2. Generovanie blurhash z LOCAL uri PRED uploadom
  // DÔLEŽITÉ: nikdy nepoužívaj downloadURL pre blurhash — extra network request
  const blurhash = await Image.generateBlurhashAsync(compressed.uri, [4, 3]);

  // 3. Firebase Storage upload s progress trackingom
  const storagePath = `catches/${userId}/${catchId}/${filename}.jpg`;
  const ref = storage().ref(storagePath);
  const task = ref.putFile(compressed.uri);

  if (onProgress) {
    task.on('state_changed', (snap) => {
      onProgress(snap.bytesTransferred / snap.totalBytes);
    });
  }

  await task;
  const downloadURL = await ref.getDownloadURL();

  return { downloadURL, blurhash };
}
