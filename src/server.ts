import express from 'express';
import app from './app';
import dotenv from 'dotenv';
import path from 'path';


dotenv.config();

const PORT = process.env.PORT || 3000;



app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
