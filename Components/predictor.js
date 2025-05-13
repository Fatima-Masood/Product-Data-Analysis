'use client';

import React, { useState } from 'react';
import styles from './predictor.module.css';

const SmartphonePricePredictor = () => {
  // Sample data with ratings and models
  const phoneData = [
    { brand: 'Infinix', model: 'Zero 40 4G', displaySize: 6.78, ram: 8, battery: 500, storage: 256, price: 70000, ratings: 1200 },
    { brand: 'Samsung', model: 'Galaxy ZF1', displaySize: 6.7, ram: 12, battery: 4000, storage: 512, price: 385000, ratings: 8500 },
    { brand: 'Samsung', model: 'Galaxy ZF2', displaySize: 7.6, ram: 12, battery: 4400, storage: 512, price: 605000, ratings: 9200 },
    { brand: 'Samsung', model: 'Galaxy A0E', displaySize: 6.7, ram: 4, battery: 5000, storage: 64, price: 25000, ratings: 3500 },
    { brand: 'Tecno', model: 'Phantom V', displaySize: 7.85, ram: 12, battery: 5750, storage: 512, price: 370000, ratings: 2800 },
    // ... more data
  ];

  const brands = [
    "Apple", "Samsung", "Huawei", "Oppo", "Vivo", "Xiaomi", "Redmi", "POCO", "Realme", 
    "OnePlus", "Nokia", "Infinix", "Tecno", "Itel", "QMobile", "Dcode", "Motorola", 
    "Sony", "LG", "HTC", "Lenovo", "Alcatel", "ZTE", "Nubia", "Wiko", "Meizu", 
    "Acer", "Panasonic", "Asus", "Google", "BlackBerry"
  ];

  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    displaySize: '',
    ram: '',
    battery: '',
    storage: '',
    ratings: ''
  });

  const [predictedPrice, setPredictedPrice] = useState(null);
  const [similarPhones, setSimilarPhones] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const predictPrice = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { displaySize, ram, battery, storage, brand, model, ratings } = formData;
      const displaySizeNum = parseFloat(displaySize);
      const ramNum = parseInt(ram);
      const batteryNum = parseInt(battery);
      const storageNum = parseInt(storage);
      const ratingsNum = parseInt(ratings) || 0;

      // Call the API (replace with your actual API endpoint)
      const response = await fetch('http://localhost:8000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          brand,
          model,
          display_size: displaySizeNum,
          ram: ramNum,
          battery: batteryNum,
          storage: storageNum,
          ratings: ratingsNum
        }),
      });

      if (!response.ok) {
        throw new Error('Prediction failed');
      }

      const data = await response.json();
      setPredictedPrice(data.predicted_price);

      // Show similar phones
      const similar = phoneData.filter(phone => 
        Math.abs(phone.displaySize - displaySizeNum) <= 0.5 &&
        Math.abs(phone.ram - ramNum) <= 4 &&
        Math.abs(phone.battery - batteryNum) <= 1000 &&
        Math.abs(phone.storage - storageNum) <= 128
      );
      setSimilarPhones(similar);

    } catch (error) {
      console.error('Prediction error:', error);
      // Fallback calculation
      const displaySizeNum = parseFloat(formData.displaySize);
      const ramNum = parseInt(formData.ram);
      const batteryNum = parseInt(formData.battery);
      const storageNum = parseInt(formData.storage);
      const ratingsNum = parseInt(formData.ratings) || 1000;
      
      // Adjusted formula to include ratings impact
      const basePrice = 20000;
      const price = basePrice + 
                   (displaySizeNum * 10000) + 
                   (ramNum * 5000) + 
                   (batteryNum * 5) + 
                   (storageNum * 200) +
                   (ratingsNum * 0.5); // Each rating adds 0.5 to price
      setPredictedPrice(Math.round(price));
      setSimilarPhones([]);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      brand: '',
      model: '',
      displaySize: '',
      ram: '',
      battery: '',
      storage: '',
      ratings: ''
    });
    setPredictedPrice(null);
    setSimilarPhones([]);
  };

  return (
    <div className={styles.predictorContainer}>
      <div className={styles.predictorCard}>
        <h1 className={styles.predictorTitle}>Smartphone Price Predictor</h1>
        <p className={styles.predictorSubtitle}>Enter specifications to get price estimation</p>
        
        <form onSubmit={predictPrice} className={styles.predictorForm}>
          <div className={styles.formGroup}>
            <label htmlFor="brand">Brand</label>
            <select 
              id="brand" 
              name="brand" 
              value={formData.brand}
              onChange={handleChange}
              className={styles.formControl}
              required
            >
              <option value="">Select Brand</option>
              {brands.map(brand => (
                <option key={brand} value={brand}>{brand}</option>
              ))}
            </select>
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="model">Model Name</label>
            <input
              type="text"
              id="model"
              name="model"
              value={formData.model}
              onChange={handleChange}
              className={styles.formControl}
              required
              placeholder="e.g. Galaxy S23"
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="displaySize">Display Size (inches)</label>
            <input
              type="number"
              id="displaySize"
              name="displaySize"
              min="4"
              max="10"
              step="0.1"
              value={formData.displaySize}
              onChange={handleChange}
              className={styles.formControl}
              required
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="ram">RAM (GB)</label>
            <input
              type="number"
              id="ram"
              name="ram"
              min="2"
              max="32"
              step="1"
              value={formData.ram}
              onChange={handleChange}
              className={styles.formControl}
              required
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="battery">Battery Capacity (mAh)</label>
            <input
              type="number"
              id="battery"
              name="battery"
              min="1000"
              max="10000"
              step="100"
              value={formData.battery}
              onChange={handleChange}
              className={styles.formControl}
              required
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="storage">Storage (GB)</label>
            <input
              type="number"
              id="storage"
              name="storage"
              min="16"
              max="1024"
              step="16"
              value={formData.storage}
              onChange={handleChange}
              className={styles.formControl}
              required
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="ratings">Number of Ratings</label>
            <input
              type="number"
              id="ratings"
              name="ratings"
              min="0"
              max="100000"
              step="100"
              value={formData.ratings}
              onChange={handleChange}
              className={styles.formControl}
              placeholder="Optional"
            />
          </div>
          
          <div className={styles.formActions}>
            <button 
              type="submit" 
              className={styles.predictButton}
              disabled={isLoading}
            >
              {isLoading ? 'Predicting...' : 'Predict Price'}
            </button>
            <button 
              type="button" 
              onClick={resetForm} 
              className={styles.resetButton}
            >
              Reset
            </button>
          </div>
        </form>
        
        {predictedPrice && (
          <div className={styles.predictionResult}>
            <h2 className={styles.resultTitle}>Estimated Price</h2>
            <div className={styles.priceDisplay}>
              Rs. {predictedPrice.toLocaleString()}
            </div>
            
            {similarPhones.length > 0 && (
              <div className={styles.similarPhones}>
                <h3>Similar Phones in Our Database</h3>
                <div className={styles.phonesGrid}>
                  {similarPhones.map((phone, index) => (
                    <div key={index} className={styles.phoneCard}>
                      <div className={styles.phoneBrand}>{phone.brand}</div>
                      <div className={styles.phoneModel}>{phone.model}</div>
                      <div className={styles.phoneSpecs}>
                        <span>{phone.displaySize}"</span>
                        <span>{phone.ram}GB RAM</span>
                        <span>{phone.storage}GB</span>
                        {phone.ratings && <span>{phone.ratings.toLocaleString()} ratings</span>}
                      </div>
                      <div className={styles.phonePrice}>Rs. {phone.price.toLocaleString()}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SmartphonePricePredictor;