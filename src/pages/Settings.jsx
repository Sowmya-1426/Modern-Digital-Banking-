import { useState, useEffect } from "react"; 
import {
  User,
  Shield,
  Trash2,
  LogOut,
  Eye,
  EyeOff,
  X
} from "lucide-react";
import API from "../utils/api";
import { useNavigate } from "react-router-dom";

export default function Settings() {

  const navigate = useNavigate();

  /* ---------------- USER STATE ---------------- */
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [twoFA, setTwoFA] = useState(false);

  /* ---------------- PASSWORD STATE ---------------- */
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  /* ---------------- UI STATE ---------------- */
  const [editMode, setEditMode] = useState(false);
  const [securityEdit, setSecurityEdit] = useState(false);

  /* ---------------- MESSAGE MODAL ---------------- */
  const [message, setMessage] = useState("");
  const [showMessage, setShowMessage] = useState(false);

  const showPopup = (msg) => {
    setMessage(msg);
    setShowMessage(true);
  };

  /* ================= LOAD USER ================= */
  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await API.get("/users/me");
      setName(res.data.name);
      setEmail(res.data.email);
      setPhone(res.data.phone);
      setTwoFA(res.data.two_factor_enabled || false);
    } catch (err) {
      console.log(err);
    }
  };

  /* ================= PROFILE VALIDATION ================= */
  const validateProfile = () => {

  if (!name.trim())
    return "Full Name is required";

  if (!/^[A-Za-z\s]+$/.test(name))
    return "Only letters and spaces allowed";

  if (!/^[0-9]{10}$/.test(phone))
    return "Phone must be exactly 10 digits";

  return null;
};


  /* ================= PROFILE UPDATE ================= */
  const updateProfile = async () => {

    const error = validateProfile();
    if (error) {
      showPopup(error);
      return;
    }

    try {
      await API.put("/users/update-profile", { name, phone });
      setEditMode(false);
      showPopup("Profile updated successfully");
      fetchUser();
    } catch {
      showPopup("Failed to update profile");
    }
  };

  /* ================= PASSWORD UPDATE ================= */
  const updatePassword = async () => {

    if (newPassword !== confirmPassword) {
      showPopup("Passwords do not match");
      return;
    }

    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

    if (!passwordRegex.test(newPassword)) {
      showPopup(
        "Min 8 chars, include letter, number & special character"
      );
      return;
    }

    try {
      await API.put("/users/change-password", {
        current_password: currentPassword,
        new_password: newPassword
      });

      showPopup("Password updated successfully");
      cancelSecurityEdit();
    } catch (err) {
      showPopup(err.response?.data?.detail || "Error updating password");
    }
  };

  /* ================= CANCEL SECURITY ================= */
  const cancelSecurityEdit = () => {
    setSecurityEdit(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setShowPassword(false);
  };

  /* ================= TWO FACTOR ================= */
  const toggleTwoFA = async () => {
    try {
      const updated = !twoFA;
      setTwoFA(updated);
      await API.put("/users/two-factor", { enabled: updated });
    } catch {
      showPopup("Failed to update 2FA");
    }
  };

  

  /* ================= DELETE ACCOUNT ================= */
  const deleteAccount = async () => {
    try {
      await API.delete("/users/delete-account");
      localStorage.removeItem("token");
      navigate("/login");
    } catch (err) {
      showPopup(err.response?.data?.detail || "Failed to delete account");
    }
  };

  return (
    <div className="space-y-8 dark:text-white">

      {/* ================= MESSAGE MODAL ================= */}
      {showMessage && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg w-96 relative">

            <button
              onClick={() => setShowMessage(false)}
              className="absolute right-3 top-3 text-gray-500"
            >
              <X size={18} />
            </button>

            <p className="mb-6">{message}</p>

            <div className="text-right">
              <button
                onClick={() => setShowMessage(false)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Manage your account preferences
        </p>
      </div>

      {/* PROFILE */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="flex items-center gap-2 text-xl font-semibold">
            <User size={18} /> Profile
          </h2>

          {!editMode ? (
            <button
              onClick={() => setEditMode(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
              Edit
            </button>
          ) : (
            <button
              onClick={updateProfile}
              className="bg-green-600 text-white px-4 py-2 rounded-lg"
            >
              Update
            </button>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <input
            className="border p-3 rounded-lg dark:bg-gray-700"
            value={name}
            disabled={!editMode}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className="border p-3 rounded-lg dark:bg-gray-700"
            value={email}
            disabled
          />
        </div>

        <input
          className="border p-3 rounded-lg w-full dark:bg-gray-700"
          value={phone}
          disabled={!editMode}
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>

      {/* SECURITY */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="flex items-center gap-2 text-xl font-semibold">
            <Shield size={18} /> Security
          </h2>

          {!securityEdit && (
            <button
              onClick={() => setSecurityEdit(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
              Edit
            </button>
          )}
        </div>

        {securityEdit && (
          <div className="space-y-4">

            <input
              type="password"
              placeholder="Current Password"
              className="border p-3 rounded-lg w-full dark:bg-gray-700"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />

            <input
              type={showPassword ? "text" : "password"}
              placeholder="New Password"
              className="border p-3 rounded-lg w-full dark:bg-gray-700"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Confirm Password"
                className="border p-3 rounded-lg w-full dark:bg-gray-700"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-500"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div className="flex gap-3">
              <button
                onClick={updatePassword}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg"
              >
                Update Password
              </button>

              <button
                onClick={cancelSecurityEdit}
                className="border px-6 py-2 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="flex justify-between items-center bg-gray-100 dark:bg-gray-700 p-4 rounded-xl">
          <div>
            <h3 className="font-medium">Two-Factor Authentication</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Extra security for your account
            </p>
          </div>

          <button
            onClick={toggleTwoFA}
            className={`w-12 h-6 flex items-center rounded-full p-1 transition ${
              twoFA ? "bg-green-500" : "bg-gray-400"
            }`}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full transform transition ${
                twoFA ? "translate-x-6" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {/* DANGER ZONE */}
      <div className="bg-red-50 dark:bg-red-900 p-6 rounded-2xl space-y-4">
        <h2 className="text-red-600 font-bold text-lg">
          Danger Zone
        </h2>

        <div className="flex gap-4">
          <button
            onClick={deleteAccount}
            className="bg-red-600 text-white px-6 py-2 rounded-lg"
          >
            <Trash2 size={16} className="inline mr-2" />
            Delete Account
          </button>

        </div>
      </div>
    </div>
  );
}