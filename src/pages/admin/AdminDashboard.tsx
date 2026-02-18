import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import AddPet from "./AddPet";
import AdoptionRequests from "./AdoptionRequests";
import ManagePets from "./ManagePets";

type Tab = "add-pet" | "manage-pets" | "adoptions";

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState<Tab>("add-pet");
    const { user } = useAuth();

    const tabs: { key: Tab; label: string; icon: string }[] = [
        { key: "add-pet", label: "Add Pet", icon: "🐾" },
        { key: "manage-pets", label: "Manage Pets", icon: "📦" },
        { key: "adoptions", label: "Adoption Requests", icon: "📋" },
    ];

    return (
        <div className="h-full bg-gray-50">
            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
                            <p className="text-gray-500 mt-1">
                                Welcome back, <span className="font-medium text-gray-700">{user?.fullName}</span>
                            </p>
                        </div>
                        <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-xl text-sm font-medium">
                            <span>🛡️</span> Administrator
                        </div>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar */}
                    <aside className="lg:w-64 shrink-0">
                        <nav className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden sticky top-24">
                            <div className="p-4 bg-linear-to-br from-blue-600 to-indigo-600 text-white">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-lg">
                                        ⚙️
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-sm">Management</h3>
                                        <p className="text-xs text-white/70">Admin Controls</p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-2">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.key}
                                        onClick={() => setActiveTab(tab.key)}
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 mb-1 cursor-pointer ${activeTab === tab.key
                                            ? "bg-blue-50 text-blue-700"
                                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
                                            }`}
                                    >
                                        <span className="text-lg">{tab.icon}</span>
                                        {tab.label}
                                        {activeTab === tab.key && (
                                            <div className="ml-auto w-1.5 h-1.5 bg-blue-600 rounded-full" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </nav>
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1 min-w-0">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:p-8">
                            {activeTab === "add-pet" && <AddPet />}
                            {activeTab === "manage-pets" && <ManagePets />}
                            {activeTab === "adoptions" && <AdoptionRequests />}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
