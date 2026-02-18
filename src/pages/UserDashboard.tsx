import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { getUserAdoptions, withdrawAdoption, type UserAdoptionRequest } from "../api/userApi";
import { Link } from "react-router-dom";
import Pagination from "../components/ui/Pagination";
import axios from "axios";

const ITEMS_PER_PAGE = 6;

const UserDashboard = () => {
    const { user } = useAuth();
    const [requests, setRequests] = useState<UserAdoptionRequest[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [withdrawingId, setWithdrawingId] = useState<string | null>(null);
    const [confirmWithdrawId, setConfirmWithdrawId] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const toast = useToast();

    const fetchRequests = async () => {
        setIsLoading(true);
        try {
            const data = await getUserAdoptions();
            setRequests(data);
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                toast.error(err.response?.data?.message || "Failed to load requests.");
            } else {
                toast.error("Failed to load requests.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const handleWithdraw = async (id: string) => {
        setWithdrawingId(id);
        try {
            const data = await withdrawAdoption(id);
            toast.success(data.message || "Adoption request withdrawn.");
            setRequests((prev) => prev.filter((r) => r._id !== id));
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                toast.error(err.response?.data?.message || "Failed to withdraw request.");
            } else {
                toast.error("Failed to withdraw request.");
            }
        } finally {
            setWithdrawingId(null);
            setConfirmWithdrawId(null);
        }
    };

    const statusBadge = (status: string) => {
        const styles: Record<string, string> = {
            pending: "bg-amber-100 text-amber-700",
            approved: "bg-emerald-100 text-emerald-700",
            rejected: "bg-rose-100 text-rose-700",
            withdrawn: "bg-gray-100 text-gray-600",
        };
        return (
            <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${styles[status] || "bg-gray-100 text-gray-600"}`}>
                {status}
            </span>
        );
    };

    const totalPages = Math.ceil(requests.length / ITEMS_PER_PAGE);
    const paginatedRequests = requests.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    useEffect(() => {
        if (currentPage > 1 && paginatedRequests.length === 0) {
            setCurrentPage((prev) => prev - 1);
        }
    }, [requests.length]);

    return (
        <div className="min-h-[calc(100vh-72px)] flex flex-col">
            <div className="bg-linear-to-r from-amber-50 to-orange-50 border-b border-amber-100/50 py-8 px-6">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-3xl font-bold text-gray-800">My Dashboard</h1>
                    <p className="text-gray-500 mt-1">
                        Welcome back, <span className="font-medium text-amber-700">{user?.fullName}</span>
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-8 w-full grow">

                {isLoading ? (
                    <div className="flex justify-center py-20">
                        <svg className="animate-spin h-10 w-10 text-amber-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                    </div>
                ) : requests.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-amber-100/40">
                        <div className="text-6xl mb-4">🐾</div>
                        <h3 className="text-lg font-semibold text-gray-600">No adoption requests yet</h3>
                        <p className="text-gray-400 mt-1 mb-6">Start browsing to find your new best friend!</p>
                        <Link
                            to="/"
                            className="px-6 py-2.5 bg-linear-to-r from-amber-500 to-orange-500 text-white rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all font-semibold shadow-md shadow-amber-500/20"
                        >
                            Browse Pets
                        </Link>
                    </div>
                ) : (
                    <div>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-800">Your Applications</h2>
                            <p className="text-sm text-gray-500">{requests.length} total</p>
                        </div>
                        <div className="grid gap-4">
                            {paginatedRequests.map((request) => (
                                <div
                                    key={request._id}
                                    className="bg-white p-5 rounded-2xl shadow-sm border border-amber-100/40 flex flex-col sm:flex-row items-center gap-6 hover:shadow-md hover:shadow-amber-100/30 transition-all"
                                >
                                    <img
                                        src={request.pet.image}
                                        alt={request.pet.name}
                                        className="w-24 h-24 rounded-xl object-cover shadow-sm shrink-0"
                                    />

                                    <div className="flex-1 text-center sm:text-left">
                                        <h3 className="text-lg font-bold text-gray-800">{request.pet.name}</h3>
                                        <p className="text-sm text-gray-500">{request.pet.breed}</p>
                                        <p className="text-xs text-gray-400 mt-1">
                                            Applied on {new Date(request.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>

                                    <div className="flex flex-col items-center sm:items-end gap-3 shrink-0">
                                        {statusBadge(request.status)}

                                        {request.status === "pending" && (
                                            <>
                                                {confirmWithdrawId === request._id ? (
                                                    <div className="flex items-center justify-end gap-2">
                                                        <span className="text-xs text-gray-500 mr-1">Sure?</span>
                                                        <button
                                                            onClick={() => handleWithdraw(request._id)}
                                                            disabled={withdrawingId === request._id}
                                                            className="cursor-pointer px-3 py-1.5 bg-rose-600 text-white text-xs font-semibold rounded-lg hover:bg-rose-700 transition-colors disabled:opacity-60"
                                                        >
                                                            {withdrawingId === request._id ? "..." : "Yes"}
                                                        </button>
                                                        <button
                                                            onClick={() => setConfirmWithdrawId(null)}
                                                            disabled={withdrawingId === request._id}
                                                            className="cursor-pointer px-3 py-1.5 bg-gray-200 text-gray-700 text-xs font-semibold rounded-lg hover:bg-gray-300 transition-colors"
                                                        >
                                                            No
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() => setConfirmWithdrawId(request._id)}
                                                        className="cursor-pointer px-4 py-1.5 text-rose-600 bg-rose-50 text-xs font-semibold rounded-lg hover:bg-rose-100 transition-colors"
                                                    >
                                                        Withdraw
                                                    </button>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserDashboard;
