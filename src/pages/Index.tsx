import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-white overflow-hidden relative">
      {/* Bubble Animation Background */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(10)].map((_, index) => (
          <div
            key={index}
            className="absolute rounded-full bg-blue-200/50 animate-bubble"
            style={{
              width: `${Math.random() * 20 + 10}px`,
              height: `${Math.random() * 20 + 10}px`,
              left: `${Math.random() * 100}vw`,
              bottom: `${Math.random() * -50 - 50}vh`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 5 + 5}s`,
            }}
          />
        ))}
      </div>

      <main className="flex-1">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="flex flex-col md:flex-row items-center gap-12 animate-fade-in">
            <div className="flex-1 space-y-6 z-10">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight animate-slide-up">
                Edit, Share, and Discover Amazing Images
              </h1>
              <p className="text-lg md:text-xl text-gray-600 animate-slide-up delay-100">
                PixFlow lets you edit your photos with powerful tools, share them with the world, and discover beautiful images from other creators.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4 animate-slide-up delay-200">
                <Button
                  asChild
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 transform hover:scale-105 transition-transform duration-300"
                >
                  <Link to="/editor">
                    Start Editing <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="transform hover:scale-105 transition-transform duration-300"
                >
                  <Link to="/explore">Explore Gallery</Link>
                </Button>
              </div>
            </div>
            <div className="flex-1 relative z-10">
              <div className="aspect-video bg-white rounded-xl overflow-hidden shadow-2xl border border-gray-200 transform hover:scale-105 transition-transform duration-300 ease-in-out animate-fade-in-up">
                <img
                  src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80"
                  alt="Stylish Image Preview"
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-sm px-2 py-1 rounded animate-pulse">
                  Image Preview
                </span>
              </div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-blue-100 rounded-lg opacity-80 blur-md animate-float hidden md:block"></div>
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-purple-100 rounded-lg opacity-80 blur-md animate-float hidden md:block"></div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 animate-fade-in-up delay-300">
              Powerful Editing Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 animate-fade-in-left">
                <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <img
                    src="https://img.icons8.com/ios-filled/50/000000/edit-image.png"
                    alt="Edit Icon"
                    className="h-6 w-6 text-blue-600"
                  />
                </div>
                <h3 className="text-xl font-semibold mb-2">Image Editing</h3>
                <p className="text-gray-600">Crop, resize, adjust colors, and apply filters to make your photos stand out.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 animate-fade-in">
                <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                  <img
                    src="https://img.icons8.com/ios-filled/50/000000/share.png"
                    alt="Share Icon"
                    className="h-6 w-6 text-purple-600"
                  />
                </div>
                <h3 className="text-xl font-semibold mb-2">Share with Everyone</h3>
                <p className="text-gray-600">Post your edited images to share them with the PixFlow community.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 animate-fade-in-right">
                <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <img
                    src="https://img.icons8.com/ios-filled/50/000000/search.png"
                    alt="Explore Icon"
                    className="h-6 w-6 text-green-600"
                  />
                </div>
                <h3 className="text-xl font-semibold mb-2">Explore & Discover</h3>
                <p className="text-gray-600">Discover amazing photos from creators around the world and get inspired.</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="container mx-auto px-4 text-center text-gray-600 animate-fade-in-up delay-400">
          <p>Designed by Keerat Singh</p>
        </div>
      </footer>
    </div>
  );
};
export default Index;