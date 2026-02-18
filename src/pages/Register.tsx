import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import axios from "axios";

const Register = () => {
    const [form, setForm] = useState({
        fullName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [agreeTerms, setAgreeTerms] = useState(false);
    const auth = useAuth();
    const toast = useToast();
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (form.password !== form.confirmPassword) {
            toast.error("Passwords do not match!");
            return;
        }
        if (!agreeTerms) {
            toast.error("Please agree to the terms and conditions.");
            return;
        }
        setIsLoading(true);
        try {
            await auth.register({
                fullName: form.fullName,
                email: form.email,
                phone: form.phone,
                password: form.password,
            });
            toast.success("Account created successfully! Welcome to PawPal.");
            navigate("/");
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                toast.error(err.response?.data?.message || "Registration failed. Please try again.");
            } else {
                toast.error("Something went wrong. Please try again.");
            }
        } finally {
            setIsLoading(false);
        }
    };
    const handleSocialLogin = (provider: string) => {
        toast.warning(`${provider} login is not implemented yet.`);
    };

    // Password strength
    const getPasswordStrength = (password: string) => {
        let strength = 0;
        if (password.length >= 8) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;
        return strength;
    };

    const passwordStrength = getPasswordStrength(form.password);
    const strengthLabels = ["", "Weak", "Fair", "Good", "Strong"];
    const strengthColors = [
        "bg-gray-200",
        "bg-red-500",
        "bg-orange-500",
        "bg-yellow-500",
        "bg-emerald-500",
    ];

    const inputClass = "w-full pl-12 pr-4 py-3.5 bg-amber-50/50 border border-amber-200/50 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-400 transition-all duration-300";

    return (
        <div className="grow flex">
            {/* Left Panel - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 bg-linear-to-br from-amber-50/50 to-orange-50/30">
                <div className="w-full max-w-md">
                    {/* Mobile Logo */}
                    <div className="lg:hidden text-center mb-8">
                        <span className="text-5xl">🐾</span>
                        <h1 className="text-2xl font-bold bg-linear-to-r from-amber-600 to-orange-500 bg-clip-text text-transparent mt-2">PawPal</h1>
                    </div>

                    {/* Form Card */}
                    <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl shadow-amber-100/50 p-8 border border-amber-100/50">
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold text-gray-800">
                                Create Account
                            </h1>
                            <p className="text-gray-500 mt-2">
                                Join PawPal and find your perfect companion
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Full Name */}
                            <div>
                                <label htmlFor="register-fullName" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Full Name
                                </label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">👤</span>
                                    <input
                                        id="register-fullName"
                                        type="text"
                                        name="fullName"
                                        value={form.fullName}
                                        onChange={handleChange}
                                        placeholder="John Doe"
                                        required
                                        className={inputClass}
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div>
                                <label htmlFor="register-email" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">✉️</span>
                                    <input
                                        id="register-email"
                                        type="email"
                                        name="email"
                                        value={form.email}
                                        onChange={handleChange}
                                        placeholder="you@example.com"
                                        required
                                        className={inputClass}
                                    />
                                </div>
                            </div>

                            {/* Phone */}
                            <div>
                                <label htmlFor="register-phone" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Phone Number
                                </label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">📱</span>
                                    <input
                                        id="register-phone"
                                        type="tel"
                                        name="phone"
                                        value={form.phone}
                                        onChange={handleChange}
                                        placeholder="+1 (555) 000-0000"
                                        required
                                        className={inputClass}
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div>
                                <label htmlFor="register-password" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔒</span>
                                    <input
                                        id="register-password"
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={form.password}
                                        onChange={handleChange}
                                        placeholder="Create a strong password"
                                        required
                                        minLength={8}
                                        className={`${inputClass} pr-14!`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        {showPassword ? "🙈" : "👁️"}
                                    </button>
                                </div>

                                {/* Password Strength */}
                                {form.password && (
                                    <div className="mt-2">
                                        <div className="flex gap-1">
                                            {[1, 2, 3, 4].map((level) => (
                                                <div
                                                    key={level}
                                                    className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${passwordStrength >= level
                                                        ? strengthColors[passwordStrength]
                                                        : "bg-gray-200"
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                        <p className={`text-xs mt-1 font-medium ${passwordStrength <= 1
                                            ? "text-red-500"
                                            : passwordStrength === 2
                                                ? "text-orange-500"
                                                : passwordStrength === 3
                                                    ? "text-yellow-600"
                                                    : "text-emerald-600"
                                            }`}>
                                            {strengthLabels[passwordStrength]}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <label htmlFor="register-confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔒</span>
                                    <input
                                        id="register-confirmPassword"
                                        type={showConfirmPassword ? "text" : "password"}
                                        name="confirmPassword"
                                        value={form.confirmPassword}
                                        onChange={handleChange}
                                        placeholder="Confirm your password"
                                        required
                                        minLength={8}
                                        className={`w-full pl-12 pr-14 py-3.5 bg-amber-50/50 border rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-300 ${form.confirmPassword && form.confirmPassword !== form.password
                                            ? "border-red-400 focus:ring-red-500/30 focus:border-red-500"
                                            : form.confirmPassword && form.confirmPassword === form.password
                                                ? "border-emerald-400 focus:ring-emerald-500/30 focus:border-emerald-500"
                                                : "border-amber-200/50 focus:ring-amber-500/30 focus:border-amber-400"
                                            }`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        {showConfirmPassword ? "🙈" : "👁️"}
                                    </button>
                                </div>
                                {form.confirmPassword && form.confirmPassword !== form.password && (
                                    <p className="text-xs text-red-500 mt-1 font-medium">Passwords do not match</p>
                                )}
                                {form.confirmPassword && form.confirmPassword === form.password && (
                                    <p className="text-xs text-emerald-600 mt-1 font-medium">✓ Passwords match</p>
                                )}
                            </div>

                            {/* Terms */}
                            <label className="flex items-start gap-3 cursor-pointer pt-1">
                                <input
                                    type="checkbox"
                                    checked={agreeTerms}
                                    onChange={(e) => setAgreeTerms(e.target.checked)}
                                    className="w-4 h-4 rounded border-amber-300 text-amber-600 focus:ring-amber-500 mt-0.5"
                                />
                                <span className="text-sm text-gray-600 leading-snug">
                                    I agree to the{" "}
                                    <a href="#" className="text-amber-600 hover:underline font-medium">Terms of Service</a>{" "}
                                    and{" "}
                                    <a href="#" className="text-amber-600 hover:underline font-medium">Privacy Policy</a>
                                </span>
                            </label>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={isLoading || !agreeTerms}
                                className="w-full py-3.5 bg-linear-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-xl shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 hover:from-amber-600 hover:to-orange-600 transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-2 cursor-pointer"
                            >
                                {isLoading ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        Creating account...
                                    </>
                                ) : (
                                    "Create Account"
                                )}
                            </button>
                        </form>

                        {/* Divider */}
                        <div className="my-6 flex items-center gap-4">
                            <div className="flex-1 h-px bg-amber-200/50" />
                            <span className="text-sm text-gray-400 font-medium">or sign up with</span>
                            <div className="flex-1 h-px bg-amber-200/50" />
                        </div>

                        {/* Social */}
                        <div className="grid grid-cols-2 gap-3">
                            <button onClick={() => handleSocialLogin("google")} className="flex items-center justify-center gap-2 py-3 border border-amber-200/50 rounded-xl hover:bg-amber-50 hover:border-amber-300 transition-all duration-300 text-sm font-medium text-gray-700 cursor-pointer">
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                </svg>
                                Google
                            </button>
                            <button onClick={() => handleSocialLogin("Facebook")} className="flex items-center justify-center gap-2 py-3 border border-amber-200/50 rounded-xl hover:bg-amber-50 hover:border-amber-300 transition-all duration-300 text-sm font-medium text-gray-700 cursor-pointer">
                                <svg className="w-5 h-5" fill="currentColor" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 43 43">
                                    <path fill="#039be5" d="M24 5A19 19 0 1 0 24 43A19 19 0 1 0 24 5Z"></path><path fill="#fff" d="M26.572,29.036h4.917l0.772-4.995h-5.69v-2.73c0-2.075,0.678-3.915,2.619-3.915h3.119v-4.359c-0.548-0.074-1.707-0.236-3.897-0.236c-4.573,0-7.254,2.415-7.254,7.917v3.323h-4.701v4.995h4.701v13.729C22.089,42.905,23.032,43,24,43c0.875,0,1.729-0.08,2.572-0.194V29.036z"></path>
                                </svg>
                                Facebook
                            </button>
                        </div>

                        {/* Login Link */}
                        <p className="text-center text-sm text-gray-500 mt-8">
                            Already have an account?{" "}
                            <Link to="/login" className="text-amber-600 font-semibold hover:text-amber-700 hover:underline transition-colors">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Panel - Illustration */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-linear-to-br from-orange-500 via-amber-500 to-yellow-500">
                {/* Decorative circles */}
                <div className="absolute -top-20 -right-20 w-72 h-72 bg-white/10 rounded-full blur-2xl animate-pulse" />
                <div className="absolute bottom-20 left-10 w-56 h-56 bg-white/10 rounded-full blur-2xl animate-pulse [animation-delay:1s]" />
                <div className="absolute top-1/3 right-1/4 w-40 h-40 bg-white/5 rounded-full blur-xl animate-pulse [animation-delay:2s]" />

                <div className="relative z-10 flex flex-col items-center justify-center w-full px-12 text-white">
                    <div className="text-8xl mb-8 drop-shadow-lg animate-bounce [animation-duration:3s]">
                        🐶
                    </div>
                    <h2 className="text-4xl font-bold mb-4 text-center leading-tight">
                        Start Your Journey
                        <br />
                        <span className="text-yellow-100">With PawPal</span>
                    </h2>
                    <p className="text-lg text-white/80 text-center max-w-md leading-relaxed">
                        Create an account to browse adorable pets, save your favorites, and
                        begin the adoption process. Every pet deserves a loving home.
                    </p>

                    {/* Features */}
                    <div className="mt-12 space-y-4 w-full max-w-sm">
                        <div className="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-xl px-5 py-3.5">
                            <span className="text-2xl">🔍</span>
                            <div>
                                <h4 className="font-semibold text-sm">Browse Pets</h4>
                                <p className="text-xs text-white/70">Explore hundreds of pets looking for a home</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-xl px-5 py-3.5">
                            <span className="text-2xl">❤️</span>
                            <div>
                                <h4 className="font-semibold text-sm">Save Favorites</h4>
                                <p className="text-xs text-white/70">Shortlist pets you love and compare them</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-xl px-5 py-3.5">
                            <span className="text-2xl">📋</span>
                            <div>
                                <h4 className="font-semibold text-sm">Easy Adoption</h4>
                                <p className="text-xs text-white/70">Simple application process, fast approvals</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
