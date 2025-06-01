
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
      toast.error("Please fill in all fields.");
      return;
    }
    
    if (fromCity === toCity) {
      toast.error("Departure and arrival cities cannot be the same.");
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
        throw new Error('Failed to load flights');
      }

      const data = await response.json();
      setFlights(data);
      
      if (data.length > 0) {
        toast.success(`${data.length} flights found!`);
      } else {
        toast.info("No flights found matching your criteria.");
      }
    } catch (error) {
      console.error('Error searching flights:', error);
      toast.error("An error occurred while searching for flights.");
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
