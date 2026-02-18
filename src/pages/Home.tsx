import { useEffect, useState, useCallback } from "react";
import PetFilters from "../components/pets/PetFilters";
import PetGrid from "../components/pets/PetGrid";
import { getAllPets, type Pet, type PetFilters as PetFiltersType } from "../api/petApi";

function Home() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<PetFiltersType>({
    search: "",
    species: "All",
    breed: "All",
    age: "",
  });

  const fetchPets = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getAllPets(filters);
      setPets(data);
    } catch {
      setError("Failed to load pets. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchPets();
  }, [fetchPets]);

  const handleFilterChange = (newFilters: PetFiltersType) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({ search: "", species: "All", breed: "All", age: "" });
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

        <div className="lg:col-span-1">
          <PetFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onClear={handleClearFilters}
          />
        </div>

        <div className="lg:col-span-3">
          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-20">
              <div className="flex flex-col items-center gap-3">
                <svg
                  className="animate-spin h-10 w-10 text-blue-600"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <p className="text-gray-500 text-sm">Loading pets...</p>
              </div>
            </div>
          )}

          {/* Error State */}
          {!isLoading && error && (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">😿</div>
              <h3 className="text-lg font-semibold text-gray-600">{error}</h3>
              <button
                onClick={fetchPets}
                className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors cursor-pointer"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !error && pets.length === 0 && (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🐾</div>
              <h3 className="text-lg font-semibold text-gray-600">No pets found</h3>
              <p className="text-gray-400 mt-1">Try adjusting your filters or check back later.</p>
            </div>
          )}

          {/* Pet Grid */}
          {!isLoading && !error && pets.length > 0 && (
            <PetGrid pets={pets} />
          )}
        </div>

      </div>
    </div>
  );
}

export default Home;