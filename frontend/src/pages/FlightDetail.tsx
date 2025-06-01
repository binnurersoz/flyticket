import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Plane, MapPin, Clock, Users, CreditCard, User, Mail, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

const FlightDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [flight, setFlight] = useState<Flight | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [formData, setFormData] = useState({
    passenger_name: "",
    passenger_surname: "",
    passenger_email: "",
    seat_number: ""
  });

  useEffect(() => {
    fetchFlightDetails();
  }, [id]);

  const fetchFlightDetails = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/flights/${id}`);
      if (!response.ok) {
        throw new Error('Flight not found');
      }
      const data = await response.json();
      setFlight(data);
    } catch (error) {
      toast.error("Failed to load flight details");
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.passenger_name || !formData.passenger_surname || !formData.passenger_email) {
      toast.error("Please fill in all required fields");
      return;
    }

    setBookingLoading(true);

    try {
      const response = await fetch('http://localhost:3001/api/tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          flight_id: flight?.flight_id
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Booking failed');
      }

      toast.success("Booking completed successfully!");
      navigate(`/booking-confirmation/${data.ticket_id}`, {
        state: { 
          ticketId: data.ticket_id, 
          flight,
          passengerInfo: formData 
        }
      });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Booking failed");
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!flight) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-8 text-center">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Flight Not Found</h2>
            <p className="text-gray-600 mb-4">The flight you requested could not be found.</p>
            <Button onClick={() => navigate("/")} className="w-full">
              Return to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const departureTime = new Date(flight.departure_time);
  const arrivalTime = new Date(flight.arrival_time);
  const duration = Math.round((arrivalTime.getTime() - departureTime.getTime()) / (1000 * 60));
  const hours = Math.floor(duration / 60);
  const minutes = duration % 60;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50">
      <div className="container mx-auto px-4 py-8">
        <Button 
          variant="outline" 
          onClick={() => navigate("/")}
          className="mb-6"
        >
          ← Back to Home
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Flight Details */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Plane className="h-6 w-6 mr-2 text-blue-600" />
                Flight Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  {flight.from_city} → {flight.to_city}
                </h2>
                <p className="text-gray-600">Flight {flight.flight_id}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <MapPin className="h-5 w-5 text-blue-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Departure</p>
                  <p className="font-semibold">{flight.from_city}</p>
                  <p className="text-lg font-bold text-blue-600">
                    {departureTime.toLocaleTimeString('en-US', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </p>
                  <p className="text-sm text-gray-500">
                    {departureTime.toLocaleDateString('en-US')}
                  </p>
                </div>

                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <MapPin className="h-5 w-5 text-orange-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Arrival</p>
                  <p className="font-semibold">{flight.to_city}</p>
                  <p className="text-lg font-bold text-orange-600">
                    {arrivalTime.toLocaleTimeString('en-US', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </p>
                  <p className="text-sm text-gray-500">
                    {arrivalTime.toLocaleDateString('en-US')}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-gray-500 mr-2" />
                  <div>
                    <p className="text-sm text-gray-600">Flight Duration</p>
                    <p className="font-semibold">{hours}h {minutes}m</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Users className="h-5 w-5 text-gray-500 mr-2" />
                  <div>
                    <p className="text-sm text-gray-600">Seats Available</p>
                    <p className="font-semibold">{flight.seats_available}/{flight.seats_total}</p>
                  </div>
                </div>
              </div>

              <div className="text-center pt-4 border-t">
                <p className="text-3xl font-bold text-blue-600 mb-2">
                  {flight.price} ₺
                </p>
                <p className="text-gray-600">per person</p>
              </div>
            </CardContent>
          </Card>

          {/* Booking Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="h-6 w-6 mr-2 text-green-600" />
                Booking Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleBooking} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="passenger_name" className="flex items-center">
                      <User className="h-4 w-4 mr-2" />
                      First Name *
                    </Label>
                    <Input
                      id="passenger_name"
                      name="passenger_name"
                      value={formData.passenger_name}
                      onChange={handleInputChange}
                      placeholder="Your first name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="passenger_surname" className="flex items-center">
                      <User className="h-4 w-4 mr-2" />
                      Last Name *
                    </Label>
                    <Input
                      id="passenger_surname"
                      name="passenger_surname"
                      value={formData.passenger_surname}
                      onChange={handleInputChange}
                      placeholder="Your last name"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="passenger_email" className="flex items-center">
                    <Mail className="h-4 w-4 mr-2" />
                    Email *
                  </Label>
                  <Input
                    id="passenger_email"
                    name="passenger_email"
                    type="email"
                    value={formData.passenger_email}
                    onChange={handleInputChange}
                    placeholder="example@email.com"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="seat_number" className="flex items-center">
                    <Users className="h-4 w-4 mr-2" />
                    Seat Number (Optional)
                  </Label>
                  <Input
                    id="seat_number"
                    name="seat_number"
                    value={formData.seat_number}
                    onChange={handleInputChange}
                    placeholder="e.g., 12A"
                  />
                  <p className="text-sm text-gray-500">
                    Leave blank to auto-assign
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Booking Summary</h4>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Flight:</span>
                    <span>{flight.from_city} → {flight.to_city}</span>
                  </div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Date:</span>
                    <span>{departureTime.toLocaleDateString('en-US')}</span>
                  </div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Time:</span>
                    <span>{departureTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-lg pt-2 border-t">
                    <span>Total:</span>
                    <span className="text-blue-600">{flight.price} ₺</span>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={bookingLoading}
                >
                  {bookingLoading ? "Booking..." : "Book Flight"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FlightDetail;
