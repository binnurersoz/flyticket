
import React from "react";
import { HeroSection } from "@/components/HeroSection";
import { FlightResults } from "@/components/FlightResults";
import { LoadingState, NoResultsState, InitialState } from "@/components/EmptyStates";
import { useCities } from "@/hooks/useCities";
import { useFlightSearch } from "@/hooks/useFlightSearch";

const Index = () => {
  const { cities, getCityName } = useCities();
  const { flights, loading, searchPerformed, searchFlights } = useFlightSearch();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
      <HeroSection cities={cities} onSearch={searchFlights} loading={loading} />

      <div className="container mx-auto px-4 py-12">
        {loading && <LoadingState />}

        {!loading && searchPerformed && flights.length === 0 && <NoResultsState />}

        {!loading && flights.length > 0 && (
          <FlightResults flights={flights} getCityName={getCityName} />
        )}

        {!searchPerformed && <InitialState />}
      </div>
    </div>
  );
};

export default Index;
