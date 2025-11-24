import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { GalleryImage } from '../types';

export function Gallery() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  useEffect(() => {
    const fetchImages = async () => {
      const { data } = await supabase.from('gallery_images').select('*').order('sort_order');
      if (data) setImages(data);
    };
    fetchImages();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Gallery</h1>
          <p className="text-xl text-blue-100">Our products and operations</p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          {images.length === 0 ? (
            <div className="text-center py-12 text-gray-600">No gallery images yet</div>
          ) : (
            <div className="grid md:grid-cols-4 gap-4">
              {images.map((image) => (
                <div
                  key={image.id}
                  className="relative h-64 bg-gray-200 rounded-lg overflow-hidden cursor-pointer group"
                  onClick={() => setSelectedImage(image)}
                >
                  <img
                    src={image.image_url}
                    alt={image.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors"></div>
                  {image.title && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-3">
                      <p className="text-sm font-semibold">{image.title}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
            <button
              className="absolute -top-10 right-0 text-white text-3xl"
              onClick={() => setSelectedImage(null)}
            >
              ×
            </button>
            <img
              src={selectedImage.image_url}
              alt={selectedImage.title}
              className="w-full rounded-lg"
            />
            {selectedImage.title && (
              <p className="text-white text-center mt-4 text-lg">{selectedImage.title}</p>
            )}
            {selectedImage.description && (
              <p className="text-gray-300 text-center mt-2">{selectedImage.description}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
