import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { faker } from '@faker-js/faker/locale/hu';
import config from './config';
import logger from './logger';
import { UserModel } from './user/user.model';
import { ArticleModel } from './articles/article.model';
import { WorkoutDiaryModel } from './workoutDiary/workoutDiary.model';
import { UnitModel } from './units/unit.model';
import { SportTypeModel } from './sportType/sportType.model';

const DB_URI = config.db.uri || 'mongodb://127.0.0.1:27017/';

mongoose.set('strictQuery', true);

try {
  mongoose.connect(DB_URI);
} catch (err) {
  if (err) logger.error(err.message);
}
logger.info('Successfully connected to MongoDB');

(async () => {
  const password = '12345678';
  const hashedPassword = await bcrypt.hash(password, 10);

  const users = [
    {
      name: 'Admin',
      email: 'admin@test.com',
      password: hashedPassword,
      isAdmin: true,
    },
    {
      name: 'Normal',
      email: 'normal@test.com',
      password: hashedPassword,
      isAdmin: false,
    },
  ];

  const articles = [
    {
      category: 'Egészséges étkezés',
      description: 'Az egészséges táplálkozás és a sikeres fogyás ott kezdődik, hogy több friss gyümölcsöt és zöldséget, valamint halat és szárnyast eszel, és a szénhidrátbevitel csökkentése mellett megpróbálod visszaszorítani a sok cukrot, sót és állati zsírt tartalmazó élelmiszereket.',
      title: 'Bevezetés az egészséges táplálkozásba',
      content: faker.lorem.paragraphs(6),
      publish_date: '2023.02.20',
    },
    {
      category: 'Sport',
      description: 'A rendszeres futás nem csak erősít és javítja az állóképességet, de rengeteg rövid- és hosszú távú egészségügyi haszna van. Hat ok, amiért nem fogjuk megbánni, ha ezt a sportot választjuk.',
      title: 'Miért ideális sport a futás?',
      content: faker.lorem.paragraphs(7),
      publish_date: '2023.01.28',
    },
    {
      category: 'Egészséges életmód',
      description: 'Az egészségmegőrzés során sok múlik a biológiai alapismereteken és a testtudatosságon is.',
      title: '8 kérdés, amit tudni kell az egészség érdekében',
      content: faker.lorem.paragraphs(8),
      publish_date: '2022.10.09.',
    },
    {
      category: 'Sport',
      description: 'A sportnak és szabadidős tevékenységeknek rendkívüli fontossága van a fizikai állapotunkra nézve az életünk folyamán, és a SpA menedzselésében is. Ha sokat mozgunk és edzettek vagyunk, az csökkenti a fájdalmat, javítja a mozgásunk kötöttségét, merevségét. Növeli a kitartásunkat és jótékony hatással van a vérkeringésünkre. Akik aktívan élik az életüket, bizonyítottan kisebb hangsúlyt fektetnek a fájdalomra és/vagy mozgásszervi fogyatékosságaikra.',
      title: 'Mozgás és megújulás',
      content: faker.lorem.paragraphs(7),
      publish_date: '2022.08.28',
    },
    {
      category: 'Edzés kihívás',
      description: '500 km bringán májusban. Egy a szerencse, hogy nem egyben kell letekerned a nagy melegben. Gyűjtsd hát a kilométereket májusban is a bringádon és élvezd a dicsőséget a hónap végén.',
      title: 'Tekerj egy 500-ast májusban',
      content: faker.lorem.paragraphs(9),
      publish_date: '2022.05.20',
    },
    {
      category: 'Sport',
      description: 'Új helyzetek, új kihívások napról napra. Ez az, ami most jellemzi az életünket. Csakhogy mindezt leginkább a négy fal között, erős összezártságban vagy magányban kell(ene) ép ésszel végigcsinálni. Lévén, senki nem tudja, meddig tart ez a helyzet, mi jön még, nagyon fontos a mentális és fizikai jóllétünket stabilizálni, amennyire ez lehetséges.',
      title: 'Ingyenes sportolási lehetőségek a négy fal között',
      content: faker.lorem.paragraphs(6),
      publish_date: '2022.03.10',
    },
    {
      category: 'Egészséges étkezés',
      description: 'Az egészséges táplálkozás témájában is nagyon sok - akár egymással ellentétes - tanácsot, szabályt találhatunk. Ezért segítségképpen egy tíz pontos listát állítottunk össze.',
      title: 'Az egészséges táplálkozás 10 pontja',
      content: faker.lorem.paragraphs(7),
      publish_date: '2022.01.28',
    },
  ];

  const workouts = [
    {
      sportType: 'Futás',
      workoutName: 'futógépes futás',
      duration: 1,
      distance: 6,
      date: new Date('2023-03-20'),
      note: 'javulás a sebességben',
      durationUnit: 'óra',
      distanceUnit: 'km',
      isDone: true,
    },
    {
      sportType: 'Futás',
      workoutName: 'futás a szabadban',
      duration: 30,
      distance: 3,
      date: new Date('2023-02-10'),
      durationUnit: 'perc',
      distanceUnit: 'km',
      isDone: true,
    },
    {
      sportType: 'Erősítő edzés',
      workoutName: 'has edzés',
      duration: 15,
      date: new Date('2023-02-10'),
      durationUnit: 'perc',
      exercises: [
        {
          exerciseName: 'felülés', sets: 5, reps: 20,
        },
        {
          exerciseName: 'hasprés', sets: 5, reps: 20,
        },
        {
          exerciseName: 'plank', sets: 3,
        },
        {
          exerciseName: 'lábemelés', sets: 5, reps: 30,
        },
      ],
      isDone: true,
    },
    {
      sportType: 'Túra',
      workoutName: 'túra a családdal',
      duration: 3,
      date: new Date('2023-06-10'),
      durationUnit: 'óra',
      isDone: false,
    },
    {
      sportType: 'Erősítő edzés',
      workoutName: 'teljes testes',
      duration: 45,
      date: new Date('2023-03-21'),
      durationUnit: 'perc',
      isDone: true,
      exercises: [
        {
          exerciseName: 'guggolás', weight: 30, sets: 4, reps: 12,
        },
        {
          exerciseName: 'fekvőtámasz', sets: 3, reps: 20,
        },
        {
          exerciseName: 'kar', weight: 4, sets: 2, reps: 12,
        },
        {
          exerciseName: 'hátizom erősítés', sets: 4, reps: 12,
        },
      ],
    },
    {
      sportType: 'Futás',
      workoutName: 'futás a szabadban',
      duration: 1,
      distance: 7,
      date: new Date('2023-03-23'),
      note: 'gyorsabb tempó',
      durationUnit: 'óra',
      distanceUnit: 'km',
      isDone: true,
    },
    {
      sportType: 'Biciklizés',
      duration: 1,
      distance: 20,
      date: new Date('2023-03-26'),
      durationUnit: 'óra',
      distanceUnit: 'km',
      isDone: true,
    },
    {
      sportType: 'Úszás',
      workoutName: 'gyors tempójú',
      duration: 1,
      date: new Date('2023-04-03'),
      durationUnit: 'óra',
      isDone: true,
      exercises: [
        {
          exerciseName: 'hátúszás',
        },
        {
          exerciseName: 'gyorsúszás',
        },
        {
          exerciseName: 'mellúszás',
        },
        {
          exerciseName: 'pillangó',
        },
      ],
    },
    {
      sportType: 'Úszás',
      workoutName: 'gyors tempójú',
      duration: 50,
      date: new Date('2023-04-10'),
      durationUnit: 'perc',
      isDone: true,
      exercises: [
        {
          exerciseName: 'hátúszás',
        },
        {
          exerciseName: 'gyorsúszás',
        },
        {
          exerciseName: 'mellúszás',
        },
        {
          exerciseName: 'pillangó',
        },
      ],
    },
    {
      sportType: 'Erősítő edzés',
      workoutName: 'teljes testes',
      duration: 45,
      date: new Date('2023-04-04'),
      durationUnit: 'perc',
      isDone: true,
      exercises: [
        {
          exerciseName: 'guggolás', weight: 30, sets: 4, reps: 12,
        },
        {
          exerciseName: 'fekvőtámasz', sets: 3, reps: 20,
        },
        {
          exerciseName: 'kar', weight: 4, sets: 2, reps: 12,
        },
        {
          exerciseName: 'hátizom erősítés', sets: 4, reps: 12,
        },
      ],
    },
    {
      sportType: 'Futás',
      workoutName: 'futás a szabadban',
      duration: 1,
      distance: 7,
      date: new Date('2023-04-06'),
      durationUnit: 'óra',
      distanceUnit: 'km',
      isDone: true,
    },
    {
      sportType: 'Futás',
      duration: 1,
      distance: 8,
      date: new Date('2023-04-13'),
      durationUnit: 'óra',
      distanceUnit: 'km',
      isDone: true,
    },
  ];

  const units = [
    { unitName: 'időtartam', unitValue: ['perc', 'óra'] },
    { unitName: 'távolság', unitValue: ['m', 'km'] },
  ];

  const sportTypes = [
    {
      type: 'Futás',
      hasPropDistance: true,
      hasPropExercises: false,
    },
    {
      type: 'Futógépes futás',
      hasPropDistance: true,
      hasPropExercises: false,
    },
    {
      type: 'Tempó futás',
      hasPropDistance: true,
      hasPropExercises: false,
    },
    {
      type: 'Terepfutás',
      hasPropDistance: true,
      hasPropExercises: false,
    },
    {
      type: 'Úszás',
      hasPropDistance: true,
      hasPropExercises: true,
    },
    {
      type: 'Biciklizés',
      hasPropDistance: true,
      hasPropExercises: false,
    },
    {
      type: 'Spinning',
      hasPropDistance: true,
      hasPropExercises: false,
    },
    {
      type: 'Túra',
      hasPropDistance: true,
      hasPropExercises: false,
    },
    {
      type: 'Hegyi túra',
      hasPropDistance: true,
      hasPropExercises: false,
    },
    {
      type: 'Sík túra',
      hasPropDistance: true,
      hasPropExercises: false,
    },
    {
      type: 'Sziklamászás',
      hasPropDistance: true,
      hasPropExercises: false,
    },
    {
      type: 'Falmászás',
      hasPropDistance: true,
      hasPropExercises: false,
    },
    {
      type: 'Séta',
      hasPropDistance: true,
      hasPropExercises: false,
    },
    {
      type: 'Görkori',
      hasPropDistance: true,
      hasPropExercises: false,
    },
    {
      type: 'Tánc',
      hasPropDistance: false,
      hasPropExercises: false,
    },
    {
      type: 'Modern tánc',
      hasPropDistance: false,
      hasPropExercises: false,
    },
    {
      type: 'Hip-hop',
      hasPropDistance: false,
      hasPropExercises: false,
    },
    {
      type: 'Rumba',
      hasPropDistance: false,
      hasPropExercises: false,
    },
    {
      type: 'Salsa',
      hasPropDistance: false,
      hasPropExercises: false,
    },
    {
      type: 'Aerobic',
      hasPropDistance: false,
      hasPropExercises: true,
    },
    {
      type: 'Vizi aerobic',
      hasPropDistance: false,
      hasPropExercises: true,
    },
    {
      type: 'Jóga',
      hasPropDistance: false,
      hasPropExercises: false,
    },
    {
      type: 'Küzdősport',
      hasPropDistance: false,
      hasPropExercises: true,
    },
    {
      type: 'Bírkózás',
      hasPropDistance: false,
      hasPropExercises: true,
    },
    {
      type: 'Cselgáncs',
      hasPropDistance: false,
      hasPropExercises: true,
    },
    {
      type: 'Karate',
      hasPropDistance: false,
      hasPropExercises: true,
    },
    {
      type: 'Kick-box',
      hasPropDistance: false,
      hasPropExercises: true,
    },
    {
      type: 'Kungfu',
      hasPropDistance: false,
      hasPropExercises: true,
    },
    {
      type: 'Box',
      hasPropDistance: false,
      hasPropExercises: true,
    },
    {
      type: 'Golf',
      hasPropDistance: false,
      hasPropExercises: false,
    },
    {
      type: 'Csapatsport',
      hasPropDistance: false,
      hasPropExercises: false,
    },
    {
      type: 'Foci',
      hasPropDistance: false,
      hasPropExercises: false,
    },
    {
      type: 'Kézilabda',
      hasPropDistance: false,
      hasPropExercises: false,
    },
    {
      type: 'Kosárlabda',
      hasPropDistance: false,
      hasPropExercises: false,
    },
    {
      type: 'Röplabda',
      hasPropDistance: false,
      hasPropExercises: false,
    },
    {
      type: 'Téli sport',
      hasPropDistance: false,
      hasPropExercises: false,
    },
    {
      type: 'Labdajáték',
      hasPropDistance: false,
      hasPropExercises: false,
    },
    {
      type: 'TRX',
      hasPropDistance: false,
      hasPropExercises: true,
    },
    {
      type: 'Crossfit',
      hasPropDistance: false,
      hasPropExercises: true,
    },
    {
      type: 'Erőemelés',
      hasPropDistance: false,
      hasPropExercises: true,
    },
    {
      type: 'Erősítő edzés',
      hasPropDistance: false,
      hasPropExercises: true,
    },
    {
      type: 'Fitness',
      hasPropDistance: false,
      hasPropExercises: true,
    },
    {
      type: 'Súlyemelés',
      hasPropDistance: false,
      hasPropExercises: true,
    },
    {
      type: 'Testépítés',
      hasPropDistance: false,
      hasPropExercises: true,
    },
    {
      type: 'Vizisport',
      hasPropDistance: true,
      hasPropExercises: false,
    },
    {
      type: 'Precíziós sport',
      hasPropDistance: false,
      hasPropExercises: false,
    },
    {
      type: 'Lovassport',
      hasPropDistance: true,
      hasPropExercises: false,
    },
    {
      type: 'Egyéb',
      hasPropDistance: true,
      hasPropExercises: true,
    },
  ];

  const seedDatabase = async () => {
    try {
      await UserModel.deleteMany({});
      await WorkoutDiaryModel.deleteMany({});
      await UnitModel.deleteMany({});
      await ArticleModel.deleteMany({});
      await SportTypeModel.deleteMany({});

      const idOfAdmin = (await UserModel.create(users[0]))._id;
      const idOfNormal = (await UserModel.create(users[1]))._id;
      await WorkoutDiaryModel.create({
        user: idOfAdmin,
        workouts: [...workouts],
      });
      await WorkoutDiaryModel.create({
        user: idOfNormal,
        workouts: [...workouts],
      });

      await UnitModel.insertMany(units);
      await SportTypeModel.insertMany(sportTypes);
      await ArticleModel.insertMany(articles);
      logger.info('Seeding successful');
    } catch (error) {
      logger.error(error);
    }
  };

  seedDatabase().then(() => {
    mongoose.connection.close();
  });
})();
