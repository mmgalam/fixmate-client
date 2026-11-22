"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useSession, authClient } from "@/lib/auth-client";
import { fetchWithAuth } from "@/lib/api";
import { uploadImageToImgBB } from "@/lib/imgbb";
import type { UserProfile } from "@/types";
import { toast } from "sonner";
import { Camera } from "lucide-react";

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

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be under 5MB.");
      return;
    }

    if (currentImage.startsWith("blob:")) {
      URL.revokeObjectURL(currentImage);
    }

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

      const validImage =
        imageUrl && !imageUrl.startsWith("blob:") ? imageUrl : undefined;

      await fetchWithAuth("/api/users/profile", {
        method: "PATCH",
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          area: area.trim(),
          bio: bio.trim(),
          ...(validImage ? { image: validImage } : {}),
        }),
      });

      await authClient.updateUser({
        name: name.trim(),
        ...(validImage ? { image: validImage } : {}),
      });

      if (currentImage.startsWith("blob:")) {
        URL.revokeObjectURL(currentImage);
      }

      if (validImage) setCurrentImage(validImage);
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
      <div className="mx-auto h-96 max-w-2xl animate-pulse rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900" />
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1
          style={{ fontFamily: "var(--font-display)" }}
          className="text-2xl font-black text-slate-950 sm:text-3xl dark:text-white"
        >
          Update Profile
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Manage your personal contact information, location area, and profile
          photo.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-3d-card sm:p-8 dark:border-slate-800 dark:bg-slate-900"
      >
        <div className="flex flex-wrap items-center gap-5 border-b border-slate-100 pb-5 dark:border-slate-800">
          <div className="relative shrink-0">
            <Image
              src={
                currentImage ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  name || "User",
                )}&background=4f46e5&color=fff`
              }
              alt={name || "Profile"}
              width={80}
              height={80}
              unoptimized
              className="h-20 w-20 rounded-full border-2 border-slate-200 object-cover dark:border-slate-700"
            />
            <label
              className="absolute bottom-0 right-0 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-indigo-600 text-white shadow-md transition hover:bg-indigo-700"
              title="Upload new photo"
            >
              <Camera className="h-4 w-4" />
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />
            </label>
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white">
              {name || "User"}
            </h3>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              Click the camera icon to upload a new photo (JPG, PNG, WebP up to 5MB).
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-bold uppercase text-slate-400">
              Email (Read-only)
            </label>
            <input
              type="email"
              readOnly
              value={session?.user?.email || ""}
              className="w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-800/70 dark:text-slate-400"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-bold uppercase text-slate-400">
              Account Role (Read-only)
            </label>
            <input
              type="text"
              readOnly
              value={(session?.user?.role as string) || "customer"}
              className="w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-semibold uppercase text-slate-500 dark:border-slate-800 dark:bg-slate-800/70 dark:text-slate-400"
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-bold text-slate-700 dark:text-slate-300">
            Full Name *
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-slate-50/70 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 dark:border-slate-700 dark:bg-slate-950/70 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-cyan-400 dark:focus:ring-cyan-400/20"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-bold text-slate-700 dark:text-slate-300">
              Phone Number
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+880 1700-000000"
              className="w-full rounded-xl border border-slate-300 bg-slate-50/70 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 dark:border-slate-700 dark:bg-slate-950/70 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-cyan-400 dark:focus:ring-cyan-400/20"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-bold text-slate-700 dark:text-slate-300">
              City / Area
            </label>
            <input
              type="text"
              value={area}
              onChange={(e) => setArea(e.target.value)}
              placeholder="e.g. Mirpur, Dhaka"
              className="w-full rounded-xl border border-slate-300 bg-slate-50/70 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 dark:border-slate-700 dark:bg-slate-950/70 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-cyan-400 dark:focus:ring-cyan-400/20"
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-bold text-slate-700 dark:text-slate-300">
            Bio (Skills &amp; Experience)
          </label>
          <textarea
            rows={3}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell customers about your repair specialties and years of experience..."
            className="w-full rounded-xl border border-slate-300 bg-slate-50/70 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 dark:border-slate-700 dark:bg-slate-950/70 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-cyan-400 dark:focus:ring-cyan-400/20"
          />
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-linear-to-r from-indigo-600 to-cyan-600 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-indigo-600/25 transition hover:from-indigo-700 hover:to-cyan-700 disabled:opacity-60"
          >
            {saving ? "Saving Profile..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}