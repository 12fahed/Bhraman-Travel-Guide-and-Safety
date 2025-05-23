import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ImageGallery = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/images');
      console.log(response)
      const imageArray = Object.entries(response.data).map(([path, data]) => ({
        id: path,
        path,
        filename: data.filename,
        username: data.username,
        description: data.description,
        imageUrl: data.url,
        landmarks: data.landmarks || []
      }));
      
      setImages(imageArray);
      setError(null);
    } catch (err) {
      console.error('Error fetching images:', err);
      setError('Failed to load images. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      await axios.post('http://localhost:5000/api/refresh');
      await fetchImages();
    } catch (err) {
      console.error('Error refreshing images:', err);
      setError('Failed to refresh images. Please try again later.');
    } finally {
      setRefreshing(false);
    }
  };

  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  const imagesByUser = images.reduce((acc, image) => {
    if (!acc[image.username]) {
      acc[image.username] = [];
    }
    acc[image.username].push(image);
    return acc;
  }, {});

  if (loading) {
    return <div className="text-center py-12">Loading images...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Image Gallery</h1>
        <button 
          onClick={handleRefresh}
          disabled={refreshing}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded disabled:bg-blue-300"
        >
          {refreshing ? 'Refreshing...' : 'Refresh Images'}
        </button>
      </div>
      
      {error && <div className="text-red-500">{error}</div>}
      
      {Object.keys(imagesByUser).length === 0 && !loading ? (
        <div className="text-center py-12">No images found.</div>
      ) : (
        Object.entries(imagesByUser).map(([username, userImages]) => (
          <div key={username} className="mb-12">
            <h2 className="text-xl font-semibold mb-4">{username}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {userImages.map((image) => (
                <div 
                  key={image.id} 
                  className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer"
                  onClick={() => handleImageClick(image)}
                >
                  <img src={image.imageUrl} alt={image.description} className="w-full h-48 object-cover" />
                  <div className="p-4">
                    <p className="text-sm text-gray-600 truncate">{image.filename}</p>
                    <p className="text-gray-800">{image.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
      
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4" onClick={closeModal}>
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-screen overflow-auto" onClick={e => e.stopPropagation()}>
            <button className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-md" onClick={closeModal}>X</button>
            <img src={selectedImage.imageUrl} alt={selectedImage.description} className="w-full" />
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-2">{selectedImage.filename}</h3>
              <p className="text-gray-600">Uploaded by: {selectedImage.username}</p>
              <p className="text-gray-800">{selectedImage.description}</p>
              {selectedImage.landmarks.length > 0 && (
                <div className="mt-4 bg-gray-100 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-500">Detected Landmarks:</h4>
                  <ul className="list-disc list-inside">
                    {selectedImage.landmarks.map((landmark, index) => (
                      <li key={index} className="text-gray-700">
                        {landmark.name} (Confidence: {(landmark.confidence * 100).toFixed(2)}%)
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageGallery;