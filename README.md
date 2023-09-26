# Edzésnapló

## Projekt leírása

1. Cél

Az alkalmazás célja, hogy a felhasználó az elvégzett vagy tervben lévő edzéseit részletesen naplózni tudja, hogy egy egységes képet kaphasson fizikai aktivitásáról és fejlődését könnyebben nyomon követhesse. Az edzések naplózása megadja a teljesítés érzését, segít fenntartani a motivációt és a lelkesedést, hozzájárul a kitűzött célok eléréséhez. A korábbi és aktuális edzések eredményeinek összehasonlítása segíthet meghatározni az edzésmódszer hatékonyságát. Az edzések rendszeres, részletes feljegyzése jó rá látást biztosít majd a fejlődésre.

2. Alkalmazás működése

A látogatónak az alkalmazás felületén lehetősége adódik a cikkek olvasására, a regisztrálásra, már meglévő regisztráció esetén pedig a bejelentkezésre.

A bejelentkezett felhasználó egy űrlapon keresztül felviheti az edzése adatait. Az űrlap alap mezői a 'Sport típusa', 'Edzés elnevezése', a 'Dátum', az 'Időtartam (perc/óra)', a 'Megjegyzés' és a 'Megcsináltam' mező, melyeken kívül a kiválasztott sport típustól függően nyílik lehetőség a 'Távolság (m/km)', valamint a 'Gyakorlatok' megadására is.

Az edzések csoportosítására és megjelenítésére az 'Edzésnapló' menüponton belül többféle lehetőség van. A 'Mai edzés' és az 'E heti edzések' fül alatt a megfelelő edzések listázva jelennek meg, míg az 'Összes edzés' fül alatt a naptári és a lista nézet között lehet választani. A listázott megjelenítés során az edzések dátum alapján vannak csoportosítva és az adott naphoz tartozó edzések jellemzői a lista elemre történő kattintás következtében lenyíló tartalomban kerülnek részletezésre. Az összes edzések listája továbbá szűrhető adott hónapra és/vagy edzés típusra. Hónapra történő szűrés esetén amennyiben több naphoz is van edzés hozzáadva egy kördiagram is megjelenik a sport típusok arányával. Naptár nézet esetén alapértelmezetten az aktuális hónap jelenik meg, melynél az adott napokon a hozzá tartozó edzéseknek a típusa kerül megjelenítésre, majd azok részletei az adott napra történő kattintáskor lesznek láthatóak. A megjelenített hónap az Előző/Következő gombbal változtatható.

A listában/naptárban adott napra kattintva nem csak az aznapi edzések részleteinek megtekintésére van lehetőség, hanem az edzések törlésére/módosítására is. Módosítás esetén a fentebb részletezett űrlap jelenik meg az edzés adataival előre kitöltve. A kívánt mezők módosítása (a sport típust leszámítva) a mentés gombbal véglegesíthető.

Admin felhasználóként a sport típusok kezelése lehetséges, melyek közül a felhasználók az edzés hozzáadása során választanak a legördülő listából. Az admin hozzáadhat vagy törölhet sport típust, hozzáadás során kiválasztható, hogy távolság és/vagy gyakorlatok hozzáadására ad majd lehetőséget a felhasználónak vagy egyikre sem.

3. Felhasználók:

- Nem regisztrált felhasználó:
  - olvashatja a cikkeket

- Regisztrált felhasználó:
  - olvashatja a cikkeket
  - egyéni edzéseket adhat hozzá
  - edzésnaplóban megtekintheti edzéseit, azokat törölheti/módosíthatja

- Admin:
  - a fentieken felül sport típusokat adhat hozzá/törölhet

4. Tevékenységek összefoglalása:

- Regisztráció: felhasználónév, email cím és jelszó megadásával
- Bejelentkezés: email cím és jelszó megadásával
- Cikkek olvasása
- Profil módosítása
- Edzés hozzáadása: sport típus, edzés elnevezése, dátum, időtartam, megjegyzés, megcsináltam mező és - a kiválasztott sport típustól függően - távolság és/vagy gyakorlatok mező megadásával
- Edzések szűrése/megjelenítése: mai napra, aktuális hétre, adott hónapra, adott évre, adott sport típusra, összes edzésre - naptári/listázott nézetben 
- Adminként sport típusok törlése/hozzáadása

## Technikai követelmények:

 - Node.js
 - MongoDB
 - Docker

## Konfigurálás, alkalmazás indítása, tesztek futtatása:

1. Alkalmazás indítása:
    -  Frontend: `.env.local` létrehozása a `.env.example` alapján
    -  Backend: `.env` létrehozása a `.env.example` alapján
- Dockerrel történő indítás:
    - Alkalmazás gyökérkönyvtárában: 
      - `docker compose build` parancs futtatása
      - `docker compose up` parancs futtatása az alkalmazás elindítására (adatbázis, backend, frontend indítása)
    - Open API dokumentáció elérhető: http://localhost:8081/api-docs/
  
- Másik lehetőség az indításra:
    -  Frontend:
       - `yarn` parancs futtatása a csomagok telepítésére
       - `yarn start` parancs futtatása az indításra

    -  Backend: 
       - `yarn` parancs futtatása a csomagok telepítésére
       - `yarn seeder` parancs futtatása az adatbázis feltöltésére a következő adatokkal: admin és normál felhasználó, cikkek, idő és távolság mértékegységek, sport típusok, hozzáadott edzések az admin és normál felhasználókhoz
       - `yarn start` parancs futtatása az indításra

- Indítás után bejelentkezés lehetséges:
  - Admin felhasználóként:
    - email: admin@test.com
    - jelszó: 12345678
  - Normál felhasználóként: 
    - email: normal@test.com
    - jelszó: 12345678

2. Tesztek futtatása
-  Frontend: 
     -  Feltétel: előző pontban említett `.env.locale` fájl megléte
     -  `yarn` parancs futtatása a csomagok telepítésére
     -  `yarn test` parancs futtatása a tesztek elindítására
-  Backend: 
     - Feltétel: előző pontban említett `.env` fájl megléte
     - `yarn` parancs futtatása a csomagok telepítésére
     - `yarn test` parancs futtatása a tesztek elindítására
