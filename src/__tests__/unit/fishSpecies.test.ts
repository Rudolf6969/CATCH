import { fishSpecies, searchFishSpecies } from '../../constants/fishSpecies';

describe('fishSpecies — SK/CZ species list', () => {
  describe('DIARY-07: Species list completeness', () => {
    it('should contain 100 or more species', () => {
      expect(fishSpecies.length).toBeGreaterThanOrEqual(100);
    });

    it('each species should have id, name (SK), and latinName', () => {
      fishSpecies.forEach(s => {
        expect(s.id).toBeTruthy();
        expect(s.name).toBeTruthy();
        expect(s.latinName).toBeTruthy();
      });
    });

    it('should include Kapor (common carp)', () => {
      const kapor = fishSpecies.find(s => s.name === 'Kapor obecný');
      expect(kapor).toBeDefined();
    });

    it('should include Šťuka (northern pike)', () => {
      const stuka = fishSpecies.find(s => s.name.includes('Šťuka'));
      expect(stuka).toBeDefined();
    });

    it('search filter should return matching species case-insensitively', () => {
      const results = searchFishSpecies('kapor');
      expect(results.length).toBeGreaterThan(0);
      results.forEach(r => expect(r.name.toLowerCase()).toContain('kapor'));
    });

    it('search filter with empty string should return all species', () => {
      const results = searchFishSpecies('');
      expect(results.length).toBe(fishSpecies.length);
    });
  });
});
