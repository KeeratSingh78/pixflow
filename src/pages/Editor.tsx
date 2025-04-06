import { useState, useCallback, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import {
  Upload,
  Crop,
  RotateCcw,
  Sun,
  Contrast,
  ImageIcon,
  Download,
  Share,
  X,
} from 'lucide-react';
import Cropper from 'react-easy-crop';
import { useFirebase } from '../context/FirebaseContext';
import axios from 'axios';
import ErrorBoundary from '../components/ErrorBoundary';

type FilterStyleType = {
  [key: string]: string;
};

type CropPosition = {
  x: number;
  y: number;
};

type CroppedAreaPixels = {
  x: number;
  y: number;
  width: number;
  height: number;
} | null;

const filterStyles: FilterStyleType = {
  normal: '',
  grayscale: 'grayscale(100%)',
  sepia: 'sepia(100%)',
  cool: 'hue-rotate(-100deg)',
  warm: 'hue-rotate(100deg)',
  vintage: 'sepia(60%) brightness(80%) contrast(110%)',
};

const Editor: React.FC = () => {
  const { auth } = useFirebase();
  const [image, setImage] = useState<string | null>(null);
  const [crop, setCrop] = useState<CropPosition>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState<number>(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<CroppedAreaPixels>(null);
  const [brightness, setBrightness] = useState<number>(50);
  const [contrast, setContrast] = useState<number>(50);
  const [saturation, setSaturation] = useState<number>(50);
  const [filter, setFilter] = useState<string>('normal');
  const [aspect, setAspect] = useState<number | null>(null);
  const [cropVisible, setCropVisible] = useState<boolean>(false);
  const [currentTab, setCurrentTab] = useState<string>('adjust');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isSharing, setIsSharing] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          setIsAuthenticated(true);
          const token = await user.getIdToken();
          localStorage.setItem('token', token);
        } else {
          setIsAuthenticated(false);
          localStorage.removeItem('token');
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setIsAuthenticated(false);
      }
    };

    checkAuth();
    const unsubscribe = auth.onAuthStateChanged((user) => {
      checkAuth();
    });

    return () => unsubscribe();
  }, [auth]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!isAuthenticated) {
      alert('Please sign in to upload and edit images.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setImage(event.target.result as string);
        setBrightness(50);
        setContrast(50);
        setSaturation(50);
        setFilter('normal');
        setCrop({ x: 0, y: 0 });
        setZoom(1);
        setCroppedAreaPixels(null);
        setErrorMessage(null);
      }
    };
    reader.readAsDataURL(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const onCropComplete = useCallback((croppedArea: any, croppedAreaPixelsData: CroppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixelsData);
  }, []);

  const createCroppedImage = async (sourceImage: string, pixelCrop: CroppedAreaPixels): Promise<string> => {
    if (!pixelCrop) {
      throw new Error('Crop area not defined');
    }
    
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.crossOrigin = "anonymous";
      
      image.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          if (!ctx) {
            reject(new Error('Could not get canvas context'));
            return;
          }
          
          // Set proper canvas dimensions
          canvas.width = pixelCrop.width;
          canvas.height = pixelCrop.height;
          
          // Draw the cropped image
          ctx.drawImage(
            image,
            pixelCrop.x,
            pixelCrop.y,
            pixelCrop.width,
            pixelCrop.height,
            0,
            0,
            pixelCrop.width,
            pixelCrop.height
          );
          
          // Convert to base64 and resolve
          const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
          resolve(dataUrl);
        } catch (error) {
          reject(error);
        }
      };
      
      image.onerror = () => reject(new Error('Failed to load image for cropping'));
      image.src = sourceImage;
    });
  };

  const handleSaveCroppedImage = async () => {
    if (!image || !croppedAreaPixels) {
      setErrorMessage('Please upload an image and select a crop area.');
      return;
    }

    try {
      setIsSaving(true);
      setErrorMessage(null);
      
      const croppedImage = await createCroppedImage(image, croppedAreaPixels);
      setImage(croppedImage);
      setCropVisible(false);
      setCurrentTab('adjust');

      // Skip server upload for now to avoid the network error
      // Instead, just work with the local cropped image
      console.log('Image cropped successfully');
      
      // If you want to try server upload with better error handling:
      if (false && isAuthenticated) { // Set to true when your server is ready
        try {
          const token = localStorage.getItem('token');
          if (!token) throw new Error('No authentication token found');

          const blob = await fetch(croppedImage).then((res) => res.blob());
          const formData = new FormData();
          formData.append('image', blob, 'cropped-image.jpg');

          // Timeout increased and better error handling
          await axios.post(
            'http://localhost:5000/api/images',
            formData,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
              },
              timeout: 10000, // 10 seconds
            }
          );
        } catch (uploadError) {
          console.error('Upload error but continuing with local edit:', uploadError);
          // Continue with the local edit even if server upload fails
        }
      }
    } catch (error) {
      console.error('Error saving cropped image:', error);
      setErrorMessage('Failed to process the cropped image. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const cancelCrop = () => {
    setCropVisible(false);
    setCurrentTab('adjust');
  };

  const applyFilter = (filterType: string) => {
    setFilter(filterType);
  };

  const generateEditedImage = async (): Promise<string | null> => {
    if (!image) return null;
    
    return new Promise((resolve, reject) => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Could not get canvas context');

        const img = new Image();
        img.crossOrigin = 'anonymous';
        
        img.onload = () => {
          try {
            canvas.width = img.width;
            canvas.height = img.height;
            
            const brightnessValue = brightness * 2;
            const contrastValue = contrast * 2;
            const saturationValue = saturation * 2;
            const filterValue = filterStyles[filter] || '';
            
            ctx.filter = `brightness(${brightnessValue}%) contrast(${contrastValue}%) saturate(${saturationValue}%) ${filterValue}`;
            ctx.drawImage(img, 0, 0);
            
            resolve(canvas.toDataURL('image/jpeg', 0.9));
          } catch (drawError) {
            reject(drawError);
          }
        };
        
        img.onerror = () => reject(new Error('Failed to load image for editing'));
        img.src = image;
      } catch (error) {
        reject(error);
      }
    });
  };

  const handleShare = async () => {
    if (!isAuthenticated) {
      setErrorMessage('Please log in to share.');
      return;
    }

    if (!image) {
      setErrorMessage('No image to share.');
      return;
    }

    try {
      setIsSharing(true);
      setErrorMessage(null);
      
      const editedImage = await generateEditedImage();
      if (!editedImage) throw new Error('Failed to generate edited image');

      const blob = await fetch(editedImage).then((res) => res.blob());
      const file = new File([blob], 'edited-image.jpg', { type: 'image/jpeg' });
      
      if (navigator.share) {
        await navigator.share({
          files: [file],
          title: 'Edited Image',
          text: 'Check out my edited image!',
        });
      } else {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'edited-image.jpg';
        link.click();
        URL.revokeObjectURL(url);
        alert('Image downloaded. Please share it manually.');
      }
    } catch (error) {
      console.error('Error sharing image:', error);
      setErrorMessage('Failed to share image. Please try again.');
    } finally {
      setIsSharing(false);
    }
  };

  const handleAspectChange = (aspectRatio: number | null) => {
    setAspect(aspectRatio);
  };

  const handleSaveToDevice = async () => {
    try {
      setIsSaving(true);
      setErrorMessage(null);
      
      const editedImage = await generateEditedImage();
      if (editedImage) {
        const link = document.createElement('a');
        link.href = editedImage;
        link.download = 'edited-image.jpg';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        throw new Error('Failed to generate edited image');
      }
    } catch (error) {
      console.error('Error saving image to device:', error);
      setErrorMessage('Failed to save image. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleTabChange = (value: string) => {
    setCurrentTab(value);
    if (value === 'crop') {
      setCropVisible(true);
    } else {
      setCropVisible(false);
    }
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <div className="container mx-auto px-4 py-8">
          <header className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Image Editor</h1>
          </header>
          
          {errorMessage && (
            <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded">
              <p>{errorMessage}</p>
            </div>
          )}
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1 space-y-6">
              {!image && (
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h2 className="text-lg font-semibold mb-4">Upload Image</h2>
                  <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6">
                    <Upload className="h-10 w-10 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500 mb-4 text-center">
                      Drag and drop an image or click to browse
                    </p>
                    <input
                      type="file"
                      id="image-upload"
                      ref={fileInputRef}
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                    <Button asChild>
                      <label htmlFor="image-upload" className="cursor-pointer">
                        Browse Files
                      </label>
                    </Button>
                    {!isAuthenticated && (
                      <p className="text-xs text-red-500 mt-2">
                        Please sign in to upload and edit images
                      </p>
                    )}
                  </div>
                </div>
              )}

              {image && (
                <>
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-lg font-semibold mb-4">Editing Tools</h2>
                    {!isAuthenticated ? (
                      <div className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-md">
                        <p className="text-sm text-gray-500 mb-2">Sign in to access editing tools</p>
                      </div>
                    ) : (
                      <Tabs value={currentTab} onValueChange={handleTabChange}>
                        <TabsList className="w-full">
                          <TabsTrigger value="adjust" className="flex-1">Adjust</TabsTrigger>
                          <TabsTrigger value="crop" className="flex-1">Crop</TabsTrigger>
                          <TabsTrigger value="filters" className="flex-1">Filters</TabsTrigger>
                        </TabsList>
                        <TabsContent value="adjust" className="space-y-4 pt-4">
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <Label htmlFor="brightness">Brightness</Label>
                              <span className="text-xs text-gray-500">{brightness}</span>
                            </div>
                            <Slider
                              id="brightness"
                              value={[brightness]}
                              onValueChange={(value) => setBrightness(value[0])}
                              max={100}
                              step={1}
                            />
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <Label htmlFor="contrast">Contrast</Label>
                              <span className="text-xs text-gray-500">{contrast}</span>
                            </div>
                            <Slider
                              id="contrast"
                              value={[contrast]}
                              onValueChange={(value) => setContrast(value[0])}
                              max={100}
                              step={1}
                            />
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <Label htmlFor="saturation">Saturation</Label>
                              <span className="text-xs text-gray-500">{saturation}</span>
                            </div>
                            <Slider
                              id="saturation"
                              value={[saturation]}
                              onValueChange={(value) => setSaturation(value[0])}
                              max={100}
                              step={1}
                            />
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full"
                            onClick={() => {
                              setBrightness(50);
                              setContrast(50);
                              setSaturation(50);
                            }}
                          >
                            <RotateCcw className="mr-2 h-4 w-4" />
                            Reset Adjustments
                          </Button>
                        </TabsContent>
                        <TabsContent value="crop" className="pt-4">
                          <div className="space-y-4">
                            {cropVisible && (
                              <>
                                <div className="flex items-center gap-2">
                                  <Label htmlFor="zoom-slider" className="w-20">Zoom</Label>
                                  <Slider
                                    id="zoom-slider"
                                    value={[zoom]}
                                    min={1}
                                    max={3}
                                    step={0.1}
                                    onValueChange={(value) => setZoom(value[0])}
                                  />
                                </div>
                                <div className="flex flex-wrap gap-2 mt-2">
                                  <Button
                                    variant={aspect === null ? 'default' : 'outline'}
                                    onClick={() => handleAspectChange(null)}
                                    size="sm"
                                  >
                                    Free
                                  </Button>
                                  <Button
                                    variant={aspect === 16 / 9 ? 'default' : 'outline'}
                                    onClick={() => handleAspectChange(16 / 9)}
                                    size="sm"
                                  >
                                    16:9
                                  </Button>
                                  <Button
                                    variant={aspect === 9 / 16 ? 'default' : 'outline'}
                                    onClick={() => handleAspectChange(9 / 16)}
                                    size="sm"
                                  >
                                    9:16
                                  </Button>
                                  <Button
                                    variant={aspect === 5 / 4 ? 'default' : 'outline'}
                                    onClick={() => handleAspectChange(5 / 4)}
                                    size="sm"
                                  >
                                    5:4
                                  </Button>
                                  <Button
                                    variant={aspect === 4 / 5 ? 'default' : 'outline'}
                                    onClick={() => handleAspectChange(4 / 5)}
                                    size="sm"
                                  >
                                    4:5
                                  </Button>
                                  <Button
                                    variant={aspect === 3 / 2 ? 'default' : 'outline'}
                                    onClick={() => handleAspectChange(3 / 2)}
                                    size="sm"
                                  >
                                    3:2
                                  </Button>
                                  <Button
                                    variant={aspect === 2 / 3 ? 'default' : 'outline'}
                                    onClick={() => handleAspectChange(2 / 3)}
                                    size="sm"
                                  >
                                    2:3
                                  </Button>
                                  <Button
                                    variant={aspect === 1 ? 'default' : 'outline'}
                                    onClick={() => handleAspectChange(1)}
                                    size="sm"
                                  >
                                    Square
                                  </Button>
                                </div>
                                <div className="flex gap-2 mt-4">
                                  <Button
                                    onClick={handleSaveCroppedImage}
                                    className="flex-1"
                                    disabled={isSaving}
                                  >
                                    {isSaving ? 'Saving...' : 'Apply Crop'}
                                  </Button>
                                  <Button
                                    variant="outline"
                                    onClick={cancelCrop}
                                    className="flex-1"
                                  >
                                    Cancel
                                  </Button>
                                </div>
                              </>
                            )}
                            {!cropVisible && (
                              <div className="flex flex-col items-center justify-center h-40 bg-gray-50 rounded border border-dashed border-gray-300">
                                <Crop className="h-8 w-8 text-gray-400 mb-2" />
                                <p className="text-sm text-gray-500">Click button below to start cropping</p>
                                <Button
                                  className="mt-4"
                                  onClick={() => setCropVisible(true)}
                                >
                                  Enable Cropping
                                </Button>
                              </div>
                            )}
                          </div>
                        </TabsContent>
                        <TabsContent value="filters" className="pt-4">
                          <div className="grid grid-cols-3 gap-2">
                            {Object.keys(filterStyles).map((f) => (
                              <div
                                key={f}
                                className={`aspect-square bg-gray-100 rounded flex flex-col items-center justify-center cursor-pointer hover:bg-gray-200 transition ${
                                  filter === f ? 'ring-2 ring-blue-500' : ''
                                }`}
                                onClick={() => applyFilter(f)}
                              >
                                <div className="w-full h-12 rounded-t relative">
                                  {image && (
                                    <img
                                      src={image}
                                      alt={f}
                                      className="w-full h-full object-cover rounded-t absolute top-0 left-0"
                                      style={{ filter: filterStyles[f] || 'none' }}
                                    />
                                  )}
                                </div>
                                <span className="text-xs mt-1 capitalize">{f}</span>
                              </div>
                            ))}
                          </div>
                        </TabsContent>
                      </Tabs>
                    )}
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-lg font-semibold mb-4">Save & Share</h2>
                    <div className="space-y-3">
                      <Button
                        className="w-full"
                        onClick={handleSaveToDevice}
                        disabled={isSaving || !isAuthenticated}
                      >
                        <Download className="mr-2 h-4 w-4" />
                        {isSaving ? 'Saving...' : 'Save to Device'}
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={handleShare}
                        disabled={isSharing || !isAuthenticated}
                      >
                        <Share className="mr-2 h-4 w-4" />
                        {isSharing ? 'Sharing...' : 'Share with Others'}
                      </Button>
                      {!isAuthenticated && (
                        <p className="text-xs text-red-500 mt-2 text-center">
                          Sign in to save or share images
                        </p>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
            <div className="lg:col-span-3">
              <div className="bg-white p-6 rounded-lg shadow-md min-h-[400px] flex items-center justify-center">
                {image ? (
                  <div className="relative max-w-full max-h-[70vh] w-full h-full">
                    {cropVisible && isAuthenticated ? (
                      <div className="relative w-full h-[70vh]">
                        <Cropper
                          image={image}
                          crop={crop}
                          zoom={zoom}
                          aspect={aspect || undefined}
                          onCropChange={setCrop}
                          onZoomChange={setZoom}
                          onCropComplete={onCropComplete}
                          style={{
                            containerStyle: {
                              height: '100%',
                              width: '100%',
                              position: 'relative'
                            }
                          }}
                        />
                        <Button
                          size="sm"
                          variant="destructive"
                          className="absolute top-4 right-4 z-10"
                          onClick={cancelCrop}
                        >
                          <X className="h-4 w-4 mr-1" />
                          Exit
                        </Button>
                      </div>
                    ) : (
                      <img
                        src={image}
                        alt="Uploaded"
                        className="max-w-full max-h-[70vh] object-contain"
                        style={{
                          filter: `brightness(${brightness * 2}%) contrast(${contrast * 2}%) saturate(${saturation * 2}%) ${filterStyles[filter] || ''}`,
                        }}
                      />
                    )}
                  </div>
                ) : (
                  <div className="text-center">
                    <ImageIcon className="mx-auto h-16 w-16 text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-1">No image selected</h3>
                    <p className="text-gray-500">Upload an image to start editing</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default Editor;