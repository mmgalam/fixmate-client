"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
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
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please choose a valid image file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image file must be smaller than 5MB.");
      return;
    }

    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

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

      if (previewUrl) URL.revokeObjectURL(previewUrl);
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
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1
          style={{ fontFamily: "var(--font-display)" }}
          className="text-2xl font-black text-slate-950 sm:text-3xl dark:text-white"
        >
          Add a Repair Service
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          New listings remain pending until reviewed and approved by an Admin.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-3d-card sm:p-8 dark:border-slate-800 dark:bg-slate-900"
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-bold text-slate-700 dark:text-slate-300">
              Service Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. iPhone 15 Pro OLED Screen Replacement"
              className="w-full rounded-xl border border-slate-300 bg-slate-50/70 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 dark:border-slate-700 dark:bg-slate-950/70 dark:text-white dark:placeholder:text-slate-500"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-bold text-slate-700 dark:text-slate-300">
              Category *
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
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
          <label className="mb-1.5 block text-sm font-bold text-slate-700 dark:text-slate-300">
            Description *
          </label>
          <textarea
            rows={4}
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe what is included, warranty, and tools/parts used..."
            className="w-full rounded-xl border border-slate-300 bg-slate-50/70 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 dark:border-slate-700 dark:bg-slate-950/70 dark:text-white dark:placeholder:text-slate-500"
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-3">
          <div>
            <label className="mb-1.5 block text-sm font-bold text-slate-700 dark:text-slate-300">
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
              className="w-full rounded-xl border border-slate-300 bg-slate-50/70 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 dark:border-slate-700 dark:bg-slate-950/70 dark:text-white dark:placeholder:text-slate-500"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-bold text-slate-700 dark:text-slate-300">
              Estimated Duration *
            </label>
            <input
              type="text"
              required
              value={estimatedDuration}
              onChange={(e) => setEstimatedDuration(e.target.value)}
              placeholder="e.g. 1-2 Hours"
              className="w-full rounded-xl border border-slate-300 bg-slate-50/70 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 dark:border-slate-700 dark:bg-slate-950/70 dark:text-white dark:placeholder:text-slate-500"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-bold text-slate-700 dark:text-slate-300">
              Service Mode *
            </label>
            <select
              value={serviceMode}
              onChange={(e) =>
                setServiceMode(e.target.value as "Home Visit" | "Shop Drop-off")
              }
              className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            >
              <option value="Home Visit">Home Visit</option>
              <option value="Shop Drop-off">Shop Drop-off</option>
            </select>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-bold text-slate-700 dark:text-slate-300">
              Service Area *
            </label>
            <input
              type="text"
              required
              value={serviceArea}
              onChange={(e) => setServiceArea(e.target.value)}
              placeholder="e.g. Dhanmondi, Mirpur, Uttara"
              className="w-full rounded-xl border border-slate-300 bg-slate-50/70 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 dark:border-slate-700 dark:bg-slate-950/70 dark:text-white dark:placeholder:text-slate-500"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-bold text-slate-700 dark:text-slate-300">
              Service Image (ImgBB Upload) *
            </label>
            <label className="flex cursor-pointer items-center gap-2.5 rounded-xl border border-dashed border-indigo-400 bg-indigo-50/40 px-3.5 py-2.5 text-sm transition hover:bg-indigo-50 dark:border-cyan-500/50 dark:bg-slate-800/60 dark:hover:bg-slate-800">
              <UploadCloud className="h-4 w-4 shrink-0 text-indigo-600 dark:text-cyan-400" />
              <span className="truncate text-slate-700 dark:text-slate-300">
                {imageFile ? imageFile.name : "Choose image file..."}
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {previewUrl && (
          <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700">
            <div className="relative h-44 w-full bg-slate-900">
              <Image
                src={previewUrl}
                alt="Service preview"
                fill
                unoptimized
                className="object-cover"
              />
            </div>
          </div>
        )}

        <div className="grid gap-5 pt-2 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-bold uppercase text-slate-400">
              Technician Name (Read-Only)
            </label>
            <input
              type="text"
              readOnly
              value={user?.name || ""}
              className="w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-100 px-3.5 py-2 text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-800/70 dark:text-slate-400"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-bold uppercase text-slate-400">
              Technician Email (Read-Only)
            </label>
            <input
              type="text"
              readOnly
              value={user?.email || ""}
              className="w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-100 px-3.5 py-2 text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-800/70 dark:text-slate-400"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-indigo-600 to-cyan-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-600/25 transition hover:from-indigo-700 hover:to-cyan-700 disabled:opacity-60"
        >
          <PlusCircle className="h-4 w-4" />
          {submitting ? "Uploading & Saving..." : "Publish Service"}
        </button>
      </form>
    </div>
  );
}