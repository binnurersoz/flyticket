
import React, { useState } from "react";
import { MapPin, Calendar, Plane, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface City {
  city_id: string;
  city_name: string;
}

interface SearchFormProps {
  cities: City[];
  onSearch: (fromCity: string, toCity: string, date: string) => void;
  loading: boolean;
}

export const SearchForm = ({ cities, onSearch, loading }: SearchFormProps) => {
  const [fromCity, setFromCity] = useState("");
  const [toCity, setToCity] = useState("");
  const [date, setDate] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(fromCity, toCity, date);
  };

  const swapCities = () => {
    const temp = fromCity;
    setFromCity(toCity);
    setToCity(temp);
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* From City */}
        <div className="space-y-2">
          <Label htmlFor="fromCity" className="flex items-center text-gray-700 font-semibold">
            <MapPin className="h-4 w-4 mr-2 text-blue-600" />
            From
          </Label>
          <Select value={fromCity} onValueChange={setFromCity}>
            <SelectTrigger className="h-12 border-2 border-gray-200 focus:border-blue-500 transition-colors">
              <SelectValue placeholder="Select City" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              {cities.map(city => (
                <SelectItem key={city.city_id} value={city.city_id}>
                  {city.city_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Swap Button */}
        <div className="flex items-end">
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={swapCities}
            className="h-12 w-full border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all duration-200"
          >
            <Plane className="h-4 w-4 rotate-90" />
          </Button>
        </div>

        {/* To City */}
        <div className="space-y-2">
          <Label htmlFor="toCity" className="flex items-center text-gray-700 font-semibold">
            <MapPin className="h-4 w-4 mr-2 text-orange-600" />
            To
          </Label>
          <Select value={toCity} onValueChange={setToCity}>
            <SelectTrigger className="h-12 border-2 border-gray-200 focus:border-blue-500 transition-colors">
              <SelectValue placeholder="Select City" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              {cities.map(city => (
                <SelectItem key={city.city_id} value={city.city_id}>
                  {city.city_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Date */}
        <div className="space-y-2">
          <Label htmlFor="date" className="flex items-center text-gray-700 font-semibold">
            <Calendar className="h-4 w-4 mr-2 text-green-600" />
            Date
          </Label>
          <Input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            min={today}
            className="h-12 border-2 border-gray-200 focus:border-blue-500 transition-colors"
          />
        </div>
      </div>

      <Button
        type="submit"
        size="lg"
        disabled={loading}
        className="w-full h-14 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200"
      >
        {loading ? (
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
            Searching for Flights...
          </div>
        ) : (
          <div className="flex items-center">
            <Search className="h-5 w-5 mr-3" />
            Search Flights
          </div>
        )}
      </Button>
    </form>
  );
};
