import Dexie from 'dexie';

const db = new Dexie('RakshakDB');

db.version(3).stores({
  camps: '++id, name, lat, lng, status, troopsCount, ammoLevel, suppliesLevel, lastUpdated',
  borders: '++id, name, type, coordinates',
  logs: '++id, timestamp, action, type, details',
  convoys: '++id, sourceCampId, targetCampId, progress, payloadType, startedAt'
});

// Seed data
export async function seedDatabase() {
  const campCount = await db.camps.count();
  if (campCount === 0) {
    await db.camps.bulkAdd([
      {
        name: 'Siachen Base Camp',
        lat: 35.4213,
        lng: 77.1350,
        status: 'normal',
        troopsCount: 850,
        ammoLevel: 72,
        suppliesLevel: 65,
        lastUpdated: new Date().toISOString()
      },
      {
        name: 'Kargil Forward Post',
        lat: 34.5539,
        lng: 76.1320,
        status: 'alert',
        troopsCount: 1200,
        ammoLevel: 55,
        suppliesLevel: 40,
        lastUpdated: new Date().toISOString()
      },
      {
        name: 'Tawang Garrison',
        lat: 27.5742,
        lng: 91.8650,
        status: 'normal',
        troopsCount: 600,
        ammoLevel: 88,
        suppliesLevel: 90,
        lastUpdated: new Date().toISOString()
      },
      {
        name: 'Nathu La Outpost',
        lat: 27.3875,
        lng: 88.8311,
        status: 'critical',
        troopsCount: 350,
        ammoLevel: 15,
        suppliesLevel: 12,
        lastUpdated: new Date().toISOString()
      },
      {
        name: 'Jaisalmer Desert Camp',
        lat: 26.9157,
        lng: 70.9083,
        status: 'normal',
        troopsCount: 950,
        ammoLevel: 80,
        suppliesLevel: 75,
        lastUpdated: new Date().toISOString()
      }
    ]);
  }

  const borderCount = await db.borders.count();
  if (borderCount === 0) {
    await db.borders.bulkAdd([
      {
        name: 'Line of Control (LoC)',
        type: 'LoC',
        coordinates: [
          [34.8, 74.0],
          [34.5, 74.3],
          [34.2, 74.5],
          [33.8, 74.2],
          [33.5, 74.0],
          [33.2, 73.8],
          [33.0, 73.6],
          [32.8, 73.5]
        ]
      },
      {
        name: 'Line of Actual Control (LAC)',
        type: 'LAC',
        coordinates: [
          [35.5, 78.0],
          [34.0, 79.5],
          [33.0, 80.0],
          [32.0, 79.5],
          [31.0, 80.5],
          [30.0, 81.0],
          [29.0, 82.0],
          [28.5, 84.0],
          [28.0, 86.0],
          [27.5, 88.5],
          [28.0, 92.0],
          [28.5, 96.0],
          [29.0, 97.5]
        ]
      }
    ]);
  }
}

export default db;