// Mockuj expo-image a expo-image-manipulator
jest.mock('expo-image', () => ({
  Image: {
    generateBlurhashAsync: jest.fn().mockResolvedValue('L6PZfSi_.AyE_3t7t7R**0o#DgR4'),
  },
}));

jest.mock('expo-image-manipulator', () => ({
  manipulateAsync: jest.fn().mockResolvedValue({
    uri: 'file:///tmp/compressed.jpg',
    width: 1200,
    height: 800,
  }),
  SaveFormat: { JPEG: 'jpeg' },
}));

jest.mock('@react-native-firebase/storage', () => {
  const mockTask = {
    on: jest.fn((event, callback) => {
      if (event === 'state_changed') {
        callback({ bytesTransferred: 500, totalBytes: 1000 });
      }
    }),
    then: jest.fn((cb) => Promise.resolve(cb())),
  };
  const mockRef = {
    putFile: jest.fn().mockReturnValue(mockTask),
    getDownloadURL: jest.fn().mockResolvedValue('https://firebasestorage.example.com/photo.jpg'),
  };
  return () => ({ ref: jest.fn().mockReturnValue(mockRef) });
});

import { compressImage, uploadCatchPhoto } from '../../services/imageUpload';
import * as ImageManipulator from 'expo-image-manipulator';
import { Image } from 'expo-image';

describe('imageUpload — photo pipeline', () => {
  describe('PHOTO-01: ImagePicker multi-select', () => {
    it('should return max 5 assets from launchImageLibraryAsync', () => {
      const { SELECTION_LIMIT } = require('../../services/imageUpload');
      expect(SELECTION_LIMIT).toBe(5);
    });
    it('should not return more than 5 assets when selectionLimit=5', () => {
      const { SELECTION_LIMIT } = require('../../services/imageUpload');
      expect(SELECTION_LIMIT).toBeLessThanOrEqual(5);
    });
  });

  describe('PHOTO-02: Compression', () => {
    it('compressed image should use JPEG format with quality 0.8', async () => {
      await compressImage('file:///tmp/original.jpg');
      expect(ImageManipulator.manipulateAsync).toHaveBeenCalledWith(
        'file:///tmp/original.jpg',
        [{ resize: { width: 1200 } }],
        { compress: 0.8, format: 'jpeg' }
      );
    });
    it('should return compressed uri', async () => {
      const result = await compressImage('file:///tmp/original.jpg');
      expect(result.uri).toBe('file:///tmp/compressed.jpg');
    });
  });

  describe('PHOTO-03: Upload progress callback', () => {
    it('onProgress callback should be called during upload', async () => {
      const onProgress = jest.fn();
      await uploadCatchPhoto('file:///tmp/photo.jpg', 'user1', 'catch1', 'photo1', onProgress);
      expect(onProgress).toHaveBeenCalled();
    });
    it('onProgress value should be between 0 and 1', async () => {
      const progressValues: number[] = [];
      await uploadCatchPhoto('file:///tmp/photo.jpg', 'user1', 'catch1', 'photo1', (p) => progressValues.push(p));
      progressValues.forEach(v => {
        expect(v).toBeGreaterThanOrEqual(0);
        expect(v).toBeLessThanOrEqual(1);
      });
    });
  });

  describe('PHOTO-04: Blurhash generation', () => {
    it('generateBlurhashAsync should return a non-empty string', async () => {
      const result = await uploadCatchPhoto('file:///tmp/photo.jpg', 'user1', 'catch1', 'photo1');
      expect(result.blurhash).toBeTruthy();
      expect(typeof result.blurhash).toBe('string');
    });
    it('blurhash should be generated from local URI before upload', async () => {
      await uploadCatchPhoto('file:///tmp/photo.jpg', 'user1', 'catch1', 'photo1');
      expect(Image.generateBlurhashAsync).toHaveBeenCalledWith(
        'file:///tmp/compressed.jpg',
        [4, 3]
      );
    });
  });
});
