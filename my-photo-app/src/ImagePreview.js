import React, { useState } from "react";

const styles = {
    previewContainer: {
        marginTop: "20px",
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
      },
      previewListItem: {
        listStyle: "none",
        margin: "10px",
        textAlign: "center",
        cursor: "pointer", // Add cursor pointer to indicate it's clickable
        transition: "transform 0.3s ease", // Add a transition for smooth animation
      },
      previewItemLarge: { //Styles the larger preview when an image is selected
        maxWidth: "500px", // You can adjust the width and height as needed
        maxHeight: "400px",
        borderRadius: "7px",
        boxShadow: "0 10px 20px rgba(0, 0, 0, 0.2)",
        transform: "scale(2.2)", // Increase the size of the selected image
      },
};

const ImagePreview = ({ selectedFiles }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(-1); // State to track the index of the selected image

  const handleImageClick = (index) => {
    setSelectedImageIndex(index); // Update the selectedImageIndex state when an image is clicked
  };

  return (
    <div>
      <ul id="previewContainer" style={styles.previewContainer}>
        {/* Render the images in horizontal list */}
        {selectedFiles.map((file, index) => (
          <li
            key={index}
            style={{
              ...styles.previewListItem,
              ...(index === selectedImageIndex && styles.previewItemLarge), // Apply larger size to the selected image
            }}
            onClick={() => handleImageClick(index)} // Handle click on the image to make it larger
          >
            <img
              src={URL.createObjectURL(file)}
              alt={file.name}
              style={{
                maxWidth: "150px", // Adjust the max width of the images (not applied to the selected image)
                borderRadius: "5px",
                boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
              }}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ImagePreview;
