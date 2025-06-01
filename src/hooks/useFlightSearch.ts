
import { useState } from "react";
import { toast } from "sonner";

interface Flight {
  flight_id: string;
  from_city: string;
  to_city: string;
  departure_time: string;
  arrival_time: string;
  price: number;
  seats_available: number;
  seats_total: number;
}

export const useFlightSearch = () => {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);

  const searchFlights = async (fromCity: string, toCity: string, date: string) => {
    if (!fromCity || !toCity || !date) {
      toast.error("Lütfen tüm alanları doldurun.");
      return;
    }
    
    if (fromCity === toCity) {
      toast.error("Kalkış ve varış şehirleri aynı olamaz.");
      return;
    }

    setLoading(true);
    setSearchPerformed(true);
    
    try {
      const params = new URLSearchParams({
        from_city: fromCity,
        to_city: toCity,
        date: date
      });

      const response = await fetch(`http://localhost:3001/api/flights?${params}`);
      
      if (!response.ok) {
        throw new Error('Uçuşlar yüklenemedi');
      }

      const data = await response.json();
      setFlights(data);
      
      if (data.length > 0) {
        toast.success(`${data.length} adet uçuş bulundu!`);
      } else {
        toast.info("Belirtilen kriterlere uygun uçuş bulunamadı");
      }
    } catch (error) {
      console.error('Error searching flights:', error);
      toast.error("Uçuş arama sırasında bir hata oluştu");
      setFlights([]);
    } finally {
      setLoading(false);
    }
  };

  return {
    flights,
    loading,
    searchPerformed,
    searchFlights
  };
};
