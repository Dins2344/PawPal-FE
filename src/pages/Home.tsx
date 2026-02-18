import { useEffect, useState, useCallback } from "react";
import PetFilters from "../components/pets/PetFilters";
import PetGrid from "../components/pets/PetGrid";
import Pagination from "../components/ui/Pagination";
import { getAllPets, type Pet, type PetFilters as PetFiltersType } from "../api/petApi";

const ITEMS_PER_PAGE = 12;

function Home() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
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

  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  const handleFilterChange = (newFilters: PetFiltersType) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({ search: "", species: "All", breed: "All", age: "" });
  };

  const totalPages = Math.ceil(pets.length / ITEMS_PER_PAGE);
  const paginatedPets = pets.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

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
                <svg className="animate-spin h-10 w-10 text-amber-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
                className="mt-4 px-6 py-2 bg-linear-to-r from-amber-500 to-orange-500 text-white rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all cursor-pointer font-semibold shadow-md shadow-amber-500/20"
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

          {/* Pet Grid + Pagination */}
          {!isLoading && !error && pets.length > 0 && (
            <>
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-gray-500">
                  Showing <span className="font-medium text-amber-700">{(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, pets.length)}</span> of {pets.length} pets
                </p>
              </div>
              <PetGrid pets={paginatedPets} />
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </>
          )}
        </div>

      </div>
    </div>
  );
}

export default Home;