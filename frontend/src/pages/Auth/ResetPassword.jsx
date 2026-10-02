import { useState, useRef } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import api from "../../api/api";
import {
  FaLock,
  FaEye,
  FaEyeSlash,
  FaShoppingBag,
  FaKey,
  FaCheckCircle,
  FaExclamationTriangle,
} from "react-icons/fa";
import { toast } from "react-toastify";

const SHARED_STYLES = `
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
`;

// Defined OUTSIDE the ResetPassword component (module scope) so it keeps a
// stable identity across re-renders. If this were defined inside the
// component, React would treat it as a brand-new component type on every
// render (e.g. every keystroke, every mousemove updating pageSpot) and
// unmount/remount the whole subtree — dropping input focus after every
// character typed and restarting every animation.
const PageShell = ({ pageSpot, onMouseMove, children }) => (
  <div
    onMouseMove={onMouseMove}
    className="min-h-screen w-full relative flex items-center justify-center bg-[#FFF3E6] font-[Jakarta] overflow-hidden px-4 py-10"
  >
    <style>{SHARED_STYLES}</style>

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

    <div
      className="pointer-events-none absolute inset-0 z-[5] transition-opacity duration-300"
      style={{
        background: `radial-gradient(500px circle at ${pageSpot.x}% ${pageSpot.y}%, rgba(255,107,91,0.14), transparent 70%)`,
      }}
    />

    {children}
  </div>
);

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // --- cursor-reactive 3D tilt (left panel only) ---
  const stageRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [spot, setSpot] = useState({ x: 50, y: 50 });

  const handleStageMouseMove = (e) => {
    const rect = stageRef.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;

    setTilt({
      x: (py - 0.5) * -12,
      y: (px - 0.5) * 12,
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      toast.error("Invalid or missing password reset link.");
      return;
    }

    if (!password || !confirmPassword) {
      toast.error("Please fill in both password fields.");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post(
        "/auth/reset-password",
        {
          token,
          password,
        }
      );

      toast.success(
        response.data.message || "Password reset successfully."
      );

      setSuccess(true);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to reset your password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <PageShell pageSpot={pageSpot} onMouseMove={handlePageMouseMove}>
        <div className="relative z-10 w-full max-w-md bg-white rounded-[2rem] shadow-2xl shadow-black/10 p-8 text-center card-enter">
          <div className="mx-auto w-16 h-16 bg-[#F3E4DC] text-[#0B3D3A] rounded-full flex items-center justify-center mb-5">
            <FaCheckCircle size={28} />
          </div>

          <h1 className="font-display text-2xl font-bold text-[#0B3D3A]">
            Password Reset Successful
          </h1>

          <p className="font-body text-gray-500 mt-3">
            Your password has been updated successfully.
            You can now log in using your new password.
          </p>

          <button
            type="button"
            onClick={() => navigate("/login")}
            className="mt-7 w-full bg-[#0B3D3A] text-white py-3.5 rounded-xl font-body font-bold tracking-wide hover:bg-[#145C52] active:scale-[0.99] transition-all shadow-lg shadow-[#0B3D3A]/20"
          >
            Go to Login
          </button>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell pageSpot={pageSpot} onMouseMove={handlePageMouseMove}>
      {/* CARD */}
      <div className="relative z-10 w-full max-w-5xl bg-white rounded-[2rem] shadow-2xl shadow-black/10 overflow-hidden flex min-h-[600px]">

        {/* LEFT — brand / 3D stage (identical to Login) */}
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
          <div
            className="pointer-events-none absolute inset-0 transition-opacity duration-300"
            style={{
              background: `radial-gradient(320px circle at ${spot.x}% ${spot.y}%, rgba(255,178,39,0.16), transparent 70%)`,
            }}
          />

          <div className="relative z-20 w-full">
            <h1 className="font-display text-white text-4xl xl:text-5xl font-extrabold leading-[1.05] drop-shadow-sm">
              Hello,<br />Shoppie!
            </h1>
            <p className="font-body text-[#BFEDE4] text-base mt-3 max-w-sm">
              Your smarter way to shop.
            </p>
          </div>

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
                <div
                  className="blob absolute left-1/2 top-1/2 w-56 h-56 -translate-x-1/2 -translate-y-1/2 rounded-full"
                  style={{
                    background: "linear-gradient(135deg, #FFB627 0%, #FF6B5B 100%)",
                    opacity: 0.25,
                    filter: "blur(6px)",
                  }}
                />

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
            Almost there — set a fresh password ✨
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
              <FaKey className="text-[#FF6B5B]" size={18} />
              <span className="font-body text-sm font-semibold tracking-wide text-[#0B3D3A] uppercase">
                Account recovery
              </span>
            </div>

            <h2 className="font-display text-3xl font-bold text-[#0B3D3A] mb-2 lg:mb-3">
              Reset Password
            </h2>

            <p className="font-body text-gray-500 mb-8">
              Enter your new password below.
            </p>

            {!token ? (
              <div className="text-center py-4">
                <div className="mx-auto w-16 h-16 bg-[#F3E4DC] text-[#FF6B5B] rounded-full flex items-center justify-center mb-5">
                  <FaExclamationTriangle size={24} />
                </div>

                <p className="font-body text-gray-500 mb-6">
                  This password reset link is invalid or incomplete.
                </p>

                <Link
                  to="/forgot-password"
                  className="font-body font-bold text-[#FF6B5B] hover:underline"
                >
                  Request a new reset link
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block font-body text-sm font-semibold text-[#0B3D3A] mb-2">
                    New Password
                  </label>

                  <div className="flex items-center gap-3 border-2 border-gray-200 rounded-xl px-4 bg-white transition-all focus-within:border-[#FF6B5B] focus-within:shadow-[0_0_0_4px_rgba(255,107,91,0.12)]">
                    <FaLock className="text-gray-400" />

                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter new password"
                      autoComplete="new-password"
                      disabled={loading}
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

                <div>
                  <label className="block font-body text-sm font-semibold text-[#0B3D3A] mb-2">
                    Confirm New Password
                  </label>

                  <div className="flex items-center gap-3 border-2 border-gray-200 rounded-xl px-4 bg-white transition-all focus-within:border-[#FF6B5B] focus-within:shadow-[0_0_0_4px_rgba(255,107,91,0.12)]">
                    <FaLock className="text-gray-400" />

                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      autoComplete="new-password"
                      disabled={loading}
                      className="w-full py-3.5 outline-none font-body text-[#0B3D3A] placeholder:text-gray-400 bg-transparent"
                    />

                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((s) => !s)}
                      className="text-gray-400 hover:text-[#0B3D3A] transition"
                      aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                    >
                      {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#0B3D3A] text-white py-3.5 rounded-xl font-body font-bold tracking-wide hover:bg-[#145C52] active:scale-[0.99] transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-[#0B3D3A]/20"
                >
                  {loading ? "Resetting..." : "Reset Password"}
                </button>
              </form>
            )}

            <p className="text-center font-body text-gray-600 mt-8">
              <Link
                to="/login"
                className="text-[#FF6B5B] font-bold hover:underline"
              >
                ← Back to Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </PageShell>
  );
};

export default ResetPassword;