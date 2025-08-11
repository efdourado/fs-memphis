import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

const staticPath = path.join(__dirname, '../../frontend/dist');

router.use(express.static(staticPath));

router.get('*', (req, res) => {
  res.sendFile(path.join(staticPath, 'index.html'));
});

export default router;