import { useEffect, useState } from "react";
import { useToast } from "../../context/ToastContext";
import { getAdoptionRequests, approveAdoption, rejectAdoption, type AdoptionRequest } from "../../api/adminApi";
import axios from "axios";

const AdoptionRequests = () => {
    const [requests, setRequests] = useState<AdoptionRequest[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
    const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "approved" | "rejected">("all");
    const toast = useToast();

    const fetchRequests = async () => {
        setIsLoading(true);
        try {
            const data = await getAdoptionRequests();
            setRequests(data);
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                toast.error(err.response?.data?.message || "Failed to load adoption requests.");
            } else {
                toast.error("Failed to load adoption requests.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const handleApprove = async (id: string) => {
        setActionLoadingId(id);
        try {
            const data = await approveAdoption(id);
            toast.success(data.message || "Adoption approved! 🎉");
            setRequests((prev) =>
                prev.map((r) => (r._id === id ? { ...r, status: "approved" } : r))
            );
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                toast.error(err.response?.data?.message || "Failed to approve adoption.");
            } else {
                toast.error("Failed to approve adoption.");
            }
        } finally {
            setActionLoadingId(null);
        }
    };

    const handleReject = async (id: string) => {
        setActionLoadingId(id);
        try {
            const data = await rejectAdoption(id);
            toast.success(data.message || "Adoption rejected.");
            setRequests((prev) =>
                prev.map((r) => (r._id === id ? { ...r, status: "rejected" } : r))
            );
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                toast.error(err.response?.data?.message || "Failed to reject adoption.");
            } else {
                toast.error("Failed to reject adoption.");
            }
        } finally {
            setActionLoadingId(null);
        }
    };

    const filteredRequests =
        filterStatus === "all" ? requests : requests.filter((r) => r.status === filterStatus);

    const statusBadge = (status: string) => {
        const styles: Record<string, string> = {
            pending: "bg-amber-100 text-amber-700",
            approved: "bg-green-100 text-green-700",
            rejected: "bg-red-100 text-red-700",
        };
        return (
            <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${styles[status] || "bg-gray-100 text-gray-600"}`}>
                {status}
            </span>
        );
    };

    const pendingCount = requests.filter((r) => r.status === "pending").length;
    const approvedCount = requests.filter((r) => r.status === "approved").length;
    const rejectedCount = requests.filter((r) => r.status === "rejected").length;

    return (
        <div>
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800">Adoption Requests</h2>
                <p className="text-gray-500 mt-1">Review and manage adoption applications</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
                    <div className="text-3xl font-bold text-amber-600">{pendingCount}</div>
                    <div className="text-sm text-amber-700 mt-1 font-medium">Pending</div>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-2xl p-5">
                    <div className="text-3xl font-bold text-green-600">{approvedCount}</div>
                    <div className="text-sm text-green-700 mt-1 font-medium">Approved</div>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-2xl p-5">
                    <div className="text-3xl font-bold text-red-600">{rejectedCount}</div>
                    <div className="text-sm text-red-700 mt-1 font-medium">Rejected</div>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2 mb-6">
                {(["all", "pending", "approved", "rejected"] as const).map((status) => (
                    <button
                        key={status}
                        onClick={() => setFilterStatus(status)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 capitalize cursor-pointer ${filterStatus === status
                            ? "bg-blue-600 text-white shadow-md"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                    >
                        {status === "all" ? `All (${requests.length})` : `${status} (${requests.filter(r => r.status === status).length})`}
                    </button>
                ))}
            </div>

            {/* Loading State */}
            {isLoading && (
                <div className="flex items-center justify-center py-20">
                    <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                </div>
            )}

            {/* Empty State */}
            {!isLoading && filteredRequests.length === 0 && (
                <div className="text-center py-20">
                    <div className="text-6xl mb-4">📭</div>
                    <h3 className="text-lg font-semibold text-gray-600">No adoption requests</h3>
                    <p className="text-gray-400 mt-1">
                        {filterStatus === "all"
                            ? "No adoption requests found."
                            : `No ${filterStatus} requests found.`}
                    </p>
                </div>
            )}

            {/* Request Cards */}
            {!isLoading && filteredRequests.length > 0 && (
                <div className="space-y-4">
                    {filteredRequests.map((req) => (
                        <div
                            key={req._id}
                            className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow duration-300"
                        >
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                                {/* Pet Info */}
                                <div className="flex items-center gap-4 flex-1 min-w-0">
                                    <img
                                        src={req.pet.image}
                                        alt={req.pet.name}
                                        className="w-16 h-16 rounded-xl object-cover shadow-sm shrink-0"
                                    />
                                    <div className="min-w-0">
                                        <h4 className="font-semibold text-gray-800 truncate">{req.pet.name}</h4>
                                        <p className="text-sm text-gray-500">{req.pet.breed}</p>
                                    </div>
                                </div>

                                {/* Arrow */}
                                <div className="hidden sm:block text-gray-300 text-2xl">→</div>

                                {/* User Info */}
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-semibold text-gray-800 truncate">{req.user.fullName}</h4>
                                    <p className="text-sm text-gray-500">{req.user.email}</p>
                                    <p className="text-sm text-gray-400">{req.user.phone}</p>
                                </div>

                                {/* Status & Actions */}
                                <div className="flex flex-col items-end gap-3 shrink-0">
                                    {statusBadge(req.status)}

                                    <div className="text-xs text-gray-400">
                                        {new Date(req.createdAt).toLocaleDateString("en-US", {
                                            year: "numeric",
                                            month: "short",
                                            day: "numeric",
                                        })}
                                    </div>

                                    {req.status === "pending" && (
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleApprove(req._id)}
                                                disabled={actionLoadingId === req._id}
                                                className="cursor-pointer px-4 py-2 bg-green-600 text-white text-xs font-semibold rounded-lg hover:bg-green-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                                            >
                                                {actionLoadingId === req._id ? "..." : "✓ Approve"}
                                            </button>
                                            <button
                                                onClick={() => handleReject(req._id)}
                                                disabled={actionLoadingId === req._id}
                                                className="cursor-pointer px-4 py-2 bg-red-500 text-white text-xs font-semibold rounded-lg hover:bg-red-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                                            >
                                                {actionLoadingId === req._id ? "..." : "✕ Reject"}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdoptionRequests;
