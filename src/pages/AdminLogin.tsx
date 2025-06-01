
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, User, Plane } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.username || !formData.password) {
      toast.error("Lütfen tüm alanları doldurun");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:3001/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Giriş başarısız');
      }

      // Store the token
      localStorage.setItem('adminToken', data.token);
      toast.success("Giriş başarılı!");
      navigate("/admin/dashboard");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Giriş başarısız");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center items-center mb-4">
            <div className="bg-blue-600 p-3 rounded-full">
              <Plane className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Admin Girişi</CardTitle>
          <p className="text-gray-600">FlyTicket Yönetici Paneli</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="flex items-center">
                <User className="h-4 w-4 mr-2" />
                Kullanıcı Adı
              </Label>
              <Input
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Kullanıcı adınızı girin"
                required
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="flex items-center">
                <Lock className="h-4 w-4 mr-2" />
                Parola
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Parolanızı girin"
                required
                className="h-12"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                  Giriş Yapılıyor...
                </div>
              ) : (
                "Giriş Yap"
              )}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t text-center">
            <Button
              variant="outline"
              onClick={() => navigate("/")}
              className="w-full"
            >
              Ana Sayfaya Dön
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;
