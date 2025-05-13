'use client';

import React, { useState } from 'react';
import styles from './predictor.module.css';

const SmartphonePricePredictor = () => {
  // Sample data (would normally come from an API or database)
  const phoneData = [
    { brand: 'Infinix', model: 'Zero 40 4G', displaySize: 6.78, ram: 8, battery: 500, storage: 256, price: 70000 },
    { brand: 'Samsung', model: 'Galaxy ZF1', displaySize: 6.7, ram: 12, battery: 4000, storage: 512, price: 385000 },
    { brand: 'Samsung', model: 'Galaxy ZF2', displaySize: 7.6, ram: 12, battery: 4400, storage: 512, price: 605000 },
    { brand: 'Samsung', model: 'Galaxy A0E', displaySize: 6.7, ram: 4, battery: 5000, storage: 64, price: 25000 },
    { brand: 'Tecno', model: 'Phantom V', displaySize: 7.85, ram: 12, battery: 5750, storage: 512, price: 370000 },
    // ... more data from your table
  ];

  // Unique brands for dropdown
  const brands = [...new Set(phoneData.map(item => item.brand))];

  // Form state
  const [formData, setFormData] = useState({
    brand: '',
    displaySize: '',
    ram: '',
    battery: '',
    storage: ''
  });

  // Prediction state
  const [predictedPrice, setPredictedPrice] = useState(null);
  const [similarPhones, setSimilarPhones] = useState([]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Predict price based on inputs
  const predictPrice = (e) => {
    e.preventDefault();
    
    // Simple prediction algorithm (in a real app, this would use ML)
    const { displaySize, ram, battery, storage, brand } = formData;
    
    // Convert to numbers
    const displaySizeNum = parseFloat(displaySize);
    const ramNum = parseInt(ram);
    const batteryNum = parseInt(battery);
    const storageNum = parseInt(storage);
    
    // Filter similar phones
    const similar = phoneData.filter(phone => 
      Math.abs(phone.displaySize - displaySizeNum) <= 0.5 &&
      Math.abs(phone.ram - ramNum) <= 4 &&
      Math.abs(phone.battery - batteryNum) <= 1000 &&
      Math.abs(phone.storage - storageNum) <= 128
    );
    
    // Calculate average price of similar phones
    if (similar.length > 0) {
      const avgPrice = similar.reduce((sum, phone) => sum + phone.price, 0) / similar.length;
      setPredictedPrice(Math.round(avgPrice));
      setSimilarPhones(similar);
    } else {
      // Fallback calculation if no close matches
      const basePrice = 20000;
      const price = basePrice + 
                    (displaySizeNum * 10000) + 
                    (ramNum * 5000) + 
                    (batteryNum * 5) + 
                    (storageNum * 200);
      setPredictedPrice(Math.round(price));
      setSimilarPhones([]);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      brand: '',
      displaySize: '',
      ram: '',
      battery: '',
      storage: ''
    });
    setPredictedPrice(null);
    setSimilarPhones([]);
  };

  return (
    <div className={styles.predictorContainer}>
      <div className={styles.predictorCard}>
        <h1 className={styles.predictorTitle}>Smartphone Price Predictor</h1>
        <p className={styles.predictorSubtitle}>Enter your desired specifications to get an estimated price</p>
        
        <form onSubmit={predictPrice} className={styles.predictorForm}>
          <div className={styles.formGroup}>
            <label htmlFor="brand">Brand</label>
            <select 
              id="brand" 
              name="brand" 
              value={formData.brand}
              onChange={handleChange}
              className={styles.formControl}
            >
              <option value="">Select Brand</option>
              {brands.map(brand => (
                <option key={brand} value={brand}>{brand}</option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
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
          
          <div className="form-group">
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
          
          <div className="form-group">
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
              step={formData.storage}
              value={formData.storage}
              onChange={handleChange}
              className={styles.formControl}
              required
            />
          </div>
          
          <div className={styles.formActions}>
            <button type="submit" className={styles.predictButton}>
              Predict Price
            </button>
            <button type="button" onClick={resetForm} className={styles.resetButton}>
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