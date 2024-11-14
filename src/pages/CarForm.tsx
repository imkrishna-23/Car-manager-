
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Plus, X } from 'lucide-react';
import { Car } from '../types';
import { useAuth } from '../context/AuthContext';
import { generateId } from '../utils';
import { motion } from 'framer-motion';

const DEFAULT_CAR = {
  title: '',
  description: '',
  images: [],
  tags: {
    carType: '',
    company: '',
    dealer: '',
  },
};

export default function CarForm() {
  const [formData, setFormData] = useState<Omit<Car, 'id' | 'userId' | 'createdAt'>>(DEFAULT_CAR);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isEditing = Boolean(id);

  useEffect(() => {
    if (isEditing) {
      const cars = JSON.parse(localStorage.getItem('cars') || '[]');
      const car = cars.find((c: Car) => c.id === id && c.userId === user?.id);
      if (car) {
        const { id: _, userId: __, createdAt: ___, ...carData } = car;
        setFormData(carData);
      } else {
        navigate('/');
      }
    }
  }, [id, user, navigate, isEditing]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    if (formData.images.length === 0) {
      newErrors.images = 'At least one image is required';
    }
    if (!formData.tags.carType.trim()) {
      newErrors.carType = 'Car type is required';
    }
    if (!formData.tags.company.trim()) {
      newErrors.company = 'Company is required';
    }
    if (!formData.tags.dealer.trim()) {
      newErrors.dealer = 'Dealer is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const cars = JSON.parse(localStorage.getItem('cars') || '[]');
    
    if (isEditing) {
      const updatedCars = cars.map((car: Car) =>
        car.id === id ? { ...car, ...formData } : car
      );
      localStorage.setItem('cars', JSON.stringify(updatedCars));
    } else {
      const newCar: Car = {
        ...formData,
        id: generateId(),
        userId: user!.id,
        createdAt: new Date().toISOString(),
      };
      cars.push(newCar);
      localStorage.setItem('cars', JSON.stringify(cars));
    }

    navigate('/');
  };

  const handleImageAdd = () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          setFormData({
            ...formData,
            images: [...formData.images, reader.result as string],
          });
          setErrors({ ...errors, images: '' });
        };
        reader.readAsDataURL(file);
      }
    };
    fileInput.click();
  };

  const handleImageRemove = (index: number) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index),
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-all"
        >
          <ChevronLeft className="h-5 w-5 mr-1" />
          Back to Cars
        </button>
        <h1 className="text-2xl font-bold text-gray-900">
          {isEditing ? 'Edit Car' : 'Add New Car'}
        </h1>
      </div>

      <motion.form
        onSubmit={handleSubmit}
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        className="space-y-6 bg-white shadow-lg rounded-lg p-8"
      >
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-semibold text-gray-700">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm transition-all ${
              errors.title
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
            }`}
          />
          {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
        </div>

        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-semibold text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            rows={4}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm transition-all ${
              errors.description
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
            }`}
          />
          {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700">Images</label>
          <div className="mt-2 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {formData.images.map((image, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="relative group"
              >
                <img
                  src={image}
                  alt={`Car ${index + 1}`}
                  className="h-24 w-full object-cover rounded-lg shadow-lg"
                />
                <button
                  type="button"
                  onClick={() => handleImageRemove(index)}
                  className="absolute top-1 right-1 p-1 bg-red-600 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-4 w-4" />
                </button>
              </motion.div>
            ))}
            {formData.images.length < 10 && (
              <button
                type="button"
                onClick={handleImageAdd}
                className="h-24 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-transform transform hover:scale-105"
              >
                <Plus className="h-8 w-8 text-gray-400" />
              </button>
            )}
          </div>
          {errors.images && <p className="mt-1 text-sm text-red-600">{errors.images}</p>}
          <p className="mt-2 text-sm text-gray-500">Add up to 10 images</p>
        </div>

        <motion.div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {['carType', 'company', 'dealer'].map((field, i) => (
            <div key={i}>
              <label htmlFor={field} className="block text-sm font-semibold text-gray-700 capitalize">
                {field.replace(/([A-Z])/g, ' $1')}
              </label>
              <input
                type="text"
                id={field}
                value={formData.tags[field]}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    tags: { ...formData.tags, [field]: e.target.value },
                  })
                }
                className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm transition-all ${
                  errors[field]
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
                }`}
              />
              {errors[field] && <p className="mt-1 text-sm text-red-600">{errors[field]}</p>}
            </div>
          ))}
        </motion.div>

        <motion.div className="flex justify-end mt-6">
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-md shadow-lg transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {isEditing ? 'Save Changes' : 'Add Car'}
          </button>
        </motion.div>
      </motion.form>
    </motion.div>
  );
}
