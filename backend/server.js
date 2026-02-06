require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

const app = express();
const PORT = process.env.BACKEND_PORT || process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// PostgreSQL connection pool
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

// AWS S3 configuration
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY
    ? {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      }
    : undefined,
});

// Initialize database table
const initDatabase = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS text_entries (
        id SERIAL PRIMARY KEY,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Database table initialized');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// POST /api/storage - Save text to S3
app.post('/api/storage', async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || text.trim() === '') {
      return res.status(400).json({ 
        success: false, 
        message: 'Text content is required' 
      });
    }

    const timestamp = Date.now();
    const key = `text-entries/${timestamp}.txt`;

    const bucketName = process.env.S3_BUCKET_NAME;
    if (!bucketName) {
      return res.status(500).json({
        success: false,
        message: 'S3_BUCKET_NAME is not configured',
      });
    }

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: text,
      ContentType: 'text/plain',
    });

    await s3.send(command);

    res.json({ 
      success: true, 
      message: 'Text saved to S3 successfully',
      key: key
    });
  } catch (error) {
    console.error('Error saving to S3:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to save text to S3',
      error: error.message
    });
  }
});

// POST /api/database - Save text to PostgreSQL
app.post('/api/database', async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || text.trim() === '') {
      return res.status(400).json({ 
        success: false, 
        message: 'Text content is required' 
      });
    }

    const result = await pool.query(
      'INSERT INTO text_entries (content) VALUES ($1) RETURNING id, created_at',
      [text]
    );

    res.json({ 
      success: true, 
      message: 'Text saved to database successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error saving to database:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to save text to database',
      error: error.message
    });
  }
});

// Start server
const startServer = async () => {
  await initDatabase();
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

startServer();
