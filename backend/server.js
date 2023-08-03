const express = require('express');
const multer = require('multer');
const { BlobServiceClient } = require('@azure/storage-blob');

// The connection string for your Azure Storage account
const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;
const AZURE_STORAGE_CONTAINER_NAME = process.env.AZURE_STORAGE_CONTAINER_NAME;

// Configure multer middleware to store uploaded files in memory
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: function (req, file, cb) {
    // Accept only png, jpg, and jpeg file types
    if (file.mimetype !== 'image/png' && file.mimetype !== 'image/jpg' && file.mimetype !== 'image/jpeg') {
      return cb(new Error('Only .png, .jpg and .jpeg format allowed!'), false);
    }
    cb(null, true);
  },
  limits: {
    // Accept only files up to 7MB in size
    fileSize: 7 * 1024 * 1024
  }
});

// Create an Express.js app
const app = express();

// Initialize Azure Storage client
const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);
const containerClient = blobServiceClient.getContainerClient(AZURE_STORAGE_CONTAINER_NAME);

app.post('/upload', upload.array('photos'), async (req, res) => {
  try {
    // Loop over each uploaded file
    for (const file of req.files) {
      const blobName = file.originalname;
      const blobClient = containerClient.getBlobClient(blobName);
      const blockBlobClient = blobClient.getBlockBlobClient();

      // Upload the file to Azure Storage
      await blockBlobClient.upload(file.buffer, file.buffer.length);
    }

    res.send('Files uploaded successfully');
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.get('/files', async (req, res) => {
  try {
    const blobs = containerClient.listBlobsFlat();
    const files = [];

    // Iterate over each blob in the container and push its name to an array
    for await (const blob of blobs) {
      files.push(blob.name);
    }

    // Send the array of file names in the response
    res.send(files);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // A Multer error occurred when uploading.
    res.status(400).send(err.message);
  } else if (err) {
    // An unknown error occurred.
    res.status(500).send(err.message);
  }
});

app.listen(3000, () => console.log('Server is listening on port 3000'));
