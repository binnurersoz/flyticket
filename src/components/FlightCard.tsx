
import React from "react";
import { Plane, Users, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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

interface FlightCardProps {
  flight: Flight;
  index: number;
  getCityName: (cityId: string) => string;
  onSelect: (flightId: string) => void;
}

export const FlightCard = ({ flight, index, getCityName, onSelect }: FlightCardProps) => {
  return (
    <Card 
      className="overflow-hidden border-2 border-gray-100 hover:border-blue-300 hover:shadow-xl transition-all duration-300 animate-fade-in cursor-pointer"
      style={{ animationDelay: `${index * 100}ms` }}
      onClick={() => onSelect(flight.flight_id)}
    >
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          {/* Flight Info */}
          <div className="flex-1">
            <div className="flex items-center mb-4">
              <div className="bg-blue-100 rounded-full p-2 mr-3">
                <Plane className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">
                  {getCityName(flight.from_city)} → {getCityName(flight.to_city)}
                </h3>
                <p className="text-sm text-gray-500">Uçuş {flight.flight_id.substring(0, 8)}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Kalkış</p>
                <p className="font-semibold text-gray-800">
                  {new Date(flight.departure_time).toLocaleTimeString('tr-TR', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </p>
                <p className="text-sm text-gray-500">{getCityName(flight.from_city)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Varış</p>
                <p className="font-semibold text-gray-800">
                  {new Date(flight.arrival_time).toLocaleTimeString('tr-TR', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </p>
                <p className="text-sm text-gray-500">{getCityName(flight.to_city)}</p>
              </div>
            </div>
          </div>

          {/* Flight Details */}
          <div className="lg:text-center">
            <div className="flex items-center justify-center mb-2">
              <Users className="h-4 w-4 text-gray-500 mr-1" />
              <span className="text-sm text-gray-500">
                {flight.seats_available} koltuk kaldı
              </span>
            </div>
            {flight.seats_available <= 10 && (
              <div className="flex items-center justify-center mb-3">
                <Star className="h-4 w-4 text-orange-500 mr-1" />
                <span className="text-sm text-orange-600 font-medium">
                  Son koltuklarda!
                </span>
              </div>
            )}
          </div>

          {/* Price and Book */}
          <div className="lg:text-right">
            <div className="mb-4">
              <p className="text-3xl font-bold text-blue-600 mb-1">
                {flight.price} ₺
              </p>
              <p className="text-sm text-gray-500">kişi başı</p>
            </div>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                onSelect(flight.flight_id);
              }}
              size="lg"
              className="w-full lg:w-auto bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Detayları Gör
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
