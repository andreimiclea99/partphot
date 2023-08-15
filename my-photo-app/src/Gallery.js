import React, { useState, useEffect } from 'react';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css'; 

function App() {
  const [data, setData] = useState([]);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  // Fetch data from backend
  useEffect(() => {
    fetch('http://localhost:3000/files')
      .then(response => {
        console.log('Status code:', response.status);
        console.log('Status text:', response.statusText);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => setData(data))
      .catch(error => console.error('Error:', error));
  }, []);

  const images = data.filter(item => item.type === 'image');
  const videos = data.filter(item => item.type === 'video');

  return (
    <div>
      <div>
        {images.map((image, index) => (
          <div key={index}>
            <img
              src={image.url}
              alt=""
              onClick={() => {
                setPhotoIndex(index);
                setIsOpen(true);
              }}
            />
            <a href={image.url} download>Download</a>
          </div>
        ))}
        {videos.map((video, index) => (
          <div key={index}>
            <video src={video.url} controls />
            <a href={video.url} download>Download</a>
          </div>
        ))}
      </div>

      {isOpen && (
        <Lightbox
          mainSrc={images[photoIndex].url}
          nextSrc={images[(photoIndex + 1) % images.length].url}
          prevSrc={images[(photoIndex + images.length - 1) % images.length].url}
          onCloseRequest={() => setIsOpen(false)}
          onMovePrevRequest={() =>
            setPhotoIndex((photoIndex + images.length - 1) % images.length)
          }
          onMoveNextRequest={() =>
            setPhotoIndex((photoIndex + 1) % images.length)
          }
        />
      )}
      <button onClick={downloadAll}>Download All</button>
    </div>
  );

  function downloadAll() {
    // For each file, create a temporary link element and click it to start the download
    data.forEach((file) => {
      const link = document.createElement('a');
      link.href = file.url;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  }
}

export default App;
