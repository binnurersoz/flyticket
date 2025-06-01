
import React from "react";
import { Plane, Search } from "lucide-react";

export const LoadingState = () => (
  <div className="text-center py-12">
    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
    <p className="text-xl text-gray-600">En uygun uçuşları sizin için buluyoruz...</p>
  </div>
);

export const NoResultsState = () => (
  <div className="text-center py-12">
    <Plane className="h-16 w-16 text-gray-400 mx-auto mb-4" />
    <h3 className="text-xl font-semibold text-gray-700 mb-2">Uçuş Bulunamadı</h3>
    <p className="text-gray-500">Seçtiğiniz kriterlere uygun uçuş bulunamadı. Lütfen farklı tarih veya şehir deneyin.</p>
  </div>
);

export const InitialState = () => (
  <div className="text-center py-12">
    <div className="bg-gradient-to-r from-blue-100 to-orange-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
      <Search className="h-12 w-12 text-blue-600" />
    </div>
    <h3 className="text-2xl font-bold text-gray-800 mb-4">Uçuşunuzu Keşfedin</h3>
    <p className="text-gray-600 max-w-md mx-auto">
      Yukarıdaki arama formunu kullanarak Türkiye'nin dört bir yanındaki destinasyonlara uygun uçuşları bulabilirsiniz.
    </p>
  </div>
);
