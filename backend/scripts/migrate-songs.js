// ARQUIVO: backend/scripts/migrate-songs.js

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Song from '../src/persistence/models/songModel.js'; // Importe seu modelo ATUALIZADO
import { connectToDatabase } from '../src/config/db.js'; // Reutilize sua função de conexão

dotenv.config({ path: './backend/.env' }); // Garanta que as variáveis de ambiente sejam carregadas

const migrateSongs = async () => {
  console.log('Iniciando migração de músicas...');

  try {
    // 1. Renomear 'duration' para 'durationMs'
    // Apenas em documentos que têm 'duration' mas não 'durationMs'
    const renameResult = await Song.updateMany(
      { duration: { $exists: true }, durationMs: { $exists: false } },
      { $rename: { 'duration': 'durationMs' } }
    );
    console.log(`- Renomeado 'duration' para 'durationMs' em ${renameResult.modifiedCount} documentos.`);

    // 2. Mover campos como 'bpm' e 'key' para dentro do objeto 'analysis'
    const analysisResult = await Song.updateMany(
      { $or: [{ bpm: { $exists: true } }, { key: { $exists: true } }] }, // Encontra documentos com os campos antigos
      [ // Usa um pipeline de agregação para mover os valores dinamicamente
        {
          $set: {
            'analysis.bpm': '$bpm',
            'analysis.key': '$key',
          }
        },
        {
          $unset: ['bpm', 'key'] // Remove os campos antigos do nível raiz
        }
      ]
    );
    console.log(`- Movidos campos para o objeto 'analysis' em ${analysisResult.modifiedCount} documentos.`);
    
    // 3. Mover 'creativeProcess' para 'editorial.story'
    const editorialResult = await Song.updateMany(
        { creativeProcess: { $exists: true } },
        [
            {
                $set: {
                    'editorial.story': '$creativeProcess'
                }
            },
            {
                $unset: 'creativeProcess'
            }
        ]
    );
    console.log(`- Movido 'creativeProcess' para 'editorial.story' em ${editorialResult.modifiedCount} documentos.`);


    // 4. Inicializar novos campos (arrays) para evitar que sejam 'undefined'
    const initArraysResult = await Song.updateMany(
      { emotions: { $exists: false } }, // Checa por um dos novos campos
      {
        $set: {
          emotions: [],
          instruments: [],
          tags: [],
          genres: [],
          structure: [],
        }
      }
    );
    console.log(`- Inicializados novos arrays em ${initArraysResult.modifiedCount} documentos.`);

    console.log('Migração concluída com sucesso!');
  } catch (error) {
    console.error('Ocorreu um erro durante a migração:', error);
  }
};

const runMigration = async () => {
  await connectToDatabase();
  await migrateSongs();
  await mongoose.connection.close();
  process.exit(0);
};

runMigration();