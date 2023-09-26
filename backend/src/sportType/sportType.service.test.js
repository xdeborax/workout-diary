import { sportTypeService } from './sportType.service';
import { SportTypeModel } from './sportType.model';

const sportTypes = [
  {
    _id: '642d8b3a16e798e148aaa9a0',
    type: 'Futás',
    hasPropDistance: true,
    hasPropExercises: false,
    __v: 0,
  },
  {
    _id: '642d8bca16e798e148aaa9a3',
    type: 'Crossfit',
    hasPropDistance: false,
    hasPropExercises: true,
    __v: 0,
  },
];

const sportTypesResult = [
  {
    id: '642d8b3a16e798e148aaa9a0',
    type: 'Futás',
    hasPropDistance: true,
    hasPropExercises: false,
  },
  {
    id: '642d8bca16e798e148aaa9a3',
    type: 'Crossfit',
    hasPropDistance: false,
    hasPropExercises: true,
  },
];

describe('sportTypeService', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('getSportTypes', () => {
    jest.spyOn(SportTypeModel, 'find').mockReturnValue({
      sort: jest.fn().mockReturnValue(sportTypes),
    });

    test('Should return all the sport types found in the database', async () => {
      const result = await sportTypeService.getSportTypes();
      expect(result).toEqual(sportTypesResult);
    });
  });

  describe('addSportType', () => {
    const type = 'futás';
    const hasPropDistance = true;
    const hasPropExercises = true;

    test('Should return an error if the type, hasPropDistance, hasPropExercises are not provided', async () => {
      await expect(
        sportTypeService.addSportType({ type: '', hasPropDistance: '', hasPropExercises: '' }),
      ).rejects.toThrow();
    });

    test('Should return an error if the type is not provided', async () => {
      await expect(
        sportTypeService.addSportType({ type: '', hasPropDistance, hasPropExercises }),
      ).rejects.toThrow();
    });

    test('Should return an error if the type contains more than 30 characters', async () => {
      await expect(
        sportTypeService.addSportType({ type: '1234567891234567891234567891234', hasPropDistance, hasPropExercises }),
      ).rejects.toThrow();
    });

    test('Should return an error if the hasPropDistance parameter is not provided', async () => {
      await expect(
        sportTypeService.addSportType({ type, hasPropDistance: '', hasPropExercises }),
      ).rejects.toThrow();
    });

    test('Should return an error if the hasExercises parameter is not provided', async () => {
      await expect(
        sportTypeService.addSportType({ type, hasPropDistance, hasPropExercises: '' }),
      ).rejects.toThrow();
    });

    test('Should return an error is the sport type name is already taken', async () => {
      jest.spyOn(SportTypeModel, 'findOne').mockReturnValue(
        {
          _id: '642d8b3a16e798e148aaa9a0',
          type: 'Futás',
          hasPropDistance: true,
          hasPropExercises: false,
          __v: 0,
        },
      );
      await expect(
        sportTypeService.addSportType({ type: 'Futás', hasPropDistance, hasPropExercises }),
      ).rejects.toThrow();
    });

    test('Should return the new sport type if parameters are valid and user is admin', async () => {
      await jest.spyOn(SportTypeModel, 'findOne').mockReturnValue({});
      await jest.spyOn(SportTypeModel, 'create').mockReturnValue(
        {
          _id: '642d8b3a16e798e148aaa9a0',
          type: 'Futás',
          hasPropDistance: true,
          hasPropExercises: false,
          __v: 0,
        },
      );
      const newSportType = await sportTypeService.addSportType(
        { type, hasPropDistance, hasPropExercises },
      );
      await expect(newSportType.type).toBe('Futás');
      await expect(newSportType.hasPropDistance).toBe(true);
      await expect(newSportType.hasPropExercises).toBe(false);
      await expect(newSportType.id).toBeTruthy();
    });
  });

  describe('deleteSportType', () => {
    test('Should return an error if the sport type ID is not provided', async () => {
      await expect(
        sportTypeService.deleteSportType({ sportTypeId: '' }),
      ).rejects.toThrow();
    });

    test('Should return an error if the sport type ID is not valid', async () => {
      await expect(
        sportTypeService.deleteSportType({ sportTypeId: '123456789' }),
      ).rejects.toThrow();
    });

    test('Should return an error if the sport type doesn\'t exist', async () => {
      await jest.spyOn(SportTypeModel, 'findOne').mockReturnValue(null);

      await expect(
        sportTypeService.deleteSportType({ sportTypeId: '642d8b3a16e798e148aaa9a1' }),
      ).rejects.toThrow();
    });

    test('Should return nothing if the sport type is deleted successfully', async () => {
      const sportTypeId = '642d8b3a16e798e148aaa9a0';
      await jest.spyOn(SportTypeModel, 'findOne').mockReturnValue(
        {
          _id: '642d8b3a16e798e148aaa9a0',
          type: 'Futás',
          hasPropDistance: true,
          hasPropExercises: false,
          __v: 0,
        },
      );
      await jest.spyOn(SportTypeModel, 'deleteOne').mockReturnValue({ acknowledged: true, deletedCount: 1 });

      const deleteResult = await sportTypeService.deleteSportType(
        { sportTypeId },
      );
      expect(deleteResult).toBeUndefined();
    });
  });
});
