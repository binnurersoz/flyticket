
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
FLYTICKET - UÇAK BİLETİ
========================

Bilet ID: ${ticketInfo.ticketId}
Yolcu: ${ticketInfo.passengerInfo.passenger_name} ${ticketInfo.passengerInfo.passenger_surname}
E-posta: ${ticketInfo.passengerInfo.passenger_email}

UÇUŞ BİLGİLERİ
--------------
Güzergah: ${ticketInfo.flight.from_city} → ${ticketInfo.flight.to_city}
Kalkış: ${new Date(ticketInfo.flight.departure_time).toLocaleString('tr-TR')}
Varış: ${new Date(ticketInfo.flight.arrival_time).toLocaleString('tr-TR')}
Fiyat: ${ticketInfo.flight.price} ₺
${ticketInfo.passengerInfo.seat_number ? `Koltuk: ${ticketInfo.passengerInfo.seat_number}` : 'Koltuk: Otomatik atanacak'}

Bu bileti uçuş günü yanınızda bulundurunuz.
FlyTicket'i tercih ettiğiniz için teşekkür ederiz!
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
                Rezervasyon Başarılı!
              </h1>
              <p className="text-green-700 mb-4">
                Biletiniz başarıyla oluşturuldu. Rezervasyon detaylarını aşağıda görebilirsiniz.
              </p>
              <div className="bg-white p-4 rounded-lg inline-block">
                <p className="text-sm text-gray-600 mb-1">Bilet Numaranız</p>
                <p className="text-xl font-bold text-blue-600">{ticketInfo.ticketId}</p>
              </div>
            </CardContent>
          </Card>

          {/* Ticket Details */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Ticket className="h-6 w-6 mr-2 text-blue-600" />
                Bilet Detayları
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Flight Info */}
              <div>
                <h3 className="font-semibold text-lg mb-3 flex items-center">
                  <Plane className="h-5 w-5 mr-2 text-blue-600" />
                  Uçuş Bilgileri
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center">
                      <MapPin className="h-5 w-5 text-blue-600 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Kalkış</p>
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
                      <p className="text-sm text-gray-600">Varış</p>
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
                    <p className="text-sm text-gray-600">Toplam Ücret</p>
                    <p className="text-2xl font-bold text-blue-600">{ticketInfo.flight.price} ₺</p>
                  </div>
                </div>
              </div>

              {/* Passenger Info */}
              <div>
                <h3 className="font-semibold text-lg mb-3 flex items-center">
                  <User className="h-5 w-5 mr-2 text-green-600" />
                  Yolcu Bilgileri
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Ad Soyad:</span>
                    <span className="font-semibold">
                      {ticketInfo.passengerInfo.passenger_name} {ticketInfo.passengerInfo.passenger_surname}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">E-posta:</span>
                    <span className="font-semibold">{ticketInfo.passengerInfo.passenger_email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Koltuk:</span>
                    <span className="font-semibold">
                      {ticketInfo.passengerInfo.seat_number || "Otomatik atanacak"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Important Notes */}
              <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                <h4 className="font-semibold text-yellow-800 mb-2">Önemli Notlar</h4>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• Uçuş günü en az 2 saat öncesinde havalimanında bulununuz</li>
                  <li>• Yanınızda geçerli kimlik belgenizi bulundurunuz</li>
                  <li>• Bilet numaranızı kaydediniz ve uçuş günü yanınızda bulundurunuz</li>
                  <li>• Check-in işlemlerini uçuştan 24 saat önce yapabilirsiniz</li>
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
              Bileti İndir
            </Button>
            <Button
              onClick={() => navigate("/")}
              variant="outline"
              className="h-12"
            >
              <Home className="h-5 w-5 mr-2" />
              Ana Sayfaya Dön
            </Button>
          </div>

          {/* Support Info */}
          <Card className="mt-6 bg-blue-50 border-blue-200">
            <CardContent className="p-6 text-center">
              <h4 className="font-semibold text-blue-800 mb-2">Destek</h4>
              <p className="text-blue-700 text-sm mb-3">
                Herhangi bir sorunuz olursa bizimle iletişime geçebilirsiniz.
              </p>
              <div className="flex justify-center space-x-4 text-sm">
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-1 text-blue-600" />
                  <span>destek@flyticket.com</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1 text-blue-600" />
                  <span>7/24 Destek</span>
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
