import React, { useState } from "react";
import ImagePreview from './ImagePreview.js';
import axios from "axios";
// Import Google Fonts
import { GoogleFont } from 'react-typography';
import Typography from 'typography';
import fairyGateTheme from 'typography-theme-fairy-gates';
import { useNavigate } from "react-router-dom"; // Import useHistory from react-router-dom
const typography = new Typography(fairyGateTheme);
const MAX_IMAGE_SIZE_MB = 7;
const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024;
const MIN_IMAGE_WIDTH = 200;

const styles = {
  uploadContainer: {
    maxWidth: "600px",
    margin: "50px auto",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: "10px",
    padding: "20px",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
  },
  h1: {
    textAlign: "center",
    marginBottom: "30px",
    color: "#333",
    fontFamily: typography.options.headerFontFamily[0],
  },
  form: {
    marginBottom: "20px",
  },
  formGroup: {
    marginBottom: "20px",
  },
  formLabel: {
    display: "block",
    marginBottom: "5px",
    color: "#333",
  },
  formInput: {
    width: "100%",
    padding: "10px",
    fontSize: "16px",
    border: "1px solid #ccc",
    borderRadius: "5px",
  },
  uploadBtn: {
    backgroundColor: "#4CAF50",
    color: "#F0FFFF",
    padding: "10px 20px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    width: "100%",
    fontSize: "16px",
    fontFamily: typography.options.bodyFontFamily[0],
  },
  previewItem: {
    margin: "10px",
    textAlign: "center",
  },
  galleryBtn: {
    backgroundColor: "#4287f5",
    color: "#F0FFFF",
    padding: "10px 20px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    width: "100%",
    fontSize: "16px",
    marginTop: "10px", // Add some margin at the top to separate it from the Upload button
  },
};

const UploadPhotos = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [userName, setUserName] = useState("");
  const navigate  = useNavigate(); // Get the history object
  const handleViewGallery = () => {
    navigate('/gallery');
  }
  const handleFileSelect = (event) => {
    const files = event.target.files;
    const newSelectedFiles = [];
    for (const file of files) {
      if (!selectedFiles.some((selectedFile) => selectedFile.name === file.name)) {
        newSelectedFiles.push(file);
        if (file.type === "image/png" || file.type === "image/jpeg" || file.type === "image/jpg") {
          if (file.size <= MAX_IMAGE_SIZE_BYTES) {
            // Image width validation
            const img = new Image();
            img.src = URL.createObjectURL(file);
            img.onload = function () {
              if (img.width >= MIN_IMAGE_WIDTH) {
                setSelectedFiles((prevSelectedFiles) => [...prevSelectedFiles, file]);
              } else {
                alert(
                  `Image '${file.name}' must have a width of at least ${MIN_IMAGE_WIDTH} pixels.`
                );
              }
            };
          } else {
            alert(
              "Image '" + file.name + "' is too large. Max size allowed: " + MAX_IMAGE_SIZE_MB + " MB."
            );
          }
        } else {
          alert(
            "Image '" +
              file.name +
              "' has an unsupported file type. Only PNG, JPEG, and JPG are allowed."
          );
        }
      } else {
        alert("Image '" + file.name + "' is already selected and will not be uploaded again.");
      }
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Prepare the data to send to the backend
    const formData = new FormData();
    //formData.append("userName", userName);
    selectedFiles.forEach((file) => {
      formData.append("photos", file);
    });


    try {
      // Make a POST request to the backend server to upload files
      await axios.post("http://localhost:3000/upload", formData);

      // Reset the form after successful upload
      setSelectedFiles([]);
      //setUserName("");
    } catch (error) {
      console.error("Error uploading files:", error);
      // Handle any error that occurred during the upload
    }
  };


  return (
    <>
      <GoogleFont typography={typography} />
      <div style={styles.uploadContainer}>
        <h1 style={styles.h1}>Upload Photos</h1>
        <form style={styles.form} onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label style={styles.formLabel}>Name:</label>
            <input
              style={styles.formInput}
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.formLabel}>Select Photos:</label>
            <input
              style={styles.formInput}
              type="file"
              accept="image/png, image/jpeg, image/jpg"
              multiple
              onChange={handleFileSelect}
            />
          </div>
          <button style={styles.uploadBtn} type="submit">
            Upload
          </button>
          <button style={styles.galleryBtn} onClick={handleViewGallery}>
            Gallery View
          </button> {/* Add the Gallery View button here */}
        </form>
        <ImagePreview selectedFiles={selectedFiles} />
      </div>
    </>  
  );
};

export default UploadPhotos;
