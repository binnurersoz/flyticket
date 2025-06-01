
import React from "react";
import { useNavigate } from "react-router-dom";
import { FlightCard } from "./FlightCard";

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

interface FlightResultsProps {
  flights: Flight[];
  getCityName: (cityId: string) => string;
}

export const FlightResults = ({ flights, getCityName }: FlightResultsProps) => {
  const navigate = useNavigate();

  const handleFlightSelect = (flightId: string) => {
    navigate(`/flight/${flightId}`);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Uygun Uçuşlar</h2>
        <p className="text-gray-600">{flights.length} adet uçuş bulundu</p>
      </div>

      <div className="grid gap-6 max-w-4xl mx-auto">
        {flights.map((flight, index) => (
          <FlightCard
            key={flight.flight_id}
            flight={flight}
            index={index}
            getCityName={getCityName}
            onSelect={handleFlightSelect}
          />
        ))}
      </div>
    </div>
  );
};
