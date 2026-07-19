import * as SQLite from 'expo-sqlite';

let db = null;

export const getDb = async () => {
  if (!db) {
    db = await SQLite.openDatabaseAsync('surveyApp.db');
    await initDb();
  }
  return db;
};

const initDb = async () => {
  if (!db) return;
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS surveys (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      description TEXT,
      latitude REAL,
      longitude REAL,
      contactId INTEGER,
      photoUri TEXT,
      timestamp TEXT,
      synced INTEGER DEFAULT 0
    );
    
    CREATE TABLE IF NOT EXISTS contacts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      phone TEXT,
      synced INTEGER DEFAULT 0
    );
  `);
};

export const saveSurvey = async (survey) => {
  const database = await getDb();
  const { title, description, latitude, longitude, contactId, photoUri, timestamp } = survey;
  
  const result = await database.runAsync(
    'INSERT INTO surveys (title, description, latitude, longitude, contactId, photoUri, timestamp) VALUES (?, ?, ?, ?, ?, ?, ?)',
    title || '', description || '', latitude || null, longitude || null, contactId || null, photoUri || null, timestamp || new Date().toISOString()
  );
  return result.lastInsertRowId;
};

export const getSurveys = async () => {
  const database = await getDb();
  return await database.getAllAsync('SELECT * FROM surveys ORDER BY id DESC');
};

export const saveContact = async (contact) => {
  const database = await getDb();
  const { name, phone } = contact;
  const result = await database.runAsync(
    'INSERT INTO contacts (name, phone) VALUES (?, ?)',
    name, phone
  );
  return result.lastInsertRowId;
};

export const getContacts = async () => {
  const database = await getDb();
  return await database.getAllAsync('SELECT * FROM contacts ORDER BY id DESC');
};

export const deleteContact = async (id) => {
  const database = await getDb();
  await database.runAsync('DELETE FROM contacts WHERE id = ?', id);
};

export const deleteSurvey = async (id) => {
  const database = await getDb();
  await database.runAsync('DELETE FROM surveys WHERE id = ?', id);
};

export const resetDatabase = async () => {
  const database = await getDb();
  await database.execAsync('DELETE FROM surveys; DELETE FROM contacts;');
};
