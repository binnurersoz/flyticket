
import React, { useEffect, useState } from "react";
import { Plane, MapPin, Calendar, Users, Search, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface City {
  city_id: string;
  city_name: string;
}

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

const Index = () => {
  const navigate = useNavigate();
  const [cities, setCities] = useState<City[]>([]);
  const [fromCity, setFromCity] = useState("");
  const [toCity, setToCity] = useState("");
  const [date, setDate] = useState("");
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);

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
      setCities(data);
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

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
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

  const handleFlightSelect = (flightId: string) => {
    navigate(`/flight/${flightId}`);
  };

  const swapCities = () => {
    const temp = fromCity;
    setFromCity(toCity);
    setToCity(temp);
  };

  const getCityName = (cityId: string) => {
    const city = cities.find(c => c.city_id === cityId);
    return city ? city.city_name : cityId;
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
      {/* Hero Section */}
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
              <form onSubmit={handleSearch} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {/* From City */}
                  <div className="space-y-2">
                    <Label htmlFor="fromCity" className="flex items-center text-gray-700 font-semibold">
                      <MapPin className="h-4 w-4 mr-2 text-blue-600" />
                      Nereden
                    </Label>
                    <Select value={fromCity} onValueChange={setFromCity}>
                      <SelectTrigger className="h-12 border-2 border-gray-200 focus:border-blue-500 transition-colors">
                        <SelectValue placeholder="Şehir seçin" />
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
                      Nereye
                    </Label>
                    <Select value={toCity} onValueChange={setToCity}>
                      <SelectTrigger className="h-12 border-2 border-gray-200 focus:border-blue-500 transition-colors">
                        <SelectValue placeholder="Şehir seçin" />
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
                      Tarih
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
                      Uçuşlar Aranıyor...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <Search className="h-5 w-5 mr-3" />
                      Uçuşları Ara
                    </div>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Results Section */}
      <div className="container mx-auto px-4 py-12">
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-xl text-gray-600">En uygun uçuşları sizin için buluyoruz...</p>
          </div>
        )}

        {!loading && searchPerformed && flights.length === 0 && (
          <div className="text-center py-12">
            <Plane className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Uçuş Bulunamadı</h3>
            <p className="text-gray-500">Seçtiğiniz kriterlere uygun uçuş bulunamadı. Lütfen farklı tarih veya şehir deneyin.</p>
          </div>
        )}

        {!loading && flights.length > 0 && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Uygun Uçuşlar</h2>
              <p className="text-gray-600">{flights.length} adet uçuş bulundu</p>
            </div>

            <div className="grid gap-6 max-w-4xl mx-auto">
              {flights.map((flight, index) => (
                <Card 
                  key={flight.flight_id} 
                  className="overflow-hidden border-2 border-gray-100 hover:border-blue-300 hover:shadow-xl transition-all duration-300 animate-fade-in cursor-pointer"
                  style={{ animationDelay: `${index * 100}ms` }}
                  onClick={() => handleFlightSelect(flight.flight_id)}
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
                            handleFlightSelect(flight.flight_id);
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
              ))}
            </div>
          </div>
        )}

        {!searchPerformed && (
          <div className="text-center py-12">
            <div className="bg-gradient-to-r from-blue-100 to-orange-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
              <Search className="h-12 w-12 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Uçuşunuzu Keşfedin</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Yukarıdaki arama formunu kullanarak Türkiye'nin dört bir yanındaki destinasyonlara uygun uçuşları bulabilirsiniz.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
