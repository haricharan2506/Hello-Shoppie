import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaEnvelope,
  FaLock,
  FaSignInAlt,
  FaEye,
  FaEyeSlash,
  FaShoppingBag,
  FaStar,
  FaTruck,
} from "react-icons/fa";
import { toast } from "react-toastify";

import { loginUser } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);

  // --- cursor-reactive 3D tilt (left panel only) ---
  const stageRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [spot, setSpot] = useState({ x: 50, y: 50 });

  const handleStageMouseMove = (e) => {
    const rect = stageRef.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width; // 0 -> 1
    const py = (e.clientY - rect.top) / rect.height; // 0 -> 1

    setTilt({
      x: (py - 0.5) * -12, // rotateX
      y: (px - 0.5) * 12, // rotateY
    });
    setSpot({ x: px * 100, y: py * 100 });
  };

  const handleStageMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setSpot({ x: 50, y: 50 });
  };

  // --- cursor glow for the whole page background ---
  const [pageSpot, setPageSpot] = useState({ x: 50, y: 30 });

  const handlePageMouseMove = (e) => {
    setPageSpot({
      x: (e.clientX / window.innerWidth) * 100,
      y: (e.clientY / window.innerHeight) * 100,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error("Please enter email and password");
      return;
    }

    try {
      setLoading(true);

      const data = await loginUser(formData);

      if (data.success) {
        login(data);

        toast.success(data.message || "Login Successful");

        navigate("/");
      }
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Unable to login. Please try again.";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      onMouseMove={handlePageMouseMove}
      className="min-h-screen w-full relative flex items-center justify-center bg-[#FFF3E6] font-[Jakarta] overflow-hidden px-4 py-10"
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@500;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        .font-display { font-family: 'Baloo 2', system-ui, sans-serif; }
        .font-body { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; }

        @keyframes floatChip {
          0%, 100% { transform: translateY(0px) translateZ(var(--tz, 80px)); }
          50% { transform: translateY(-8px) translateZ(var(--tz, 80px)); }
        }
        @keyframes blobPulse {
          0%, 100% { transform: scale(1) translateZ(-60px); }
          50% { transform: scale(1.08) translateZ(-60px); }
        }
        @keyframes bagRise {
          0% { opacity: 0; transform: translateY(24px) scale(0.92); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes cardRise {
          0% { opacity: 0; transform: translateY(16px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .chip-1 { animation: floatChip 4.5s ease-in-out infinite; }
        .chip-2 { animation: floatChip 5.2s ease-in-out infinite 0.4s; }
        .blob { animation: blobPulse 6s ease-in-out infinite; }
        .bag-enter { animation: bagRise 0.9s cubic-bezier(0.16, 1, 0.3, 1) both; }
        .card-enter { animation: cardRise 0.7s cubic-bezier(0.16, 1, 0.3, 1) both; }
      `}</style>

      {/* decorative page background */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div
          className="absolute -top-20 -left-24 w-80 h-80 rounded-full"
          style={{ background: "linear-gradient(135deg,#FF6B5B,#FFB627)", opacity: 0.35 }}
        />
        <div
          className="absolute top-10 right-[-6rem] w-72 h-72 rounded-full"
          style={{ background: "linear-gradient(135deg,#FFB627,#FF6B5B)", opacity: 0.3 }}
        />
        <div
          className="absolute bottom-[-5rem] left-[10%] w-96 h-96 rounded-full"
          style={{ background: "linear-gradient(135deg,#145C52,#FFB627)", opacity: 0.18 }}
        />
        <div
          className="absolute bottom-10 right-[8%] w-40 h-40 rounded-full"
          style={{ background: "#FF6B5B", opacity: 0.25 }}
        />
      </div>

      {/* page-wide cursor glow, sits above the blobs, below the card */}
      <div
        className="pointer-events-none absolute inset-0 z-[5] transition-opacity duration-300"
        style={{
          background: `radial-gradient(500px circle at ${pageSpot.x}% ${pageSpot.y}%, rgba(255,107,91,0.14), transparent 70%)`,
        }}
      />

      {/* CARD — contains the whole login experience */}
      <div className="relative z-10 w-full max-w-5xl bg-white rounded-[2rem] shadow-2xl shadow-black/10 overflow-hidden flex min-h-[600px]">

        {/* LEFT — brand / 3D stage */}
        <div
          ref={stageRef}
          onMouseMove={handleStageMouseMove}
          onMouseLeave={handleStageMouseLeave}
          className="relative hidden lg:flex lg:w-[46%] flex-col items-center justify-center gap-8 overflow-hidden px-10 py-12"
          style={{
            background:
              "radial-gradient(120% 120% at 15% 10%, #145C52 0%, #0B3D3A 55%, #082B28 100%)",
          }}
        >
          {/* local cursor spotlight */}
          <div
            className="pointer-events-none absolute inset-0 transition-opacity duration-300"
            style={{
              background: `radial-gradient(320px circle at ${spot.x}% ${spot.y}%, rgba(255,178,39,0.16), transparent 70%)`,
            }}
          />

          {/* headline — normal flow, own row, never overlaps the stage below */}
          <div className="relative z-20 w-full">
            <h1 className="font-display text-white text-4xl xl:text-5xl font-extrabold leading-[1.05] drop-shadow-sm">
              Hello,<br />Shoppie!
            </h1>
            <p className="font-body text-[#BFEDE4] text-base mt-3 max-w-sm">
              Your smarter way to shop.
            </p>
          </div>

          {/* 3D stage — its own row, fills remaining height, fully separate from the headline */}
          <div className="relative z-10 w-full flex-1 min-h-0 flex items-center justify-center">
            <div
              className="relative w-[300px] h-[300px]"
              style={{ perspective: "1200px" }}
            >
              <div
                className="bag-enter relative w-full h-full transition-transform duration-200 ease-out"
                style={{
                  transformStyle: "preserve-3d",
                  transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
                }}
              >
                {/* background blob (deep layer) */}
                <div
                  className="blob absolute left-1/2 top-1/2 w-56 h-56 -translate-x-1/2 -translate-y-1/2 rounded-full"
                  style={{
                    background: "linear-gradient(135deg, #FFB627 0%, #FF6B5B 100%)",
                    opacity: 0.25,
                    filter: "blur(6px)",
                  }}
                />

                {/* main shopping bag (mid layer) */}
                <div
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center w-40 h-40 rounded-[2rem] shadow-2xl"
                  style={{
                    transform: "translateZ(60px)",
                    background: "linear-gradient(160deg, #FFCF6B 0%, #FF6B5B 100%)",
                    boxShadow: "0 30px 60px -15px rgba(0,0,0,0.5)",
                  }}
                >
                  <FaShoppingBag className="text-white" size={56} />
                </div>               
              </div>
            </div>
          </div>

          <p className="relative z-20 w-full font-body text-[#7FB8AE] text-xs">
            You makes the choice here 😏✨
          </p>
        </div>

        {/* RIGHT — form */}
        <div className="flex-1 flex items-center justify-center px-6 py-10">
          <div className="card-enter w-full max-w-md">
            {/* mobile-only mini heading */}
            <div className="lg:hidden text-center mb-8">
              <div className="mx-auto w-14 h-14 bg-[#0B3D3A] text-white rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                <FaShoppingBag size={22} />
              </div>
              <h1 className="font-display text-3xl font-extrabold text-[#0B3D3A]">
                Hello, Shoppie!
              </h1>
              <p className="font-body text-gray-500 mt-1">
                Your smarter way to shop.
              </p>
            </div>

            <div className="hidden lg:flex items-center gap-2 mb-8">
              <FaSignInAlt className="text-[#FF6B5B]" size={18} />
              <span className="font-body text-sm font-semibold tracking-wide text-[#0B3D3A] uppercase">
                Welcome back
              </span>
            </div>

            <h2 className="hidden lg:block font-display text-3xl font-bold text-[#0B3D3A] mb-8">
              Log in to your account
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label className="block font-body text-sm font-semibold text-[#0B3D3A] mb-2">
                  Email Address
                </label>

                <div className="flex items-center gap-3 border-2 border-gray-200 rounded-xl px-4 bg-white transition-all focus-within:border-[#FF6B5B] focus-within:shadow-[0_0_0_4px_rgba(255,107,91,0.12)]">
                  <FaEnvelope className="text-gray-400" />

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="w-full py-3.5 outline-none font-body text-[#0B3D3A] placeholder:text-gray-400 bg-transparent"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block font-body text-sm font-semibold text-[#0B3D3A]">
                    Password
                  </label>
                  <Link
                    to="/forgot-password"
                    className="font-body text-xs font-semibold text-[#FF6B5B] hover:underline"
                  >
                    Forgot?
                  </Link>
                </div>

                <div className="flex items-center gap-3 border-2 border-gray-200 rounded-xl px-4 bg-white transition-all focus-within:border-[#FF6B5B] focus-within:shadow-[0_0_0_4px_rgba(255,107,91,0.12)]">
                  <FaLock className="text-gray-400" />

                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className="w-full py-3.5 outline-none font-body text-[#0B3D3A] placeholder:text-gray-400 bg-transparent"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="text-gray-400 hover:text-[#0B3D3A] transition"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              {/* Remember me */}
              <label className="flex items-center gap-2 font-body text-sm text-gray-600 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={() => setRemember((r) => !r)}
                  className="w-4 h-4 rounded accent-[#FF6B5B]"
                />
                Keep me signed in
              </label>

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#0B3D3A] text-white py-3.5 rounded-xl font-body font-bold tracking-wide hover:bg-[#145C52] active:scale-[0.99] transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-[#0B3D3A]/20"
              >
                {loading ? "Logging in..." : "Log In"}
              </button>
            </form>

            {/* Register */}
            <p className="text-center font-body text-gray-600 mt-8">
              New to Shoppie?{" "}
              <Link
                to="/register"
                className="text-[#FF6B5B] font-bold hover:underline"
              >
                Create an account
              </Link>
            </p>
            <p className="text-center font-body text-gray-600 mt-2">
              Want to sell on Shoppie?{" "}
              <Link
                to="/seller/register"
                className="text-[#FF6B5B] font-bold hover:underline"
              >
                Become a Seller
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;