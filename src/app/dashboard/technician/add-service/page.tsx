"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { uploadImageToImgBB } from "@/lib/imgbb";
import { fetchWithAuth } from "@/lib/api";
import { toast } from "sonner";
import { UploadCloud, PlusCircle } from "lucide-react";

const CATEGORIES = [
  "Smartphone",
  "Laptop & PC",
  "AC",
  "Refrigerator",
  "TV",
  "Washing Machine",
  "Electrical",
];

export default function AddServicePage() {
  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user;

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Smartphone");
  const [description, setDescription] = useState("");
  const [basePrice, setBasePrice] = useState("");
  const [estimatedDuration, setEstimatedDuration] = useState("1-2 Hours");
  const [serviceMode, setServiceMode] = useState<
    "Home Visit" | "Shop Drop-off"
  >("Home Visit");
  const [serviceArea, setServiceArea] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageFile) {
      toast.error("Please select a service image file");
      return;
    }
    if (Number(basePrice) <= 0) {
      toast.error("Base price must be a positive number");
      return;
    }

    setSubmitting(true);
    try {
      const imageUrl = await uploadImageToImgBB(imageFile);

      await fetchWithAuth("/api/services", {
        method: "POST",
        body: JSON.stringify({
          title: title.trim(),
          category,
          description: description.trim(),
          image: imageUrl,
          basePrice: Number(basePrice),
          estimatedDuration: estimatedDuration.trim(),
          serviceMode,
          serviceArea: serviceArea.trim(),
          technicianName: user?.name || "Technician",
        }),
      });

      toast.success("Service submitted! It is now waiting for admin approval.");
      router.push("/dashboard/technician/my-services");
    } catch (err: unknown) {
      toast.error(
        err instanceof Error ? err.message : "Failed to create service",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1
          style={{ fontFamily: "var(--font-display)" }}
          className="text-2xl font-black text-slate-950 dark:text-white"
        >
          Add a Repair Service
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          New listings remain pending until reviewed and approved by an Admin.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-3d-card space-y-5"
      >
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Service Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. iPhone 15 Pro OLED Screen Replacement"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Category *
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">
            Description *
          </label>
          <textarea
            rows={4}
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe what is included, warranty, and tools/parts used..."
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent text-sm"
          />
        </div>

        <div className="grid sm:grid-cols-3 gap-5">
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Base Price (USD) *
            </label>
            <input
              type="number"
              required
              min="1"
              step="0.01"
              value={basePrice}
              onChange={(e) => setBasePrice(e.target.value)}
              placeholder="45"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Estimated Duration *
            </label>
            <input
              type="text"
              required
              value={estimatedDuration}
              onChange={(e) => setEstimatedDuration(e.target.value)}
              placeholder="e.g. 1-2 Hours"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Service Mode *
            </label>
            <select
              value={serviceMode}
              onChange={(e) =>
                setServiceMode(e.target.value as "Home Visit" | "Shop Drop-off")
              }
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm"
            >
              <option value="Home Visit">Home Visit</option>
              <option value="Shop Drop-off">Shop Drop-off</option>
            </select>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Service Area *
            </label>
            <input
              type="text"
              required
              value={serviceArea}
              onChange={(e) => setServiceArea(e.target.value)}
              placeholder="e.g. Dhanmondi, Mirpur, Uttara"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Service Image (ImgBB Upload) *
            </label>
            <label className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border border-dashed border-indigo-400 dark:border-cyan-500/50 bg-indigo-50/40 dark:bg-slate-800/60 cursor-pointer text-sm">
              <UploadCloud className="w-4 h-4 text-indigo-600 dark:text-cyan-400 shrink-0" />
              <span className="truncate text-slate-700 dark:text-slate-300">
                {imageFile ? imageFile.name : "Choose image file..."}
              </span>
              <input
                type="file"
                accept="image/*"
                required
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                className="hidden"
              />
            </label>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-5 pt-2">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
              Technician Name (Read-Only)
            </label>
            <input
              type="text"
              readOnly
              value={user?.name || ""}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 text-sm cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
              Technician Email (Read-Only)
            </label>
            <input
              type="text"
              readOnly
              value={user?.email || ""}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 text-sm cursor-not-allowed"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-linear-to-r from-indigo-600 to-cyan-600 hover:from-indigo-700 hover:to-cyan-700 text-white text-sm font-bold shadow-lg shadow-indigo-600/25 transition disabled:opacity-60"
        >
          <PlusCircle className="w-4 h-4" />
          {submitting ? "Uploading & Saving..." : "Publish Service"}
        </button>
      </form>
    </div>
  );
}
