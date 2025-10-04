// src/pages/Login.jsx
import { useState, useContext } from "react";
import API from "../api/api";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { Lock, Eye, EyeOff } from "lucide-react";

export default function Login() {
    const auth = useContext(AuthContext);
    const loginFromContext = auth?.login;
    const navigate = useNavigate();

    const [form, setForm] = useState({ email: "", password: "" });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const submit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const res = await API.post("/auth/login", form);
            const { user, token } = res.data; // <- correct extraction

            if (!user || !token) throw new Error("Invalid login response");

            const userWithToken = { ...user, token };
            localStorage.setItem("user", JSON.stringify(userWithToken));

            toast.success("Signed in successfully!");
            navigate("/"); // go to home
        } catch (err) {
            console.error("Login error:", err);
            const message =
                err?.response?.data?.message ||
                err?.response?.data?.msg ||
                err?.message ||
                "Login failed. Please try again.";
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    };



    return (
        <div className="min-h-screen font-sans antialiased bg-white grid lg:grid-cols-2 overflow-x-hidden">
            {/* Left Pane */}
            <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-gray-900 to-blue-900 text-white">
                <div className="font-bold text-xl tracking-wider"></div>
                <div className="space-y-4">
                    <h1 className="text-5xl font-bold leading-tight">Welcome back.</h1>
                    <p className="text-xl text-gray-300">Login to continue your journey with us.</p>
                </div>
                <div />
            </div>

            {/* Right Pane (Form) */}
            <div className="flex items-center justify-center p-8">
                <div className="max-w-sm w-full">
                    <div className="text-left mb-10">
                        <h2 className="text-3xl font-bold text-gray-900">Login to your account</h2>
                        <p className="mt-2 text-sm text-gray-600">
                            Don't have an account?{" "}
                            <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
                                Sign up
                            </Link>
                        </p>
                    </div>

                    <form onSubmit={submit} className="space-y-5" autoComplete="off">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email address
                            </label>
                            <div className="mt-1">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    onChange={change}
                                    value={form.email}
                                    autoComplete="email"
                                    placeholder="you@example.com"
                                    required
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between">
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                    Password
                                </label>
                                <div className="text-sm">
                                    <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                                        Forgot?
                                    </a>
                                </div>
                            </div>
                            <div className="mt-1 relative">
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    onChange={change}
                                    value={form.password}
                                    placeholder="Enter your password"
                                    required
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors ${isLoading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                                    }`}
                            >
                                {isLoading ? "Signing in..." : "Login now"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
