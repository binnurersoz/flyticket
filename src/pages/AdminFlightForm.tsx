
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Plane, MapPin, Calendar, Clock, DollarSign, Users, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  seats_total: number;
  seats_available: number;
}

const AdminFlightForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;
  
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    from_city: "",
    to_city: "",
    departure_time: "",
    arrival_time: "",
    price: "",
    seats_total: ""
  });

  useEffect(() => {
    checkAuth();
    fetchCities();
    if (isEdit) {
      fetchFlightDetails();
    }
  }, [id]);

  const checkAuth = () => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
    }
  };

  const fetchCities = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/cities');
      if (!response.ok) {
        throw new Error('Şehirler yüklenemedi');
      }
      const data = await response.json();
      setCities(data);
    } catch (error) {
      toast.error("Şehirler yüklenemedi");
    }
  };

  const fetchFlightDetails = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/flights/${id}`);
      if (!response.ok) {
        throw new Error('Uçuş bulunamadı');
      }
      const flight: Flight = await response.json();
      
      // Convert datetime for input fields
      const departureDate = new Date(flight.departure_time);
      const arrivalDate = new Date(flight.arrival_time);
      
      setFormData({
        from_city: flight.from_city,
        to_city: flight.to_city,
        departure_time: departureDate.toISOString().slice(0, 16),
        arrival_time: arrivalDate.toISOString().slice(0, 16),
        price: flight.price.toString(),
        seats_total: flight.seats_total.toString()
      });
    } catch (error) {
      toast.error("Uçuş detayları yüklenemedi");
      navigate('/admin/dashboard');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.from_city || !formData.to_city || !formData.departure_time || 
        !formData.arrival_time || !formData.price || !formData.seats_total) {
      toast.error("Lütfen tüm alanları doldurun");
      return false;
    }

    if (formData.from_city === formData.to_city) {
      toast.error("Kalkış ve varış şehirleri aynı olamaz");
      return false;
    }

    const departureTime = new Date(formData.departure_time);
    const arrivalTime = new Date(formData.arrival_time);

    if (arrivalTime <= departureTime) {
      toast.error("Varış zamanı kalkış zamanından sonra olmalıdır");
      return false;
    }

    if (departureTime < new Date()) {
      toast.error("Kalkış zamanı gelecekte olmalıdır");
      return false;
    }

    if (parseInt(formData.price) <= 0) {
      toast.error("Fiyat 0'dan büyük olmalıdır");
      return false;
    }

    if (parseInt(formData.seats_total) <= 0) {
      toast.error("Koltuk sayısı 0'dan büyük olmalıdır");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('adminToken');
      const url = isEdit 
        ? `http://localhost:3001/api/flights/${id}`
        : 'http://localhost:3001/api/flights';
      
      const method = isEdit ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          from_city: formData.from_city,
          to_city: formData.to_city,
          departure_time: formData.departure_time,
          arrival_time: formData.arrival_time,
          price: parseInt(formData.price),
          seats_total: parseInt(formData.seats_total)
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Uçuş ${isEdit ? 'güncellenemedi' : 'eklenemedi'}`);
      }

      toast.success(`Uçuş başarıyla ${isEdit ? 'güncellendi' : 'eklendi'}!`);
      navigate('/admin/dashboard');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : `Uçuş ${isEdit ? 'güncellenemedi' : 'eklenemedi'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center">
            <Button
              onClick={() => navigate('/admin/dashboard')}
              variant="outline"
              size="sm"
              className="mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Geri
            </Button>
            <Plane className="h-8 w-8 text-blue-600 mr-3" />
            <h1 className="text-2xl font-bold text-gray-800">
              {isEdit ? 'Uçuş Düzenle' : 'Yeni Uçuş Ekle'}
            </h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Plane className="h-6 w-6 mr-2 text-blue-600" />
                Uçuş {isEdit ? 'Düzenle' : 'Ekle'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Route Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-blue-600" />
                      Kalkış Şehri
                    </Label>
                    <Select 
                      value={formData.from_city} 
                      onValueChange={(value) => handleSelectChange('from_city', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Kalkış şehrini seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        {cities.map(city => (
                          <SelectItem key={city.city_id} value={city.city_id}>
                            {city.city_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-orange-600" />
                      Varış Şehri
                    </Label>
                    <Select 
                      value={formData.to_city} 
                      onValueChange={(value) => handleSelectChange('to_city', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Varış şehrini seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        {cities.map(city => (
                          <SelectItem key={city.city_id} value={city.city_id}>
                            {city.city_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Time Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="departure_time" className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-green-600" />
                      Kalkış Zamanı
                    </Label>
                    <Input
                      id="departure_time"
                      name="departure_time"
                      type="datetime-local"
                      value={formData.departure_time}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="arrival_time" className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-red-600" />
                      Varış Zamanı
                    </Label>
                    <Input
                      id="arrival_time"
                      name="arrival_time"
                      type="datetime-local"
                      value={formData.arrival_time}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                {/* Price and Seats */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price" className="flex items-center">
                      <DollarSign className="h-4 w-4 mr-2 text-purple-600" />
                      Fiyat (₺)
                    </Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      min="1"
                      value={formData.price}
                      onChange={handleInputChange}
                      placeholder="Fiyat girin"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="seats_total" className="flex items-center">
                      <Users className="h-4 w-4 mr-2 text-yellow-600" />
                      Toplam Koltuk
                    </Label>
                    <Input
                      id="seats_total"
                      name="seats_total"
                      type="number"
                      min="1"
                      max="500"
                      value={formData.seats_total}
                      onChange={handleInputChange}
                      placeholder="Koltuk sayısı"
                      required
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex gap-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/admin/dashboard')}
                    className="flex-1"
                  >
                    İptal
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                  >
                    {loading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                        {isEdit ? 'Güncelleniyor...' : 'Ekleniyor...'}
                      </div>
                    ) : (
                      isEdit ? 'Uçuşu Güncelle' : 'Uçuş Ekle'
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminFlightForm;
