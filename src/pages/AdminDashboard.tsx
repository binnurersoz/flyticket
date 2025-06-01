
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plane, Users, TrendingUp, Plus, Settings, LogOut, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalFlights: 0,
    totalSeats: 0,
    bookedSeats: 0,
    revenue: 0
  });

  useEffect(() => {
    checkAuth();
    fetchFlights();
  }, []);

  const checkAuth = () => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
    }
  };

  const fetchFlights = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/flights');
      if (!response.ok) {
        throw new Error('Uçuşlar yüklenemedi');
      }
      const data = await response.json();
      setFlights(data);
      calculateStats(data);
    } catch (error) {
      toast.error("Uçuşlar yüklenemedi");
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (flightData: Flight[]) => {
    const totalFlights = flightData.length;
    const totalSeats = flightData.reduce((sum, flight) => sum + flight.seats_total, 0);
    const bookedSeats = flightData.reduce((sum, flight) => sum + (flight.seats_total - flight.seats_available), 0);
    const revenue = flightData.reduce((sum, flight) => sum + (flight.price * (flight.seats_total - flight.seats_available)), 0);

    setStats({
      totalFlights,
      totalSeats,
      bookedSeats,
      revenue
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    toast.success("Başarıyla çıkış yapıldı");
    navigate('/admin/login');
  };

  const deleteFlight = async (flightId: string) => {
    if (!window.confirm('Bu uçuşu silmek istediğinizden emin misiniz?')) {
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`http://localhost:3001/api/flights/${flightId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Uçuş silinemedi');
      }

      toast.success("Uçuş başarıyla silindi");
      fetchFlights(); // Refresh the list
    } catch (error) {
      toast.error("Uçuş silinirken hata oluştu");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Plane className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-800">FlyTicket Admin</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => navigate('/admin/flights/new')}
                className="bg-green-600 hover:bg-green-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Yeni Uçuş
              </Button>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="text-red-600 border-red-300 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Çıkış
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Toplam Uçuş</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.totalFlights}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Toplam Koltuk</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.totalSeats}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Satılan Bilet</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{stats.bookedSeats}</div>
              <div className="text-sm text-gray-500">
                %{stats.totalSeats > 0 ? Math.round((stats.bookedSeats / stats.totalSeats) * 100) : 0} doluluk
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Toplam Gelir</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{stats.revenue.toLocaleString()} ₺</div>
            </CardContent>
          </Card>
        </div>

        {/* Flights Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Uçuş Yönetimi</span>
              <Button
                onClick={() => navigate('/admin/flights/new')}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-1" />
                Ekle
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {flights.length === 0 ? (
              <div className="text-center py-8">
                <Plane className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Henüz uçuş bulunmuyor</p>
                <Button
                  onClick={() => navigate('/admin/flights/new')}
                  className="mt-4"
                >
                  İlk Uçuşu Ekle
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Uçuş ID</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Güzergah</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Tarih/Saat</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Fiyat</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Koltuk</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">İşlemler</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {flights.map((flight) => (
                      <tr key={flight.flight_id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-mono text-gray-600">
                          {flight.flight_id.substring(0, 8)}...
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <div className="font-medium">
                            {flight.from_city} → {flight.to_city}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <div>
                            {new Date(flight.departure_time).toLocaleDateString('tr-TR')}
                          </div>
                          <div className="text-gray-500">
                            {new Date(flight.departure_time).toLocaleTimeString('tr-TR', { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm font-semibold text-blue-600">
                          {flight.price} ₺
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <div className="flex items-center">
                            <span className="text-green-600 font-medium">{flight.seats_available}</span>
                            <span className="text-gray-400 mx-1">/</span>
                            <span className="text-gray-600">{flight.seats_total}</span>
                          </div>
                          <div className="text-xs text-gray-500">
                            %{Math.round(((flight.seats_total - flight.seats_available) / flight.seats_total) * 100)} dolu
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <div className="flex space-x-2">
                            <Button
                              onClick={() => navigate(`/flight/${flight.flight_id}`)}
                              size="sm"
                              variant="outline"
                              className="h-8 w-8 p-0"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              onClick={() => navigate(`/admin/flights/edit/${flight.flight_id}`)}
                              size="sm"
                              variant="outline"
                              className="h-8 w-8 p-0"
                            >
                              <Settings className="h-4 w-4" />
                            </Button>
                            <Button
                              onClick={() => deleteFlight(flight.flight_id)}
                              size="sm"
                              variant="outline"
                              className="h-8 w-8 p-0 text-red-600 hover:bg-red-50"
                            >
                              ×
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
