import app from './app.js';
import { connectToDatabase } from './config/db.js';
import container from './container.js';
import { syncCatalog } from './services/catalogService.js';
import * as catalog from './data/catalog.js';

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await connectToDatabase();

    // The curated collection lives in the repository; keep the database in step with it.
    const synced = await syncCatalog(container.catalogModels, catalog);
    console.log(`Catalog synced: ${synced.works} songs, ${synced.people} people, ${synced.updates} updates`);

    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
} };

startServer();
