
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { CheckCircle, Plane, MapPin, Clock, User, Mail, Ticket, Download, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TicketInfo {
  ticketId: string;
  flight: any;
  passengerInfo: any;
}

const BookingConfirmation = () => {
  const { ticketId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [ticketInfo, setTicketInfo] = useState<TicketInfo | null>(null);

  useEffect(() => {
    if (location.state) {
      setTicketInfo(location.state as TicketInfo);
    } else {
      // If no state, redirect to home
      navigate("/");
    }
  }, [location.state, navigate]);

  const handleDownloadTicket = () => {
    // Create a simple text ticket
    if (!ticketInfo) return;

    const ticketText = `
FLYTICKET - AIRPLANE TICKET
===========================

Ticket ID: ${ticketInfo.ticketId}
Passenger: ${ticketInfo.passengerInfo.passenger_name} ${ticketInfo.passengerInfo.passenger_surname}
Email: ${ticketInfo.passengerInfo.passenger_email}

FLIGHT INFORMATION
------------------
Route: ${ticketInfo.flight.from_city} → ${ticketInfo.flight.to_city}
Departure: ${new Date(ticketInfo.flight.departure_time).toLocaleString('en-US')}
Arrival: ${new Date(ticketInfo.flight.arrival_time).toLocaleString('en-US')}
Price: ${ticketInfo.flight.price} ₺
${ticketInfo.passengerInfo.seat_number ? `Seat: ${ticketInfo.passengerInfo.seat_number}` : 'Seat: Will be assigned automatically'}

Please keep this ticket with you on the day of the flight.
Thank you for choosing FlyTicket!
`;

    const blob = new Blob([ticketText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `bilet-${ticketInfo.ticketId}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (!ticketInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const departureTime = new Date(ticketInfo.flight.departure_time);
  const arrivalTime = new Date(ticketInfo.flight.arrival_time);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Success Header */}
          <Card className="mb-8 border-green-200 bg-green-50">
            <CardContent className="p-8 text-center">
              <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-green-800 mb-2">
                Booking Successful!
              </h1>
              <p className="text-green-700 mb-4">
                Your ticket has been successfully created. You can see your booking details below.
              </p>
              <div className="bg-white p-4 rounded-lg inline-block">
                <p className="text-sm text-gray-600 mb-1">Your Ticket Number</p>
                <p className="text-xl font-bold text-blue-600">{ticketInfo.ticketId}</p>
              </div>
            </CardContent>
          </Card>

          {/* Ticket Details */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Ticket className="h-6 w-6 mr-2 text-blue-600" />
                Ticket Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Flight Info */}
              <div>
                <h3 className="font-semibold text-lg mb-3 flex items-center">
                  <Plane className="h-5 w-5 mr-2 text-blue-600" />
                  Flight Information
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center">
                      <MapPin className="h-5 w-5 text-blue-600 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Departure</p>
                      <p className="font-semibold">{ticketInfo.flight.from_city}</p>
                      <p className="text-lg font-bold text-blue-600">
                        {departureTime.toLocaleTimeString('tr-TR', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                      <p className="text-sm text-gray-500">
                        {departureTime.toLocaleDateString('tr-TR')}
                      </p>
                    </div>
                    <div className="text-center">
                      <MapPin className="h-5 w-5 text-orange-600 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Arrival</p>
                      <p className="font-semibold">{ticketInfo.flight.to_city}</p>
                      <p className="text-lg font-bold text-orange-600">
                        {arrivalTime.toLocaleTimeString('tr-TR', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                      <p className="text-sm text-gray-500">
                        {arrivalTime.toLocaleDateString('tr-TR')}
                      </p>
                    </div>
                  </div>
                  <div className="text-center pt-3 border-t">
                    <p className="text-sm text-gray-600">Total Price</p>
                    <p className="text-2xl font-bold text-blue-600">{ticketInfo.flight.price} ₺</p>
                  </div>
                </div>
              </div>

              {/* Passenger Info */}
              <div>
                <h3 className="font-semibold text-lg mb-3 flex items-center">
                  <User className="h-5 w-5 mr-2 text-green-600" />
                  Passenger Information
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Name:</span>
                    <span className="font-semibold">
                      {ticketInfo.passengerInfo.passenger_name} {ticketInfo.passengerInfo.passenger_surname}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span className="font-semibold">{ticketInfo.passengerInfo.passenger_email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Seat:</span>
                    <span className="font-semibold">
                      {ticketInfo.passengerInfo.seat_number || "Will be assigned automatically"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Important Notes */}
              <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                <h4 className="font-semibold text-yellow-800 mb-2">Important Notes</h4>
                <ul className="text-sm text-yellow-700 space-y-1">
                   <li>• Please arrive at the airport at least 2 hours before your flight</li>
                  <li>• Carry a valid ID with you</li>
                  <li>• Save your ticket number and keep it with you on the flight day</li>
                  <li>• Check-in can be done 24 hours before the flight</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              onClick={handleDownloadTicket}
              className="h-12 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
            >
              <Download className="h-5 w-5 mr-2" />
              Download Ticket
            </Button>
            <Button
              onClick={() => navigate("/")}
              variant="outline"
              className="h-12"
            >
              <Home className="h-5 w-5 mr-2" />
              Back to Home
            </Button>
          </div>

          {/* Support Info */}
          <Card className="mt-6 bg-blue-50 border-blue-200">
            <CardContent className="p-6 text-center">
              <h4 className="font-semibold text-blue-800 mb-2">Support</h4>
              <p className="text-blue-700 text-sm mb-3">
                If you have any questions, feel free to contact us.
              </p>
              <div className="flex justify-center space-x-4 text-sm">
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-1 text-blue-600" />
                  <span>support@flyticket.com</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1 text-blue-600" />
                  <span>24/7 Support</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;
