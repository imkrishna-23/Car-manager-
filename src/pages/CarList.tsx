
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search } from 'lucide-react';
import { Car } from '../types';
import { useAuth } from '../context/AuthContext';
import { formatDate } from '../utils';

export default function CarList() {
  const [cars, setCars] = useState<Car[]>([]);
  const [search, setSearch] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const storedCars = JSON.parse(localStorage.getItem('cars') || '[]');
    setCars(storedCars.filter((car: Car) => car.userId === user?.id));
  }, [user]);

  const filteredCars = cars.filter((car) => {
    const searchTerm = search.toLowerCase();
    return (
      car.title.toLowerCase().includes(searchTerm) ||
      car.description.toLowerCase().includes(searchTerm) ||
      car.tags.carType.toLowerCase().includes(searchTerm) ||
      car.tags.company.toLowerCase().includes(searchTerm) ||
      car.tags.dealer.toLowerCase().includes(searchTerm)
    );
  });

  return (
    <div className="space-y-6 px-4 py-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 animate-fade-in">My Cars</h1>
        <button
          onClick={() => navigate('/cars/new')}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-transform duration-300 transform hover:scale-105"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add New Car
        </button>
      </div>

      <div className="relative mt-4">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-shadow duration-300 shadow hover:shadow-lg"
          placeholder="Search cars..."
        />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 animate-fade-in">
        {filteredCars.map((car) => (
          <div
            key={car.id}
            onClick={() => navigate(`/cars/${car.id}`)}
            className="bg-white overflow-hidden shadow-md rounded-lg cursor-pointer hover:shadow-lg transition-transform duration-200 transform hover:scale-105"
          >
            <div className="aspect-w-16 aspect-h-9">
              <img
                src={car.images[0]}
                alt={car.title}
                className="w-full h-48 object-cover transition-opacity duration-300 hover:opacity-90"
              />
            </div>
            <div className="px-4 py-4">
              <h3 className="text-lg font-medium text-gray-900">{car.title}</h3>
              <p className="mt-1 text-sm text-gray-500 line-clamp-2">{car.description}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 transition-colors duration-300 hover:bg-blue-200">
                  {car.tags.carType}
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 transition-colors duration-300 hover:bg-green-200">
                  {car.tags.company}
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 transition-colors duration-300 hover:bg-purple-200">
                  {car.tags.dealer}
                </span>
              </div>
              <div className="mt-4 text-sm text-gray-500">
                Added on {formatDate(car.createdAt)}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredCars.length === 0 && (
        <div className="text-center py-12 animate-fade-in">
          <p className="text-gray-500">No cars found. Add your first car!</p>
        </div>
      )}
    </div>
  );
}
