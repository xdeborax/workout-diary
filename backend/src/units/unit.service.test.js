import { UnitModel } from './unit.model';
import { unitService } from './unit.service';

const units = [
  {
    __v: 0,
    _id: '63ea43d5125ae266b2bf6c97',
    unitName: 'időtartam',
    unitValue: ['perc', 'óra'],
  },
  {
    __v: 0,
    _id: '63ea5bad5789737601e9ae47',
    unitName: 'távolság',
    unitValue: ['m', 'km'],
  },
];

const unitsResult = [
  {
    id: '63ea43d5125ae266b2bf6c97',
    unitName: 'időtartam',
    unitValue: ['perc', 'óra'],
  },
  {
    id: '63ea5bad5789737601e9ae47',
    unitName: 'távolság',
    unitValue: ['m', 'km'],
  },
];

describe('unitService', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('getUnits', () => {
    jest.spyOn(UnitModel, 'find').mockReturnValue(units);

    test('Should return all units found in the database', async () => {
      const result = await unitService.getUnits();
      expect(result).toEqual(unitsResult);
    });
  });
});
