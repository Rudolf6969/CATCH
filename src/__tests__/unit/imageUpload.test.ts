// Wave 0 scaffold — testy sa naplnia v 02-02 (image upload pipeline)
// Pokrýva: PHOTO-01, PHOTO-02, PHOTO-03, PHOTO-04

describe('imageUpload — photo pipeline', () => {
  describe('PHOTO-01: ImagePicker multi-select', () => {
    it.todo('should return max 5 assets from launchImageLibraryAsync');
    it.todo('should not return more than 5 assets when selectionLimit=5');
  });

  describe('PHOTO-02: Compression < 500KB', () => {
    it.todo('compressed image should be under 500KB');
    it.todo('should resize to max 1200px width');
  });

  describe('PHOTO-03: Upload progress callback', () => {
    it.todo('onProgress callback should be called during upload');
    it.todo('onProgress value should be between 0 and 1');
  });

  describe('PHOTO-04: Blurhash generation', () => {
    it.todo('generateBlurhashAsync should return a non-empty string');
    it.todo('blurhash should be generated from local URI before upload');
  });
});
