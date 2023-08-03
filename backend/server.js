const express = require('express');
const multer = require('multer');
const { BlobServiceClient } = require('@azure/storage-blob');
const inMemoryStorage = multer.memoryStorage();
const uploadStrategy = multer({ storage: inMemoryStorage }).array('photos');
const { BlobServiceClient } = require("@azure/storage-blob");
const { DefaultAzureCredential } = require("@azure/identity");

// Set up the connection to Azure Blob Storage
const blobServiceClient = new BlobServiceClient(
  `https://photosand.blob.core.windows.net/`,
  new DefaultAzureCredential()
);

const containerClient = blobServiceClient.getContainerClient(photosand);

const app = express();
app.use(express.json());

const azureStorageConnectionString = '<Your Azure Storage Connection String>';
const containerName = '<Your Azure Blob Storage Container Name>';

const blobServiceClient = BlobServiceClient.fromConnectionString(azureStorageConnectionString);
const containerClient = blobServiceClient.getContainerClient(containerName);

app.post('/upload', uploadStrategy, async (req, res) => {
  if (!req.files) {
    res.status(400).send('No file uploaded.');
    return;
  }

  try {
    const promises = req.files.map(async (file) => {
      const blobName = Date.now() + '-' + file.originalname; // Add a timestamp to ensure unique blob names
      const blockBlobClient = containerClient.getBlockBlobClient(blobName);
      await blockBlobClient.uploadData(file.buffer);
    });

    // Wait for all uploads to finish
    await Promise.all(promises);
    res.status(200).send('File uploaded successfully.');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error uploading file.');
  }
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
