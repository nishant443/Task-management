import { useState, useContext } from "react";
import API from "../api/api";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { User, Mail, Lock, Eye, EyeOff } from "lucide-react";

export default function Register() {
  const { login } = useContext(AuthContext);
  const nav = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await API.post("/auth/register", form);
      login(res.data.user, res.data.token);
      toast.success("Account created successfully!");
      nav("/");
    } catch (err) {
      const message =
        err?.response?.data?.msg ||
        err?.response?.data?.message ||
        err?.message ||
        "Registration failed. Please try again.";
      toast.error(message);
      console.error("Register error:", err);
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
          <h1 className="text-5xl font-bold leading-tight">Create Account</h1>
          <p className="text-xl text-gray-300">
            Join us today and start your journey with us.
          </p>
        </div>
        <div />
      </div>

      {/* Right Pane (Form) */}
      <div className="flex items-center justify-center p-8">
        <div className="max-w-sm w-full">
          <div className="text-left mb-10">
            <h2 className="text-3xl font-bold text-gray-900">
              Create your account
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Sign in
              </Link>
            </p>
          </div>

          <form onSubmit={submit} className="space-y-5">
            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Full Name
              </label>
              <div className="mt-1 relative">
                <input
                  id="name"
                  name="name"
                  type="text"
                  onChange={change}
                  value={form.name}
                  placeholder="John Doe"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
                <User className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email address
              </label>
              <div className="mt-1 relative">
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
                <Mail className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
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
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors ${isLoading
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                  }`}
              >
                {isLoading ? "Creating Account..." : "Sign up"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
