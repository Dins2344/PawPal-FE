import React from 'react';

interface AdoptModalProps {
    isOpen: boolean;
    onClose: () => void;
    pet: any;
    onConfirm: () => void;
    isLoading?: boolean;
}

const AdoptModal: React.FC<AdoptModalProps> = ({ isOpen, onClose, pet, onConfirm, isLoading = false }) => {
    if (!isOpen || !pet) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-2xl shadow-amber-100/50 w-full max-w-md p-6 m-4 border border-amber-100/30">
                <button
                    onClick={onClose}
                    disabled={isLoading}
                    className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 hover:text-gray-800 disabled:opacity-50 transition-colors cursor-pointer"
                >
                    ✕
                </button>

                <div className="text-center mb-2">
                    <span className="text-4xl">🐾</span>
                </div>

                <h2 className="text-xl font-bold text-gray-800 text-center mb-2">
                    Adopt {pet.name}?
                </h2>

                <p className="text-gray-500 mb-6 text-center text-sm leading-relaxed">
                    You're about to start the adoption process for <span className="font-semibold text-amber-700">{pet.name}</span>.
                    Please confirm you'd like to proceed.
                </p>

                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="flex-1 px-4 py-2.5 rounded-xl border border-amber-200/50 text-gray-700 hover:bg-amber-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium cursor-pointer"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={onConfirm}
                        disabled={isLoading}
                        className="flex-1 px-4 py-2.5 rounded-xl bg-linear-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 transition-all shadow-md shadow-amber-500/20 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-semibold cursor-pointer"
                    >
                        {isLoading ? (
                            <>
                                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                Confirming...
                            </>
                        ) : (
                            "Confirm Adoption"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdoptModal;
