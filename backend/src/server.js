import app from './app.js';
import { connectToDatabase } from './config/db.js';

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await connectToDatabase();
    
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
} };

startServer();