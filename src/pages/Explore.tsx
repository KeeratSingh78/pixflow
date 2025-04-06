import { useState, useEffect } from 'react';

interface ImageData {
  id: string;
  image_url: string;
  caption: string;
  username: string;
}

const Explore: React.FC = () => {
  const [images, setImages] = useState<ImageData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchRandomImages = async () => {
      try {
        setLoading(true);
        // Updated to fetch 15 images instead of 9
        const response = await fetch(
          'https://api.unsplash.com/photos/random?count=15&client_id=YOUR_UNSPLASH_ACCESS_KEY'
        );
        const data = await response.json();
        setImages(data.map((img: any) => ({
          id: img.id,
          image_url: img.urls.regular,
          caption: img.description || 'Random Image',
          username: img.user.username,
        })));
      } catch (error) {
        console.error('Error fetching random images:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRandomImages();
  }, []);

  // If API isn't available or you want placeholder images during development
  const placeholderImages: ImageData[] = [
    { id: '1', image_url: 'https://images.unsplash.com/photo-1742995917580-becb015f088d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDE0fDZzTVZqVExTa2VRfHxlbnwwfHx8fHw%3D', caption: 'Beautiful Scenery', username: 'nature_lover' },
    { id: '2', image_url: 'https://plus.unsplash.com/premium_photo-1669927131902-a64115445f0f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Y2l0eXxlbnwwfHwwfHx8MA%3D%3D', caption: 'City Skyline', username: 'urban_explorer' },
    { id: '3', image_url: 'https://plus.unsplash.com/premium_photo-1673108852141-e8c3c22a4a22?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Zm9vZHxlbnwwfHwwfHx8MA%3D%3D', caption: 'Delicious Cuisine', username: 'food_photographer' },
    { id: '4', image_url: 'https://images.unsplash.com/photo-1528543606781-2f6e6857f318?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YWR2ZW50dXJlfGVufDB8fDB8fHww', caption: 'Adventure Awaits', username: 'wanderlust' },
    { id: '5', image_url: 'https://images.unsplash.com/photo-1518733057094-95b53143d2a7?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bW9kZXJuJTIwZGVzaWdufGVufDB8fDB8fHwwe', caption: 'Modern Design', username: 'architect_view' },
    { id: '6', image_url: 'https://images.unsplash.com/photo-1629747490241-624f07d70e1e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cG9ydHJhaXQlMjBwaG90b3xlbnwwfHwwfHx8MA%3D%3D', caption: 'Portrait Photography', username: 'portrait_artist' },
    { id: '7', image_url: 'https://plus.unsplash.com/premium_photo-1661933831125-6e4f795abf08?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8d2lsZGxpZmUlMjBzaG90fGVufDB8fDB8fHww', caption: 'Wildlife Shot', username: 'animal_lover' },
    { id: '8', image_url: 'https://images.unsplash.com/photo-1601751839176-7d023cb55ed8?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8dGVjaCUyMGludm9hdGlvbnxlbnwwfHwwfHx8MA%3D%3D', caption: 'Tech Innovations', username: 'tech_enthusiast' },
    { id: '9', image_url: 'https://images.unsplash.com/photo-1607076491231-bbf4f1db1ebb?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Y3JlYXRpdmUlMjBtYXN0ZXJwaWVjZXxlbnwwfHwwfHx8MA%3D%3D', caption: 'Creative Masterpiece', username: 'art_collector' },
    { id: '10', image_url: 'https://plus.unsplash.com/premium_photo-1679094619819-6dd31c3fff31?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8ZWFydGglMjBwaG90b2dyYXBoZXJ8ZW58MHx8MHx8fDA%3D', caption: 'Natural Wonder', username: 'earth_photographer' },
    { id: '11', image_url: 'https://plus.unsplash.com/premium_photo-1685303469251-4ee0ea014bb3?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8c3BvcnRzfGVufDB8fDB8fHww', caption: 'Athletic Moment', username: 'sports_fan' },
    { id: '12', image_url: 'https://plus.unsplash.com/premium_photo-1690820317745-770eb6a3ee67?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8ZmFzaGlvbiUyMGZvcndhcmR8ZW58MHx8MHx8fDA%3D', caption: 'Fashion Forward', username: 'style_guru' },
    { id: '13', image_url: 'https://images.unsplash.com/photo-1718220216044-006f43e3a9b1?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZmVzc2lvbmFsJTIwZW52aXJvbm1lbnR8ZW58MHx8MHx8fDA%3D', caption: 'Professional Environment', username: 'business_pro' },
    { id: '14', image_url: 'https://plus.unsplash.com/premium_photo-1668455494252-e4ca4a2609ca?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8d2VsbGxuZXNzJTIwam91cm5leXxlbnwwfHwwfHx8MA%3D%3D', caption: 'Wellness Journey', username: 'health_advocate' },
    { id: '15', image_url: 'https://plus.unsplash.com/premium_photo-1684348962314-64fa628992f0?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8aW50ZXJpb3IlMjBkZXNpZ258ZW58MHx8MHx8fDA%3D', caption: 'Interior Design', username: 'home_stylist' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Explore</h1>
          <p className="text-gray-600">Discover random inspiration</p>
        </header>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.length > 0 ? images.map((image) => (
              <div key={image.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="relative pb-[100%]">
                  <img 
                    src={image.image_url} 
                    alt={image.caption} 
                    className="absolute top-0 left-0 w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <p className="font-medium mb-2 truncate">{image.caption}</p>
                  <div className="flex items-center text-sm text-gray-500">
                    <span>@{image.username}</span>
                  </div>
                </div>
              </div>
            )) : placeholderImages.map((image) => (
              <div key={image.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="relative pb-[100%]">
                  <img 
                    src={image.image_url} 
                    alt={image.caption} 
                    className="absolute top-0 left-0 w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <p className="font-medium mb-2 truncate">{image.caption}</p>
                  <div className="flex items-center text-sm text-gray-500">
                    <span>@{image.username}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Explore;