import { Injectable } from '@angular/core';
import { ClimatePrice } from 'app/climate-price/climate-price.utils';
import Dexie from 'dexie';

@Injectable({
  providedIn: 'root'
})
export class DexieService extends Dexie {

  dbTables = {
    multiAssetMap: 'multiAssetMap'
  }

  constructor() {
    // name your data base here
    super(ClimatePrice.dbName);
    this.version(1).stores({
      multiAssetMap: '++id, data'
    })
    this.open().then(data => { }).catch(err => console.log(err.message));
  }

  async addRecord(data) {
    // multiAssetMap is a table name inside db
    this.close()
    await this.open()
    return this.table('multiAssetMap').add(data);
  }

  bulkAdd(data) {
    // multiAssetMap is a table name inside db
    this.table('multiAssetMap').bulkAdd(data);
  }

  bulkPut(data) {
    // multiAssetMap is a table name inside db
    this.table('multiAssetMap').bulkPut(data);
  }

  getData() {
    // multiAssetMap is a table name inside db
    return this.table('multiAssetMap').toArray();
  }

  getDataById(id) {
    return this.table("multiAssetMap").get(id)
  }

  updateRecord(data) {
    // multiAssetMap is a table name inside db
    return this.table('multiAssetMap').put(data);
  }

  deleteRecord(id: number) {
    // multiAssetMap is a table name inside db
    return this.table('multiAssetMap').delete(id);
  }

  getTables() {
    return Array.from(this.tables, ({ name }) => name)
  }

  istableExist(tableName) {
    return Array.from(this.tables, ({ name }) => name).includes(tableName)
  }

  getDataBases() {
    // returns promise , use .then or await to get result while calling
    indexedDB.databases().then(r => console.log(r))
  }

  dbExists() {
    Dexie.exists(ClimatePrice.dbName)
      .then(exists => {
        if (exists) {
          // console.log(`Database "${ClimatePrice.dbName}" exists.`);
        } else {
          // console.log(`Database "${ClimatePrice.dbName}" does not exist.`);
        }
      })
  }

  deleteDataBase() {
    Dexie.delete(ClimatePrice.dbName)
      .then(() => {
        // console.log('Database deleted successfully.');
      })
      .catch((error) => {
        // console.error(`Error deleting database: ${error.stack || error}`);
      });
  }

}



