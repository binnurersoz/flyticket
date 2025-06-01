
import React from "react";
import { Plane } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SearchForm } from "./SearchForm";

interface City {
  city_id: string;
  city_name: string;
}

interface HeroSectionProps {
  cities: City[];
  onSearch: (fromCity: string, toCity: string, date: string) => void;
  loading: boolean;
}

export const HeroSection = ({ cities, onSearch, loading }: HeroSectionProps) => {
  const navigate = useNavigate();

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800">
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="relative container mx-auto px-4 py-16">
        <div className="text-center text-white mb-12">
          <div className="flex justify-center items-center mb-6">
            <Plane className="h-12 w-12 text-orange-400 mr-3" />
            <h1 className="text-5xl font-bold">FlyTicket</h1>
          </div>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Türkiye'nin her köşesine güvenli ve konforlu uçuşlar. Hayalinizdeki destinasyona bir tık uzaktasınız.
          </p>
          <div className="mt-6">
            <Button
              onClick={() => navigate('/admin/login')}
              variant="outline"
              className="bg-white/10 border-white/30 text-white hover:bg-white/20"
            >
              Admin Girişi
            </Button>
          </div>
        </div>

        {/* Search Form */}
        <Card className="max-w-4xl mx-auto bg-white/95 backdrop-blur-sm shadow-2xl border-0">
          <CardContent className="p-8">
            <SearchForm cities={cities} onSearch={onSearch} loading={loading} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
