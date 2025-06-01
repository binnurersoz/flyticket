
import React from "react";
import { Plane, Search } from "lucide-react";

export const LoadingState = () => (
  <div className="text-center py-12">
    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
    <p className="text-xl text-gray-600">Finding the best flights for you...</p>
  </div>
);

export const NoResultsState = () => (
  <div className="text-center py-12">
    <Plane className="h-16 w-16 text-gray-400 mx-auto mb-4" />
    <h3 className="text-xl font-semibold text-gray-700 mb-2">No Flights Found</h3>
    <p className="text-gray-500">No flights matched your search criteria. Try adjusting your dates or destinations.</p>
  </div>
);

export const InitialState = () => (
  <div className="text-center py-12">
    <div className="bg-gradient-to-r from-blue-100 to-orange-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
      <Search className="h-12 w-12 text-blue-600" />
    </div>
    <h3 className="text-2xl font-bold text-gray-800 mb-4">Discover Your Flight</h3>
    <p className="text-gray-600 max-w-md mx-auto">
      Use the search form above to explore the best flight options across destinations in Türkiye.
    </p>
  </div>
);
