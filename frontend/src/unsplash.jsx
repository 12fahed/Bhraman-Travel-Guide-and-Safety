import { useEffect, useState } from 'react';

export default function UnsplashGallery({ apiUrl }) {
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    async function fetchImage() {
      try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error('Failed to fetch image');
        const data = await response.json();
        if (data.results.length > 0) {
          setImageUrl(data.results[0].urls.small);
        }
      } catch (error) {
        console.error('Error fetching Unsplash image:', error);
      }
    }
    fetchImage();
  }, [apiUrl]);

  if (!imageUrl) return <div>Loading...</div>;

  return (
    <div className="p-4 w-full h-full">
      <img
        src={imageUrl}
        alt="Unsplash image"
        style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '16px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}
      />
    </div>
  );
}

// Usage Example
// <UnsplashGallery apiUrl="https://api.unsplash.com/search/photos?query=Calangute%20Beach&client_id=MtKPMwW2x5cgpY6GQeXmK1EhV08RFAOMt4f68Qg8jzM&per_page=1" />
