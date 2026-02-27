import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../utils/api";

export default function Register() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [agree, setAgree] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errors, setErrors] = useState({});

  /* ================= VALIDATION ================= */

  const validate = () => {
    let newErrors = {};

    if (!fullName.trim())
      newErrors.fullName = "Full Name is required";
    else if (!/^[A-Za-z\s]+$/.test(fullName))
      newErrors.fullName = "Only letters and spaces allowed";

    if (!email.trim())
      newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      newErrors.email = "Enter valid email (example@gmail.com)";

    if (!phone.trim())
      newErrors.phone = "Phone number is required";
    else if (!/^[0-9]{10}$/.test(phone))
      newErrors.phone = "Phone must be exactly 10 digits";

    if (!password.trim())
      newErrors.password = "Password is required";
    else if (
      !/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@#$!%*?&]).{8,}$/.test(password)
    )
      newErrors.password =
        "Min 8 chars, include uppercase, lowercase, number & special character";

    if (!confirmPassword.trim())
      newErrors.confirmPassword = "Confirm Password is required";
    else if (password !== confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    if (!agree)
      newErrors.agree = "You must accept Terms & Privacy Policy";

    return newErrors;
  };

  /* ================= REGISTER ================= */

  const handleRegister = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    try {
      await API.post("/users/register", {
        name: fullName,
        email,
        phone,
        password,
      });

      setShowSuccess(true);
    } catch (err) {
      const message =
        err?.response?.data?.detail || "Registration failed. Try again.";
      alert(message);
    }
  };

  /* ================= AUTO REDIRECT ================= */

  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => {
        navigate("/login");
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [showSuccess, navigate]);

  const handleChange = (setter, field) => (value) => {
    setter(value);
    setErrors((prev) => {
      const updated = { ...prev };
      delete updated[field];
      return updated;
    });
  };

  /* ================= UI ================= */

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-slate-900 to-black" />
      <div className="absolute inset-0 bg-black/30" />

      <div className="relative z-10 min-h-screen flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">

          <div className="flex flex-col items-center mb-6">
            <div className="h-16 w-16 rounded-full bg-blue-900 text-white flex items-center justify-center text-3xl font-bold">
              🏦
            </div>
            <h2 className="mt-3 text-2xl font-bold">Create Account</h2>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">

            <FormInput
              label="Full Name"
              value={fullName}
              onChange={handleChange(setFullName, "fullName")}
              error={errors.fullName}
            />

            <FormInput
              label="Email Address"
              value={email}
              onChange={handleChange(setEmail, "email")}
              error={errors.email}
            />

            <FormInput
              label="Phone Number"
              value={phone}
              onChange={handleChange(setPhone, "phone")}
              error={errors.phone}
            />

            <FormInput
              label="Password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={handleChange(setPassword, "password")}
              error={errors.password}
              showToggle
              toggle={() => setShowPassword(!showPassword)}
            />

            <FormInput
              label="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={handleChange(setConfirmPassword, "confirmPassword")}
              error={errors.confirmPassword}
            />

            {errors.agree && (
              <p className="text-red-500 text-sm">{errors.agree}</p>
            )}

            <label className="flex gap-2 text-sm mt-2">
              <input
                type="checkbox"
                checked={agree}
                onChange={() => setAgree(!agree)}
              />
              I agree to the Terms of Service and Privacy Policy
            </label>

            <button className="bg-green-600 hover:bg-green-700 text-white w-full p-2 rounded">
              Create Account
            </button>

            <p className="text-sm text-center mt-4">
              Already registered?{" "}
              <Link to="/login" className="text-blue-600">
                Login
              </Link>
            </p>

          </form>
        </div>
      </div>

      {/* ================= SUCCESS MODAL ================= */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl text-center w-[320px]">
            <div className="text-4xl text-green-600 mb-3">✔</div>
            <h2 className="text-lg font-bold mb-1">
              Registration Successful
            </h2>
            <p className="text-sm text-gray-600">
              Redirecting to login...
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

/* ================= INPUT COMPONENT ================= */

function FormInput({
  label,
  value,
  onChange,
  error,
  type = "text",
  showToggle,
  toggle,
}) {
  const isValid = value && !error;

  return (
    <div className="relative">
      <label className="block text-sm font-medium mb-1">{label}</label>

      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full border rounded-lg px-4 py-2 pr-10
          ${error ? "border-red-500" : ""}
          ${isValid ? "border-green-500" : ""}
        `}
      />

      {isValid && (
        <span className="absolute right-3 top-9 text-green-500">✔</span>
      )}

      {showToggle && (
        <span
          onClick={toggle}
          className="absolute right-3 top-9 cursor-pointer"
        >
          👁️
        </span>
      )}

      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
    </div>
  );
}
