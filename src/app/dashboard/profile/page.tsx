"use client";

import { useEffect, useState } from "react";
import { useSession, authClient } from "@/lib/auth-client";
import { fetchWithAuth } from "@/lib/api";
import { uploadImageToImgBB } from "@/lib/imgbb";
import type { UserProfile } from "@/types";
import { toast } from "sonner";
import { Camera } from "lucide-react";
import Image from "next/image";

export default function UpdateProfilePage() {
  const { data: session } = useSession();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [area, setArea] = useState("");
  const [bio, setBio] = useState("");
  const [currentImage, setCurrentImage] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;
    fetchWithAuth("/api/users/me")
      .then((data: unknown) => {
        if (!active) return;
        const profile = data as UserProfile;
        setName(profile.name || "");
        setPhone(profile.phone || "");
        setArea(profile.area || "");
        setBio(profile.bio || "");
        setCurrentImage(profile.image || "");
      })
      .catch(() => {
        if (!active || !session?.user) return;
        setName(session.user.name || "");
        setCurrentImage(session.user.image || "");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [session?.user]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoFile(file);
    setCurrentImage(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Name cannot be empty");
      return;
    }

    setSaving(true);
    try {
      let imageUrl = currentImage;
      if (photoFile) {
        imageUrl = await uploadImageToImgBB(photoFile);
      }

      // 1. Update MongoDB via Express API
      await fetchWithAuth("/api/users/profile", {
        method: "PATCH",
        body: JSON.stringify({
          name: name.trim(),
          phone,
          area,
          bio,
          ...(imageUrl && !imageUrl.startsWith("blob:")
            ? { image: imageUrl }
            : {}),
        }),
      });

      // 2. Sync BetterAuth session so Navbar & Dashboard Top Bar update immediately without re-login
      await authClient.updateUser({
        name: name.trim(),
        ...(imageUrl && !imageUrl.startsWith("blob:")
          ? { image: imageUrl }
          : {}),
      });

      setPhotoFile(null);
      toast.success("Profile updated successfully!");
    } catch (err: unknown) {
      toast.error(
        err instanceof Error ? err.message : "Failed to update profile",
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto h-96 bg-white rounded-2xl border border-slate-200 animate-pulse" />
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">
          Update Profile
        </h1>
        <p className="text-sm text-slate-500">
          Manage your personal contact information, location area, and profile
          photo
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-5"
      >
        {/* Profile Avatar Upload */}
        <div className="flex items-center gap-5 pb-4 border-b border-slate-100">
          <div className="relative">
            <Image
              src={
                currentImage ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  name || "User",
                )}&background=2563eb&color=fff`
              }
              alt={name || "Profile"}
              className="w-20 h-20 rounded-full object-cover border-2 border-slate-200"
            />
            <label
              className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center cursor-pointer shadow-sm"
              title="Upload new photo"
            >
              <Camera className="w-4 h-4" />
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />
            </label>
          </div>
          <div>
            <h3 className="font-bold text-slate-900">{name || "User"}</h3>
            <p className="text-xs text-slate-500">
              Click the camera icon to upload a new photo via ImgBB
            </p>
          </div>
        </div>

        {/* Read-Only Email & Role */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">
              Email (Read-only)
            </label>
            <input
              type="email"
              readOnly
              value={session?.user?.email || ""}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-sm text-slate-600"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">
              Account Role (Read-only)
            </label>
            <input
              type="text"
              readOnly
              value={(session?.user?.role as string) || "customer"}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-sm text-slate-600 uppercase font-semibold"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Full Name *
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+880 1700-000000"
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              City / Area
            </label>
            <input
              type="text"
              value={area}
              onChange={(e) => setArea(e.target.value)}
              placeholder="e.g. Mirpur, Dhaka"
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Bio (Skills & Experience)
          </label>
          <textarea
            rows={3}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell customers about your repair specialties and years of experience..."
            className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white text-sm font-semibold rounded-xl transition"
          >
            {saving ? "Saving Profile..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
