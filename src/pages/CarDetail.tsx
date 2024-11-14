import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Pencil, Trash2, ChevronLeft } from 'lucide-react';
import { Car } from '../types';
import { useAuth } from '../context/AuthContext';
import { formatDate } from '../utils';

export default function CarDetail() {
  const [car, setCar] = useState<Car | null>(null);
  const [currentImage, setCurrentImage] = useState(0);
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const cars = JSON.parse(localStorage.getItem('cars') || '[]');
    const foundCar = cars.find((c: Car) => c.id === id && c.userId === user?.id);
    if (foundCar) {
      setCar(foundCar);
    } else {
      navigate('/');
    }
  }, [id, user, navigate]);

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this car?')) {
      const cars = JSON.parse(localStorage.getItem('cars') || '[]');
      const updatedCars = cars.filter((c: Car) => c.id !== id);
      localStorage.setItem('cars', JSON.stringify(updatedCars));
      navigate('/');
    }
  };

  if (!car) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center text-gray-600 hover:text-gray-900"
        >
          <ChevronLeft className="h-5 w-5 mr-1" />
          Back to Cars
        </button>
        <div className="flex gap-2">
          <button
            onClick={() => navigate(`/cars/${id}/edit`)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Pencil className="h-4 w-4 mr-2" />
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </button>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="relative h-96">
          <img
            src={car.images[currentImage]}
            alt={car.title}
            className="w-full h-full object-cover"
          />
          {car.images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
              {car.images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImage(index)}
                  className={`w-2 h-2 rounded-full ${
                    currentImage === index ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        <div className="p-6">
          <h1 className="text-3xl font-bold text-gray-900">{car.title}</h1>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              {car.tags.carType}
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
              {car.tags.company}
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
              {car.tags.dealer}
            </span>
          </div>
          <p className="mt-6 text-gray-600 whitespace-pre-wrap">{car.description}</p>
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center text-sm text-gray-500">
              Added on {formatDate(car.createdAt)}
            </div>
          </div>
        </div>

        {car.images.length > 1 && (
          <div className="px-6 pb-6">
            <div className="grid grid-cols-6 gap-2">
              {car.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImage(index)}
                  className={`relative aspect-square rounded-lg overflow-hidden ${
                    currentImage === index ? 'ring-2 ring-indigo-500' : ''
                  }`}
                >
                  <img
                    src={image}
                    alt={`${car.title} - Image ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}