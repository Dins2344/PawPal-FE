import { useState, useRef, useEffect } from "react";
import { useToast } from "../../context/ToastContext";
import { updatePet, type Pet } from "../../api/adminApi";
import axios from "axios";

interface EditPetModalProps {
    pet: Pet;
    onClose: () => void;
    onSuccess: (updatedPet: Pet) => void;
}

const EditPetModal: React.FC<EditPetModalProps> = ({ pet, onClose, onSuccess }) => {
    const [form, setForm] = useState({
        name: pet.name,
        species: pet.species || "Dog",
        breed: pet.breed,
        age: pet.age.toString(),
        gender: pet.gender || "Male",
        status: (pet.status || "available").toLowerCase(),
        description: pet.description || "",
    });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(pet.image);
    const [isLoading, setIsLoading] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const toast = useToast();

    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "auto";
        };
    }, []);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleImageSelect = (file: File) => {
        if (!file.type.startsWith("image/")) {
            toast.error("Please select a valid image file.");
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            toast.error("Image must be less than 5MB.");
            return;
        }
        setImageFile(file);
        const reader = new FileReader();
        reader.onload = () => setImagePreview(reader.result as string);
        reader.readAsDataURL(file);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleImageSelect(file);
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        const file = e.dataTransfer.files?.[0];
        if (file) handleImageSelect(file);
    };

    const removeImage = () => {
        setImageFile(null);
        setImagePreview(pet.image);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const formData = new FormData();
            formData.append("name", form.name);
            formData.append("species", form.species);
            formData.append("breed", form.breed);
            formData.append("age", form.age);
            formData.append("gender", form.gender);
            formData.append("status", form.status);
            formData.append("description", form.description);
            if (imageFile) {
                formData.append("image", imageFile);
            }

            const data = await updatePet(pet._id, formData);
            toast.success(data.message || "Pet updated successfully!");
            onSuccess(data.pet);
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                toast.error(err.response?.data?.message || "Failed to update pet.");
            } else {
                toast.error("Something went wrong. Please try again.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const inputClass = "w-full px-4 py-2.5 bg-amber-50/50 border border-amber-200/50 rounded-xl focus:ring-2 focus:ring-amber-500/30 focus:border-amber-400 outline-none transition-all";
    const selectClass = `${inputClass} appearance-none cursor-pointer`;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal Card */}
            <div className="relative bg-white rounded-2xl shadow-2xl shadow-amber-100/50 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden border border-amber-100/30">
                {/* Header */}
                <div className="px-6 py-4 border-b border-amber-100/50 flex items-center justify-between bg-linear-to-r from-amber-50/50 to-orange-50/30">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">Edit Pet Details</h2>
                        <p className="text-sm text-gray-500">Updating information for <span className="font-medium text-amber-700">{pet.name}</span></p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition-colors cursor-pointer shadow-sm"
                    >
                        ✕
                    </button>
                </div>

                {/* Form Content */}
                <div className="p-6 overflow-y-auto">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Left Column — Image Upload */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                    Pet Photo
                                </label>

                                <div
                                    onDragEnter={handleDrag}
                                    onDragLeave={handleDrag}
                                    onDragOver={handleDrag}
                                    onDrop={handleDrop}
                                    onClick={() => fileInputRef.current?.click()}
                                    className={`relative cursor-pointer border-2 border-dashed rounded-2xl transition-all duration-300 overflow-hidden h-64 ${dragActive
                                        ? "border-amber-500 bg-amber-50"
                                        : "border-amber-300 hover:border-amber-400 hover:bg-amber-50/50"
                                        }`}
                                >
                                    {imagePreview ? (
                                        <div className="relative h-full group">
                                            <img src={imagePreview} alt="Pet preview" className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <span className="text-white text-sm font-medium">Click to change</span>
                                            </div>
                                            {imageFile && (
                                                <button
                                                    type="button"
                                                    onClick={(e) => { e.stopPropagation(); removeImage(); }}
                                                    className="absolute top-2 right-2 bg-white text-amber-600 w-7 h-7 rounded-full flex items-center justify-center shadow-lg hover:bg-amber-50 transition-colors"
                                                    title="Revert to original"
                                                >
                                                    ↩
                                                </button>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="h-full flex flex-col items-center justify-center text-center p-6">
                                            <div className="text-4xl mb-3">📷</div>
                                            <p className="text-gray-600 text-sm font-medium">
                                                Click to upload new image
                                            </p>
                                        </div>
                                    )}
                                </div>

                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="hidden"
                                />
                                <p className="text-xs text-gray-400 mt-2 text-center">
                                    Leave unchanged to keep current photo
                                </p>
                            </div>

                            {/* Right Column — Form Fields */}
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="edit-name" className="block text-sm font-semibold text-gray-700 mb-1.5">
                                        Pet Name <span className="text-rose-500">*</span>
                                    </label>
                                    <input id="edit-name" type="text" name="name" value={form.name} onChange={handleChange} required className={inputClass} />
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label htmlFor="edit-species" className="block text-sm font-semibold text-gray-700 mb-1.5">
                                            Species <span className="text-rose-500">*</span>
                                        </label>
                                        <select id="edit-species" name="species" value={form.species} onChange={handleChange} className={selectClass}>
                                            <option value="Dog">🐶 Dog</option>
                                            <option value="Cat">🐱 Cat</option>
                                            <option value="Bird">🐦 Bird</option>
                                            <option value="Rabbit">🐰 Rabbit</option>
                                            <option value="Fish">🐟 Fish</option>
                                            <option value="Other">🐾 Other</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label htmlFor="edit-breed" className="block text-sm font-semibold text-gray-700 mb-1.5">
                                            Breed <span className="text-rose-500">*</span>
                                        </label>
                                        <input id="edit-breed" type="text" name="breed" value={form.breed} onChange={handleChange} required className={inputClass} />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label htmlFor="edit-age" className="block text-sm font-semibold text-gray-700 mb-1.5">
                                            Age (years) <span className="text-rose-500">*</span>
                                        </label>
                                        <input id="edit-age" type="number" name="age" value={form.age} onChange={handleChange} required min="0" max="30" className={inputClass} />
                                    </div>

                                    <div>
                                        <label htmlFor="edit-gender" className="block text-sm font-semibold text-gray-700 mb-1.5">
                                            Gender <span className="text-rose-500">*</span>
                                        </label>
                                        <select id="edit-gender" name="gender" value={form.gender} onChange={handleChange} className={selectClass}>
                                            <option value="Male">♂️ Male</option>
                                            <option value="Female">♀️ Female</option>
                                        </select>
                                    </div>

                                    {/* Status */}
                                    <div className="col-span-2">
                                        <label htmlFor="edit-status" className="block text-sm font-semibold text-gray-700 mb-1.5">
                                            Status <span className="text-rose-500">*</span>
                                        </label>
                                        <select id="edit-status" name="status" value={form.status} onChange={handleChange} className={selectClass}>
                                            <option value="available">Available</option>
                                            <option value="pending">Pending</option>
                                            <option value="adopted">Adopted</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="edit-desc" className="block text-sm font-semibold text-gray-700 mb-1.5">
                                        Description
                                    </label>
                                    <textarea id="edit-desc" name="description" value={form.description} onChange={handleChange} rows={3} className={`${inputClass} resize-none`} />
                                </div>
                            </div>
                        </div>

                        {/* Footer Buttons */}
                        <div className="border-t border-amber-100/50 pt-6 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-6 py-2.5 rounded-xl border border-amber-200/50 text-gray-600 font-medium hover:bg-amber-50 transition-colors cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="px-8 py-2.5 bg-linear-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-xl shadow-lg shadow-amber-500/25 hover:from-amber-600 hover:to-orange-600 transition-all disabled:opacity-70 flex items-center gap-2 cursor-pointer"
                            >
                                {isLoading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    "Save Changes"
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditPetModal;
