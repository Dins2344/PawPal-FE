import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import AdoptModal from "../components/pets/AdoptModal";
import { useToast } from "../context/ToastContext";
import { useAuth } from "../context/AuthContext";
import { adoptPet } from "../api/userApi";
import { getPetById, type Pet } from "../api/petApi";
import axios from "axios";

const PetDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [pet, setPet] = useState<Pet | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdoptModalOpen, setIsAdoptModalOpen] = useState(false);
  const [isAdopting, setIsAdopting] = useState(false);
  const toast = useToast();
  const { user } = useAuth();

  useEffect(() => {
    // Try location.state first for instant display
    const statePet = (location.state as any)?.pet;
    if (statePet) {
      setPet(statePet);
      setIsLoading(false);
      return;
    }

    // Otherwise fetch from API
    if (!id) return;
    const fetchPet = async () => {
      setIsLoading(true);
      try {
        const data = await getPetById(id);
        setPet(data);
      } catch {
        setPet(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPet();
  }, [id, location.state]);

  const handleAdoptClick = () => {
    if (!user) {
      toast.warning("Please log in to adopt a pet.");
      navigate("/login");
      return;
    }
    setIsAdoptModalOpen(true);
  };

  const handleConfirmAdoption = async () => {
    const petId = pet?._id || id;
    if (!petId) return;

    setIsAdopting(true);
    try {
      const data = await adoptPet(petId);
      toast.success(data.message || `Adoption for ${pet?.name} confirmed! 🎉`);
      setIsAdoptModalOpen(false);
      navigate("/");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.message || "Adoption failed. Please try again.");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } finally {
      setIsAdopting(false);
    }
  };

  // Loading State
  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-20 flex justify-center">
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
          <p className="text-gray-500 text-sm">Loading pet details...</p>
        </div>
      </div>
    );
  }

  // Not found
  if (!pet) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-20">
        <div className="text-center">
          <div className="text-6xl mb-4">🐾</div>
          <h3 className="text-lg font-semibold text-gray-600">Pet not found</h3>
          <p className="text-gray-400 mt-1">This pet may have been removed or doesn't exist.</p>
          <button
            onClick={() => navigate("/")}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors cursor-pointer"
          >
            Browse Pets
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        <img src={pet.image} alt={pet.name} className="w-full h-72 object-cover" />

        <div className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-semibold">{pet.name}</h2>
              <p className="text-gray-500 mt-1">{pet.breed} • {pet.age} years</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${pet.status === "available" ? "bg-green-100 text-green-700" :
              pet.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                "bg-red-100 text-red-700"
              }`}>
              {pet.status}
            </span>
          </div>

          {pet.species && (
            <p className="mt-3 text-sm text-gray-600">
              <span className="font-medium">Species:</span> {pet.species}
            </p>
          )}
          {pet.gender && (
            <p className="mt-1 text-sm text-gray-600">
              <span className="font-medium">Gender:</span> {pet.gender}
            </p>
          )}
          {pet.description && (
            <p className="mt-4 text-sm text-gray-700 leading-relaxed">{pet.description}</p>
          )}

          <div className="mt-6 flex gap-3">
            <button onClick={() => navigate(-1)} className="px-4 py-2 rounded-lg border hover:bg-gray-50 transition-colors cursor-pointer">Back</button>
            {pet.status === "available" && (
              <button onClick={handleAdoptClick} className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors cursor-pointer">
                Continue to Adopt
              </button>
            )}
          </div>
        </div>
      </div>

      <AdoptModal
        isOpen={isAdoptModalOpen}
        onClose={() => setIsAdoptModalOpen(false)}
        pet={pet}
        onConfirm={handleConfirmAdoption}
        isLoading={isAdopting}
      />
    </div>
  );
};

export default PetDetails;
