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
    const statePet = (location.state as any)?.pet;
    if (statePet) {
      setPet(statePet);
      setIsLoading(false);
      return;
    }

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
          <svg className="animate-spin h-10 w-10 text-amber-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
            className="mt-4 px-6 py-2 bg-linear-to-r from-amber-500 to-orange-500 text-white rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all cursor-pointer font-semibold shadow-md shadow-amber-500/20"
          >
            Browse Pets
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <div className="bg-white rounded-2xl shadow-lg shadow-amber-100/30 overflow-hidden border border-amber-100/30">
        <div className="relative">
          <img src={pet.image} alt={pet.name} className="w-full h-80 object-cover" />
          <div className="absolute inset-0 bg-linear-to-t from-black/30 to-transparent" />
        </div>

        <div className="p-8">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-800">{pet.name}</h2>
              <p className="text-gray-500 mt-1 text-lg">{pet.breed} • {pet.age} years</p>
            </div>
            <span className={`px-4 py-1.5 rounded-full text-xs font-semibold capitalize ${pet.status === "available" ? "bg-emerald-100 text-emerald-700" :
              pet.status === "pending" ? "bg-amber-100 text-amber-700" :
                "bg-rose-100 text-rose-700"
              }`}>
              {pet.status}
            </span>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
            {pet.species && (
              <div className="bg-amber-50/50 rounded-xl p-4 border border-amber-100/30">
                <p className="text-xs text-gray-500 font-medium mb-1">Species</p>
                <p className="text-sm font-semibold text-gray-800">{pet.species}</p>
              </div>
            )}
            {pet.gender && (
              <div className="bg-amber-50/50 rounded-xl p-4 border border-amber-100/30">
                <p className="text-xs text-gray-500 font-medium mb-1">Gender</p>
                <p className="text-sm font-semibold text-gray-800">{pet.gender}</p>
              </div>
            )}
          </div>

          {pet.description && (
            <div className="mt-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">About {pet.name}</h3>
              <p className="text-sm text-gray-600 leading-relaxed bg-amber-50/30 rounded-xl p-4 border border-amber-100/20">
                {pet.description}
              </p>
            </div>
          )}

          <div className="mt-8 flex gap-3">
            <button
              onClick={() => navigate(-1)}
              className="px-5 py-2.5 rounded-xl border border-amber-200/50 text-gray-700 hover:bg-amber-50 transition-colors cursor-pointer font-medium"
            >
              ← Back
            </button>
            {pet.status === "available" && (
              <button
                onClick={handleAdoptClick}
                className="px-6 py-2.5 rounded-xl bg-linear-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 transition-all cursor-pointer font-semibold shadow-md shadow-amber-500/20"
              >
                🐾 Adopt {pet.name}
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
