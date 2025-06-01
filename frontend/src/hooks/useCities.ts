
import { useState, useEffect } from "react";

interface City {
  city_id: string;
  city_name: string;
}

export const useCities = () => {
  const [cities, setCities] = useState<City[]>([]);

  useEffect(() => {
    fetchCities();
  }, []);

  const fetchCities = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/cities');
      if (!response.ok) {
        throw new Error('Şehirler yüklenemedi');
      }
      const data = await response.json();
      
      const citiesWithStringIds = data.map((city: any) => ({
        ...city,
        city_id: city.city_id.toString()
      }));
      setCities(citiesWithStringIds);
    } catch (error) {
      console.error('Error fetching cities:', error);
      // Fallback to mock data if API fails
      const mockCities = [
        { city_id: "1", city_name: "İstanbul" },
        { city_id: "2", city_name: "Ankara" },
        { city_id: "3", city_name: "İzmir" },
        { city_id: "4", city_name: "Adana" },
        { city_id: "5", city_name: "Antalya" },
        { city_id: "6", city_name: "Trabzon" },
        { city_id: "7", city_name: "Eskişehir" },
        { city_id: "8", city_name: "Kayseri" }
      ];
      setCities(mockCities);
    }
  };

  const getCityName = (cityId: string) => {
    const city = cities.find(c => c.city_id === cityId);
    return city ? city.city_name : cityId;
  };

  return { cities, getCityName };
};
