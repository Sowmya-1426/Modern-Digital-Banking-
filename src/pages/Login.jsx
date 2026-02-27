import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [dark, setDark] = useState(false);
  const [step, setStep] = useState("login"); // login | otp

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");

  const [captchaText, setCaptchaText] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");

  const [generatedOTP, setGeneratedOTP] = useState("");

  useEffect(() => {
    generateCaptcha();
  }, []);

  // CAPTCHA
  const generateCaptcha = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz";
    let result = "";
    for (let i = 0; i < 5; i++) {
      result += chars[Math.floor(Math.random() * chars.length)];
    }
    setCaptchaText(result);
    setCaptchaInput("");
  };

  // OTP generator
  const generateOTP = () =>
    Math.floor(100000 + Math.random() * 900000).toString();

  // LOGIN
  const sendOTP = async () => {
    if (!username || !password) {
      alert("Enter email and password");
      return;
    }

    if (captchaInput !== captchaText) {
      alert("Captcha does not match");
      generateCaptcha();
      return;
    }

    try {
      const formData = new URLSearchParams();
      formData.append("username", username);
      formData.append("password", password);

      const res = await fetch("http://localhost:8000/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData,
      });

      if (!res.ok) throw new Error();

      const data = await res.json();
      localStorage.setItem("token", data.access_token);

      const newOTP = generateOTP();
      setGeneratedOTP(newOTP);

      alert(`OTP sent to registered mobile (Demo): ${newOTP}`);
      setStep("otp");
    } catch {
      alert("Invalid email or password");
    }
  };

  // VERIFY OTP
  const verifyOTP = () => {
    if (otp === generatedOTP) {
      alert("Login successful ✅");
      setTimeout(() => navigate("/dashboard"), 1000);
    } else {
      alert("Invalid OTP");
    }
  };

  const backToLogin = () => {
    setOtp("");
    setGeneratedOTP("");
    generateCaptcha();
    setStep("login");
  };

  return (
    <div className={dark ? "dark" : ""}>
      <div
        className={`min-h-screen flex items-center justify-center transition-colors
        ${
          dark
            ? "bg-gradient-to-br from-blue-900 via-slate-900 to-black"
            : "bg-gradient-to-br from-blue-100 via-white to-indigo-200"
        }`}
      >
        <div
          className={`relative rounded-2xl shadow-xl w-full max-w-md p-8
          ${dark ? "bg-slate-900 text-white" : "bg-white text-black"}`}
        >
          {/* THEME TOGGLE */}
          <button
            onClick={() => setDark(!dark)}
            className="absolute top-4 right-4 text-xl"
          >
            {dark ? "🌙" : "☀️"}
          </button>

          <h2 className="text-2xl font-bold text-center mb-6">
            Secure Bank Login
          </h2>

          {/* LOGIN */}
          {step === "login" && (
            <div className="space-y-4">
              <Input
                label="Email"
                value={username}
                onChange={setUsername}
                dark={dark}
              />
              <Input
                label="Password"
                type="password"
                value={password}
                onChange={setPassword}
                dark={dark}
              />

              {/* CAPTCHA */}
              <div>
                <label
                  className={`text-sm ${
                    dark ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Captcha
                </label>

                <div className="flex items-center gap-2 mt-1">
                  <div
                    className={`px-4 py-2 rounded font-bold tracking-widest
                    ${dark ? "bg-slate-700 text-white" : "bg-gray-200 text-black"}`}
                  >
                    {captchaText}
                  </div>
                  <button onClick={generateCaptcha}>🔄</button>
                </div>

                <input
                  value={captchaInput}
                  onChange={(e) => setCaptchaInput(e.target.value)}
                  placeholder="Enter captcha"
                  className={`w-full mt-2 px-4 py-2 rounded border outline-none
                  ${
                    dark
                      ? "bg-slate-800 text-white placeholder-gray-400 border-slate-600"
                      : "bg-white text-black placeholder-gray-500 border-gray-300"
                  }`}
                />
              </div>

              <button
                onClick={sendOTP}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
              >
                Login with OTP
              </button>

              <p className="text-center text-sm mt-4">
                Don’t have an account?{" "}
                <span
                  onClick={() => navigate("/register")}
                  className="text-blue-500 cursor-pointer hover:underline"
                >
                  Register
                </span>
              </p>
            </div>
          )}

          {/* OTP */}
          {step === "otp" && (
            <div className="space-y-4 text-center">
              <p className={dark ? "text-gray-300" : "text-gray-700"}>
                Enter OTP
              </p>

              <input
                value={otp}
                maxLength={6}
                onChange={(e) => setOtp(e.target.value)}
                className={`w-full text-center text-xl px-4 py-2 rounded border
                ${
                  dark
                    ? "bg-slate-800 text-white border-slate-600"
                    : "bg-white text-black border-gray-300"
                }`}
              />

              <button
                onClick={verifyOTP}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded"
              >
                Verify OTP
              </button>

              <button
                onClick={backToLogin}
                className="text-blue-500 text-sm hover:underline"
              >
                ← Back to Login
              </button>
            </div>
          )}

          <p className="text-xs text-center mt-6 opacity-70">
            Secure Digital Banking Portal
          </p>
        </div>
      </div>
    </div>
  );
}

// INPUT COMPONENT
function Input({ label, type = "text", value, onChange, dark }) {
  return (
    <div>
      <label
        className={`text-sm ${dark ? "text-gray-300" : "text-gray-700"}`}
      >
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full px-4 py-2 rounded border outline-none
        ${
          dark
            ? "bg-slate-800 text-white placeholder-gray-400 border-slate-600"
            : "bg-white text-black placeholder-gray-500 border-gray-300"
        }`}
      />
    </div>
  );
}
