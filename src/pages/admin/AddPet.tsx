import { useState, useRef } from "react";
import { useToast } from "../../context/ToastContext";
import { addPet } from "../../api/adminApi";
import axios from "axios";

const AddPet = () => {
    const [form, setForm] = useState({
        name: "",
        species: "Dog",
        breed: "",
        age: "",
        gender: "Male",
        description: "",
    });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const toast = useToast();

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
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!imageFile) {
            toast.error("Please upload a pet image.");
            return;
        }

        setIsLoading(true);
        try {
            const formData = new FormData();
            formData.append("name", form.name);
            formData.append("species", form.species);
            formData.append("breed", form.breed);
            formData.append("age", form.age);
            formData.append("gender", form.gender);
            formData.append("description", form.description);
            formData.append("image", imageFile);

            const data = await addPet(formData);
            toast.success(data.message || "Pet added successfully!");

            setForm({ name: "", species: "Dog", breed: "", age: "", gender: "Male", description: "" });
            removeImage();
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                toast.error(err.response?.data?.message || "Failed to add pet.");
            } else {
                toast.error("Something went wrong. Please try again.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const inputClass = "w-full px-4 py-3 bg-amber-50/50 border border-amber-200/50 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-400 transition-all duration-300";
    const selectClass = `${inputClass} appearance-none cursor-pointer`;

    return (
        <div>
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800">Add New Pet</h2>
                <p className="text-gray-500 mt-1">Fill in the details to list a new pet for adoption</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Column — Image Upload */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                            Pet Photo <span className="text-rose-500">*</span>
                        </label>

                        <div
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                            className={`relative cursor-pointer border-2 border-dashed rounded-2xl transition-all duration-300 overflow-hidden ${dragActive
                                ? "border-amber-500 bg-amber-50"
                                : imagePreview
                                    ? "border-emerald-400 bg-emerald-50/30"
                                    : "border-amber-300 hover:border-amber-400 hover:bg-amber-50/50"
                                }`}
                        >
                            {imagePreview ? (
                                <div className="relative group">
                                    <img src={imagePreview} alt="Pet preview" className="w-full h-72 object-cover" />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <span className="text-white text-sm font-medium">Click to change</span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={(e) => { e.stopPropagation(); removeImage(); }}
                                        className="absolute top-3 right-3 bg-rose-500 text-white w-8 h-8 rounded-full flex items-center justify-center shadow-lg hover:bg-rose-600 transition-colors"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ) : (
                                <div className="py-16 px-6 text-center">
                                    <div className="text-5xl mb-4">📷</div>
                                    <p className="text-gray-600 font-medium">
                                        Drag & drop an image here, or{" "}
                                        <span className="text-amber-600 font-semibold">browse</span>
                                    </p>
                                    <p className="text-xs text-gray-400 mt-2">PNG, JPG, JPEG up to 5MB</p>
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
                    </div>

                    {/* Right Column — Form Fields */}
                    <div className="space-y-5">
                        <div>
                            <label htmlFor="add-pet-name" className="block text-sm font-semibold text-gray-700 mb-2">
                                Pet Name <span className="text-rose-500">*</span>
                            </label>
                            <input
                                id="add-pet-name"
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                placeholder="e.g. Buddy"
                                required
                                className={inputClass}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="add-pet-species" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Species <span className="text-rose-500">*</span>
                                </label>
                                <select id="add-pet-species" name="species" value={form.species} onChange={handleChange} className={selectClass}>
                                    <option value="Dog">🐶 Dog</option>
                                    <option value="Cat">🐱 Cat</option>
                                    <option value="Bird">🐦 Bird</option>
                                    <option value="Rabbit">🐰 Rabbit</option>
                                    <option value="Fish">🐟 Fish</option>
                                    <option value="Other">🐾 Other</option>
                                </select>
                            </div>

                            <div>
                                <label htmlFor="add-pet-breed" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Breed <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    id="add-pet-breed"
                                    type="text"
                                    name="breed"
                                    value={form.breed}
                                    onChange={handleChange}
                                    placeholder="e.g. Golden Retriever"
                                    required
                                    className={inputClass}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="add-pet-age" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Age (years) <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    id="add-pet-age"
                                    type="number"
                                    name="age"
                                    value={form.age}
                                    onChange={handleChange}
                                    placeholder="e.g. 3"
                                    required
                                    min="0"
                                    max="30"
                                    className={inputClass}
                                />
                            </div>

                            <div>
                                <label htmlFor="add-pet-gender" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Gender <span className="text-rose-500">*</span>
                                </label>
                                <select id="add-pet-gender" name="gender" value={form.gender} onChange={handleChange} className={selectClass}>
                                    <option value="Male">♂️ Male</option>
                                    <option value="Female">♀️ Female</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="add-pet-desc" className="block text-sm font-semibold text-gray-700 mb-2">
                                Description
                            </label>
                            <textarea
                                id="add-pet-desc"
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                placeholder="Tell us about this pet's personality, health, and any special needs..."
                                rows={4}
                                className={`${inputClass} resize-none`}
                            />
                        </div>
                    </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="cursor-pointer px-8 py-3.5 bg-linear-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-xl shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 hover:from-amber-600 hover:to-orange-600 transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center gap-2"
                    >
                        {isLoading ? (
                            <>
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                Adding Pet...
                            </>
                        ) : (
                            <>🐾 Add Pet</>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddPet;
