import { useEffect, useState } from "react";
import { useToast } from "../../context/ToastContext";
import { getAllPets, deletePet, type Pet } from "../../api/adminApi";
import EditPetModal from "./EditPetModal";
import Pagination from "../../components/ui/Pagination";
import axios from "axios";

const ITEMS_PER_PAGE = 8;

const ManagePets = () => {
    const [pets, setPets] = useState<Pet[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
    const [editingPet, setEditingPet] = useState<Pet | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const toast = useToast();

    const fetchPets = async () => {
        setIsLoading(true);
        try {
            const data = await getAllPets();
            setPets(data);
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                toast.error(err.response?.data?.message || "Failed to load pets.");
            } else {
                toast.error("Failed to load pets.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPets();
    }, []);

    const handleDelete = async (id: string) => {
        setDeletingId(id);
        try {
            const data = await deletePet(id);
            toast.success(data.message || "Pet deleted successfully.");
            setPets((prev) => prev.filter((p) => p._id !== id));
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                toast.error(err.response?.data?.message || "Failed to delete pet.");
            } else {
                toast.error("Failed to delete pet.");
            }
        } finally {
            setDeletingId(null);
            setConfirmDeleteId(null);
        }
    };

    const handleEditSuccess = (updatedPet: Pet) => {
        setPets((prev) => prev.map((p) => (p._id === updatedPet._id ? updatedPet : p)));
        setEditingPet(null);
    };

    const statusBadge = (status: string) => {
        const styles: Record<string, string> = {
            available: "bg-emerald-100 text-emerald-700",
            pending: "bg-amber-100 text-amber-700",
            adopted: "bg-sky-100 text-sky-700",
        };
        return (
            <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${styles[status] || "bg-gray-100 text-gray-600"}`}>
                {status}
            </span>
        );
    };

    const totalPages = Math.ceil(pets.length / ITEMS_PER_PAGE);
    const paginatedPets = pets.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    useEffect(() => {
        if (currentPage > 1 && paginatedPets.length === 0) {
            setCurrentPage((prev) => prev - 1);
        }
    }, [pets.length]);

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Manage Pets</h2>
                    <p className="text-gray-500 mt-1">View and manage all listed pets ({pets.length} total)</p>
                </div>
                <button
                    onClick={fetchPets}
                    disabled={isLoading}
                    className="cursor-pointer px-4 py-2 bg-amber-50 text-amber-700 rounded-xl hover:bg-amber-100 transition-colors text-sm font-medium disabled:opacity-50 border border-amber-200/50"
                >
                    ↻ Refresh
                </button>
            </div>

            {isLoading && (
                <div className="flex items-center justify-center py-20">
                    <svg className="animate-spin h-8 w-8 text-amber-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                </div>
            )}

            {!isLoading && pets.length === 0 && (
                <div className="text-center py-20">
                    <div className="text-6xl mb-4">🐾</div>
                    <h3 className="text-lg font-semibold text-gray-600">No pets listed yet</h3>
                    <p className="text-gray-400 mt-1">Add your first pet from the "Add Pet" tab.</p>
                </div>
            )}

            {!isLoading && pets.length > 0 && (
                <>
                    <div className="overflow-x-auto rounded-2xl border border-amber-100/50">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-amber-50/50 border-b border-amber-100/50">
                                    <th className="px-5 py-4 text-xs font-semibold text-amber-800 uppercase tracking-wider">Pet</th>
                                    <th className="px-5 py-4 text-xs font-semibold text-amber-800 uppercase tracking-wider">Species</th>
                                    <th className="px-5 py-4 text-xs font-semibold text-amber-800 uppercase tracking-wider">Breed</th>
                                    <th className="px-5 py-4 text-xs font-semibold text-amber-800 uppercase tracking-wider">Age</th>
                                    <th className="px-5 py-4 text-xs font-semibold text-amber-800 uppercase tracking-wider">Gender</th>
                                    <th className="px-5 py-4 text-xs font-semibold text-amber-800 uppercase tracking-wider">Status</th>
                                    <th className="px-5 py-4 text-xs font-semibold text-amber-800 uppercase tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-amber-50">
                                {paginatedPets.map((pet) => (
                                    <tr key={pet._id} className="hover:bg-amber-50/30 transition-colors">
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                <img src={pet.image} alt={pet.name} className="w-12 h-12 rounded-xl object-cover shadow-sm shrink-0" />
                                                <div>
                                                    <p className="font-semibold text-gray-800">{pet.name}</p>
                                                    <p className="text-xs text-gray-400">
                                                        {new Date(pet.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4 text-sm text-gray-600">{pet.species}</td>
                                        <td className="px-5 py-4 text-sm text-gray-600">{pet.breed}</td>
                                        <td className="px-5 py-4 text-sm text-gray-600">{pet.age} yrs</td>
                                        <td className="px-5 py-4 text-sm text-gray-600">{pet.gender}</td>
                                        <td className="px-5 py-4">{statusBadge(pet.status)}</td>
                                        <td className="px-5 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => setEditingPet(pet)}
                                                    className="cursor-pointer px-3 py-1.5 bg-amber-50 text-amber-700 text-xs font-semibold rounded-lg hover:bg-amber-100 transition-colors border border-amber-200/30"
                                                >
                                                    ✏️ Edit
                                                </button>

                                                {confirmDeleteId === pet._id ? (
                                                    <>
                                                        <span className="text-xs text-gray-500 mr-1">Sure?</span>
                                                        <button
                                                            onClick={() => handleDelete(pet._id)}
                                                            disabled={deletingId === pet._id}
                                                            className="cursor-pointer px-3 py-1.5 bg-rose-600 text-white text-xs font-semibold rounded-lg hover:bg-rose-700 transition-colors disabled:opacity-60"
                                                        >
                                                            {deletingId === pet._id ? "..." : "Yes"}
                                                        </button>
                                                        <button
                                                            onClick={() => setConfirmDeleteId(null)}
                                                            disabled={deletingId === pet._id}
                                                            className="cursor-pointer px-3 py-1.5 bg-gray-200 text-gray-700 text-xs font-semibold rounded-lg hover:bg-gray-300 transition-colors"
                                                        >
                                                            No
                                                        </button>
                                                    </>
                                                ) : (
                                                    <button
                                                        onClick={() => setConfirmDeleteId(pet._id)}
                                                        className="cursor-pointer px-3 py-1.5 text-rose-600 bg-rose-50 text-xs font-semibold rounded-lg hover:bg-rose-100 transition-colors"
                                                    >
                                                        🗑 Delete
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                </>
            )}

            {editingPet && (
                <EditPetModal
                    pet={editingPet}
                    onClose={() => setEditingPet(null)}
                    onSuccess={handleEditSuccess}
                />
            )}
        </div>
    );
};

export default ManagePets;
