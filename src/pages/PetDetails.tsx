import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useMemo, useState } from "react";
import AdoptModal from "../components/pets/AdoptModal";
import { useToast } from "../context/ToastContext";
import { useAuth } from "../context/AuthContext";
import { adoptPet } from "../api/adoptionApi";
import axios from "axios";

// Temporary: sample data fallback for demo purposes
const SAMPLE_PETS = [
  { _id: "64b8c9e5f1a2c9b1d2e3f4a", name: "Buddy", breed: "Golden Retriever", age: 3, image: "/images/buddy.jpg", status: "Available" },
  { _id: "64b8c9e5f1a2c9b1d2e3f4b", name: "Luna", breed: "Siamese Cat", age: 2, image: "/images/luna.jpg", status: "Available" },
  { _id: "64b8c9e5f1a2c9b1d2e3f4c", name: "Max", breed: "German Shepherd", age: 5, image: "/images/max.jpg", status: "Pending" },
];

const PetDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [isAdoptModalOpen, setIsAdoptModalOpen] = useState(false);
  const [isAdopting, setIsAdopting] = useState(false);
  const toast = useToast();
  const { user } = useAuth();

  // Try to get pet from location.state first (navigation from grid), otherwise fallback to sample lookup
  const pet = useMemo(() => {
    if ((location.state as any)?.pet) return (location.state as any).pet;
    return SAMPLE_PETS.find((p) => p._id === id);
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

  if (!pet) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-20">
        <p className="text-center text-gray-600">Pet not found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        <img src={pet.image} alt={pet.name} className="w-full h-72 object-cover" />

        <div className="p-6">
          <h2 className="text-2xl font-semibold">{pet.name}</h2>
          <p className="text-gray-500 mt-1">{pet.breed} • {pet.age} years</p>
          <p className="mt-4 text-sm text-gray-700">Status: <span className="font-medium">{pet.status}</span></p>

          <div className="mt-6 flex gap-3">
            <button onClick={() => navigate(-1)} className="px-4 py-2 rounded-lg border">Back</button>
            <button onClick={handleAdoptClick} className="px-4 py-2 rounded-lg bg-green-600 text-white">Continue to Adopt</button>
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
}

export default PetDetails;
