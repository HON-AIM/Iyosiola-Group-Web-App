"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const { data: session, update } = useSession();
  const router = useRouter();
  
  const [profileData, setProfileData] = useState({
    name: session?.user?.name || "",
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const res = await fetch("/api/user/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: profileData.name }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({ type: "success", text: "Profile updated successfully." });
        // Update NextAuth session to reflect new name
        await update({ name: data.name });
        router.refresh();
      } else {
        setMessage({ type: "error", text: data.message || "Something went wrong." });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Network error occurred." });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: "error", text: "New passwords do not match." });
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/user/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            currentPassword: passwordData.currentPassword,
            newPassword: passwordData.newPassword 
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({ type: "success", text: "Password changed successfully." });
        setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      } else {
        setMessage({ type: "error", text: data.message || "Failed to update password." });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Network error occurred." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 min-h-[400px]">
      <div className="border-b border-gray-100 pb-4 mb-6">
         <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>
      </div>

      {message.text && (
          <div className={`mb-6 p-4 rounded-md text-sm ${message.type === 'error' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-green-50 text-green-700 border-green-200'} border`}>
              {message.text}
          </div>
      )}

      <div className="space-y-10">
          {/* Profile Details Section */}
          <section>
              <h2 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">Personal Data</h2>
              <form onSubmit={handleProfileSubmit} className="max-w-lg space-y-4">
                  <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                      <input 
                        type="text" name="name" value={profileData.name} onChange={handleProfileChange} required
                        className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:ring-primary-500 focus:border-primary-500" 
                      />
                  </div>
                  <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                      <input 
                        type="email" value={session?.user?.email || ""} disabled
                        className="w-full border border-gray-200 bg-gray-50 rounded-md px-4 py-2 text-sm text-gray-500 cursor-not-allowed" 
                      />
                      <p className="mt-1 text-xs text-gray-500">Email addresses cannot be changed directly for security reasons.</p>
                  </div>
                  
                  <div className="pt-2">
                       <button 
                        type="submit" disabled={loading}
                        className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-md font-medium transition-colors disabled:opacity-50"
                       >
                          Update Profile
                       </button>
                  </div>
              </form>
          </section>

          {/* Password Section */}
          <section>
              <h2 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">Change Password</h2>
              <form onSubmit={handlePasswordSubmit} className="max-w-lg space-y-4">
                  <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                      <input 
                        type="password" name="currentPassword" value={passwordData.currentPassword} onChange={handlePasswordChange} required
                        className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:ring-primary-500 focus:border-primary-500" 
                      />
                  </div>
                  <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                      <input 
                        type="password" name="newPassword" value={passwordData.newPassword} onChange={handlePasswordChange} required minLength={8}
                        className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:ring-primary-500 focus:border-primary-500" 
                      />
                  </div>
                  <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                      <input 
                        type="password" name="confirmPassword" value={passwordData.confirmPassword} onChange={handlePasswordChange} required minLength={8}
                        className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:ring-primary-500 focus:border-primary-500" 
                      />
                  </div>
                  
                  <div className="pt-2">
                       <button 
                        type="submit" disabled={loading || !passwordData.currentPassword || !passwordData.newPassword}
                        className="bg-gray-800 hover:bg-gray-900 text-white px-6 py-2 rounded-md font-medium transition-colors disabled:opacity-50"
                       >
                          Change Password
                       </button>
                  </div>
              </form>
          </section>
      </div>
    </div>
  );
}
