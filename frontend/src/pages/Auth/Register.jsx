import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaLock,
  FaUserPlus,
  FaEye,
  FaEyeSlash,
  FaShoppingBag,
} from "react-icons/fa";
import { toast } from "react-toastify";

import { registerUser } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";

function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const stageRef = useRef(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [spot, setSpot] = useState({ x: 50, y: 50 });
  const [pageSpot, setPageSpot] = useState({ x: 50, y: 30 });

  const handleStageMouseMove = (e) => {
    const rect = stageRef.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;

    setTilt({ x: (py - 0.5) * -12, y: (px - 0.5) * 12 });
    setSpot({ x: px * 100, y: py * 100 });
  };

  const handleStageMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setSpot({ x: 50, y: 50 });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (Object.values(formData).some((value) => !value)) {
      toast.error("Please fill in all fields");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      const userData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      };
      const data = await registerUser(userData);

      if (data.success) {
        login(data);
        toast.success(data.message || "Registration Successful");
        navigate("/");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Unable to register. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { label: "Full Name", icon: FaUser, name: "name", type: "text", placeholder: "Enter your full name" },
    { label: "Email Address", icon: FaEnvelope, name: "email", type: "email", placeholder: "you@example.com" },
    { label: "Phone Number", icon: FaPhone, name: "phone", type: "tel", placeholder: "Enter your phone number" },
  ];

  return (
    <div
      onMouseMove={(e) => setPageSpot({ x: (e.clientX / window.innerWidth) * 100, y: (e.clientY / window.innerHeight) * 100 })}
      className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#FFF3E6] px-4 py-10 font-[Jakarta]"
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@500;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .font-display { font-family: 'Baloo 2', system-ui, sans-serif; }
        .font-body { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; }
        @keyframes floatChip { 0%,100% { transform: translateY(0) translateZ(80px); } 50% { transform: translateY(-8px) translateZ(80px); } }
        @keyframes blobPulse { 0%,100% { transform: scale(1) translateZ(-60px); } 50% { transform: scale(1.08) translateZ(-60px); } }
        @keyframes bagRise { from { opacity: 0; transform: translateY(24px) scale(.92); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes cardRise { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        .chip { animation: floatChip 4.8s ease-in-out infinite; }
        .blob { animation: blobPulse 6s ease-in-out infinite; }
        .bag-enter { animation: bagRise .9s cubic-bezier(.16,1,.3,1) both; }
        .card-enter { animation: cardRise .7s cubic-bezier(.16,1,.3,1) both; }
      `}</style>

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 -top-20 h-80 w-80 rounded-full opacity-35" style={{ background: "linear-gradient(135deg,#FF6B5B,#FFB627)" }} />
        <div className="absolute right-[-6rem] top-10 h-72 w-72 rounded-full opacity-30" style={{ background: "linear-gradient(135deg,#FFB627,#FF6B5B)" }} />
        <div className="absolute bottom-[-5rem] left-[10%] h-96 w-96 rounded-full opacity-20" style={{ background: "linear-gradient(135deg,#145C52,#FFB627)" }} />
      </div>
      <div className="pointer-events-none absolute inset-0 z-[5]" style={{ background: `radial-gradient(500px circle at ${pageSpot.x}% ${pageSpot.y}%, rgba(255,107,91,.14), transparent 70%)` }} />

      <div className="relative z-10 flex min-h-[660px] w-full max-w-5xl overflow-hidden rounded-[2rem] bg-white shadow-2xl shadow-black/10">
        <div
          ref={stageRef}
          onMouseMove={handleStageMouseMove}
          onMouseLeave={handleStageMouseLeave}
          className="relative hidden w-[46%] flex-col justify-between overflow-hidden px-10 py-12 lg:flex"
          style={{ background: "radial-gradient(120% 120% at 15% 10%, #145C52 0%, #0B3D3A 55%, #082B28 100%)" }}
        >
          <div className="pointer-events-none absolute inset-0" style={{ background: `radial-gradient(320px circle at ${spot.x}% ${spot.y}%, rgba(255,178,39,.16), transparent 70%)` }} />
          <div className="relative z-20">
            <h1 className="font-display text-4xl font-extrabold leading-[1.05] text-white xl:text-5xl">Join,<br />Shoppie!</h1>
            <p className="font-body mt-3 max-w-sm text-base text-[#BFEDE4]">Create your account and start shopping smarter.</p>
          </div>
          <div className="relative z-10 flex flex-1 items-center justify-center" style={{ perspective: "1200px" }}>
            <div className="relative h-[300px] w-[300px]">
              <div className="bag-enter relative h-full w-full transition-transform duration-200 ease-out" style={{ transformStyle: "preserve-3d", transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }}>
                <div className="blob absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-25 blur-md" style={{ background: "linear-gradient(135deg,#FFB627,#FF6B5B)" }} />
                <div className="absolute left-1/2 top-1/2 flex h-40 w-40 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-[2rem] shadow-2xl" style={{ transform: "translateZ(60px)", background: "linear-gradient(160deg,#FFCF6B,#FF6B5B)", boxShadow: "0 30px 60px -15px rgba(0,0,0,.5)" }}>
                  <FaShoppingBag className="text-white" size={56} />
                </div>
                <div className="chip absolute right-6 top-9 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 text-[#FFCF6B] backdrop-blur-sm" style={{ transform: "translateZ(100px)" }}><FaUserPlus size={20} /></div>
              </div>
            </div>
          </div>
          <p className="relative z-20 font-body text-xs text-[#7FB8AE]">Everything you love, all in one place.</p>
        </div>

        <div className="flex flex-1 items-center justify-center px-6 py-10 sm:px-10">
          <div className="card-enter w-full max-w-md">
            <div className="mb-7 text-center lg:hidden">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0B3D3A] text-white shadow-lg"><FaShoppingBag size={22} /></div>
              <h1 className="font-display text-3xl font-extrabold text-[#0B3D3A]">Join, Shoppie!</h1>
              <p className="font-body mt-1 text-gray-500">Start shopping smarter today.</p>
            </div>
            <div className="mb-6 hidden items-center gap-2 lg:flex"><FaUserPlus className="text-[#FF6B5B]" size={18} /><span className="font-body text-sm font-semibold uppercase tracking-wide text-[#0B3D3A]">New here</span></div>
            <h2 className="font-display mb-6 text-3xl font-bold text-[#0B3D3A] lg:block">Create your account</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {fields.map(({ label, icon: Icon, name, type, placeholder }) => (
                <div key={name}>
                  <label className="font-body mb-2 block text-sm font-semibold text-[#0B3D3A]">{label}</label>
                  <div className="flex items-center gap-3 rounded-xl border-2 border-gray-200 bg-white px-4 transition-all focus-within:border-[#FF6B5B] focus-within:shadow-[0_0_0_4px_rgba(255,107,91,.12)]">
                    <Icon className="text-gray-400" />
                    <input type={type} name={name} value={formData[name]} onChange={handleChange} placeholder={placeholder} className="font-body w-full bg-transparent py-3 outline-none text-[#0B3D3A] placeholder:text-gray-400" />
                  </div>
                  {name === "phone" && <p className="font-body mt-1 text-xs text-gray-500">Required for delivery and order communication.</p>}
                </div>
              ))}

              {[{ label: "Password", name: "password", placeholder: "Minimum 6 characters", shown: showPassword, toggle: () => setShowPassword((value) => !value) }, { label: "Confirm Password", name: "confirmPassword", placeholder: "Re-enter your password", shown: showConfirmPassword, toggle: () => setShowConfirmPassword((value) => !value) }].map(({ label, name, placeholder, shown, toggle }) => (
                <div key={name}>
                  <label className="font-body mb-2 block text-sm font-semibold text-[#0B3D3A]">{label}</label>
                  <div className="flex items-center gap-3 rounded-xl border-2 border-gray-200 bg-white px-4 transition-all focus-within:border-[#FF6B5B] focus-within:shadow-[0_0_0_4px_rgba(255,107,91,.12)]">
                    <FaLock className="text-gray-400" />
                    <input type={shown ? "text" : "password"} name={name} value={formData[name]} onChange={handleChange} placeholder={placeholder} className="font-body w-full bg-transparent py-3 outline-none text-[#0B3D3A] placeholder:text-gray-400" />
                    <button type="button" onClick={toggle} className="text-gray-400 transition hover:text-[#0B3D3A]" aria-label={shown ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`}>{shown ? <FaEyeSlash /> : <FaEye />}</button>
                  </div>
                </div>
              ))}

              <button type="submit" disabled={loading} className="font-body w-full rounded-xl bg-[#0B3D3A] py-3.5 font-bold tracking-wide text-white shadow-lg shadow-[#0B3D3A]/20 transition-all hover:bg-[#145C52] active:scale-[.99] disabled:cursor-not-allowed disabled:opacity-60">
                {loading ? "Creating account..." : "Create Account"}
              </button>
            </form>
            <p className="font-body mt-7 text-center text-gray-600">Already have an account? <Link to="/login" className="font-bold text-[#FF6B5B] hover:underline">Log in</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
