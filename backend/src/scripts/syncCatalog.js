import mongoose from 'mongoose';

import { connectToDatabase } from '../config/db.js';
import container from '../container.js';
import { syncCatalog } from '../services/catalogService.js';
import * as catalog from '../data/catalog.js';

await connectToDatabase();
const synced = await syncCatalog(container.catalogModels, catalog);
console.log(`Catalog synced: ${synced.works} songs, ${synced.people} people, ${synced.updates} updates`);
await mongoose.disconnect();
