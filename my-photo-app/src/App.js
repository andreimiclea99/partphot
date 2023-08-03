import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UploadPhotos from "./UploadPhotos";
import React, { useState } from "react";
import ImagePreview from "./ImagePreview.js";
import Gallery from "./Gallery.js";
import backgroundPhoto from "./images/background.jpg"; // Import the background photo
// Component to render both UploadPhotos and ImagePreview
const UploadPage = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  return (
    <>
      <UploadPhotos selectedFiles={selectedFiles} setSelectedFiles={setSelectedFiles} />
      <ImagePreview selectedFiles={selectedFiles} />
    </>
  );
};

const App = () => {
  const appStyles = {
    backgroundImage: `url(${backgroundPhoto})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    minHeight: "100vh", // Set a minimum height to ensure the background covers the entire viewport
  };

  return (
    <Router>
      <div style={appStyles}>
        <Routes>
          <Route path="/" element={<UploadPage />} />
          <Route path="/gallery" element={<Gallery />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
