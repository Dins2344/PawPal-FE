import { useEffect, useState } from "react";
import { getBreeds, type PetFilters as PetFiltersType } from "../../api/petApi";

interface PetFiltersProps {
    filters: PetFiltersType;
    onFilterChange: (filters: PetFiltersType) => void;
    onClear: () => void;
}

function PetFilters({ filters, onFilterChange, onClear }: PetFiltersProps) {
    const [breeds, setBreeds] = useState<string[]>([]);

    useEffect(() => {
        const fetchBreeds = async () => {
            try {
                const data = await getBreeds();
                setBreeds(data);
            } catch (error) {
                console.error("Failed to fetch breeds", error);
            }
        };
        fetchBreeds();
    }, []);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onFilterChange({ ...filters, search: e.target.value });
    };

    const handleSpeciesChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onFilterChange({ ...filters, species: e.target.value, breed: "All" });
    };

    const handleBreedChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value === "All" ? undefined : e.target.value;
        onFilterChange({ ...filters, breed: value });
    };

    const handleAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onFilterChange({ ...filters, age: e.target.value });
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-amber-100/40 space-y-5">
            <div className="flex items-center gap-2">
                <span className="text-lg">🔍</span>
                <h3 className="text-lg font-semibold text-gray-800">Filters</h3>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600">Search</label>
                <input
                    type="text"
                    placeholder="Search by name..."
                    value={filters.search || ""}
                    onChange={handleSearchChange}
                    className="w-full px-4 py-2.5 bg-amber-50/50 border border-amber-200/50 rounded-xl focus:ring-2 focus:ring-amber-500/30 focus:border-amber-400 outline-none transition-all placeholder-gray-400"
                />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600">Species</label>
                <select
                    value={filters.species || "All"}
                    onChange={handleSpeciesChange}
                    className="w-full px-4 py-2.5 bg-amber-50/50 border border-amber-200/50 rounded-xl focus:ring-2 focus:ring-amber-500/30 focus:border-amber-400 outline-none cursor-pointer appearance-none transition-all"
                >
                    <option value="All">All Species</option>
                    <option value="Dog">🐶 Dog</option>
                    <option value="Cat">🐱 Cat</option>
                    <option value="Bird">🐦 Bird</option>
                    <option value="Rabbit">🐰 Rabbit</option>
                    <option value="Fish">🐟 Fish</option>
                    <option value="Other">🐾 Other</option>
                </select>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600">Breed</label>
                <select
                    value={filters.breed || "All"}
                    onChange={handleBreedChange}
                    className="w-full px-4 py-2.5 bg-amber-50/50 border border-amber-200/50 rounded-xl focus:ring-2 focus:ring-amber-500/30 focus:border-amber-400 outline-none cursor-pointer appearance-none transition-all disabled:opacity-50"
                    disabled={breeds.length === 0}
                >
                    <option value="All">All Breeds</option>
                    {breeds.map((breed) => (
                        <option key={breed} value={breed}>
                            {breed}
                        </option>
                    ))}
                </select>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600">Age</label>
                <input
                    type="number"
                    min="0"
                    placeholder="e.g. 2"
                    value={filters.age || ""}
                    onChange={handleAgeChange}
                    className="w-full px-4 py-2.5 bg-amber-50/50 border border-amber-200/50 rounded-xl focus:ring-2 focus:ring-amber-500/30 focus:border-amber-400 outline-none transition-all placeholder-gray-400"
                />
            </div>

            <button
                onClick={onClear}
                className="w-full mt-2 py-2.5 bg-amber-50 text-amber-700 font-medium rounded-xl hover:bg-amber-100 transition-colors cursor-pointer border border-amber-200/50"
            >
                Clear Filters
            </button>
        </div>
    );
}

export default PetFilters;