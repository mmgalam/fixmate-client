"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { fetchWithAuth } from "@/lib/api";
import { uploadImageToImgBB } from "@/lib/imgbb";
import type { ServiceCategory, ServiceMode } from "@/types";
import { toast } from "sonner";
import { Upload, ImageIcon } from "lucide-react";
import Image from "next/image";

const CATEGORIES: ServiceCategory[] = [
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

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<ServiceCategory>("Smartphone");
  const [description, setDescription] = useState("");
  const [basePrice, setBasePrice] = useState("");
  const [estimatedDuration, setEstimatedDuration] = useState("");
  const [serviceMode, setServiceMode] = useState<ServiceMode>("Home Visit");
  const [serviceArea, setServiceArea] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!imageFile) {
      toast.error("Please select a service banner image to upload.");
      return;
    }

    if (Number(basePrice) <= 0) {
      toast.error("Base price must be a positive number.");
      return;
    }

    setSubmitting(true);
    try {
      // 1. Upload image file directly to ImgBB
      const uploadedImageUrl = await uploadImageToImgBB(imageFile);

      // 2. Save service in MongoDB (starts as 'pending' approval)
      await fetchWithAuth("/api/services", {
        method: "POST",
        body: JSON.stringify({
          title,
          category,
          description,
          image: uploadedImageUrl,
          basePrice: Number(basePrice),
          estimatedDuration,
          serviceMode,
          serviceArea,
        }),
      });

      toast.success("Service submitted! Waiting for admin approval.");
      router.push("/dashboard/technician/my-services");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to create service";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">
          Add a Repair Service
        </h1>
        <p className="text-sm text-slate-500">
          New services remain pending until verified and approved by an Admin
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-5"
      >
        {/* Read-only Technician Info from Session */}
        <div className="grid sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">
              Technician Name (Read-only)
            </label>
            <input
              type="text"
              readOnly
              value={session?.user?.name || ""}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm text-slate-600"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">
              Technician Email (Read-only)
            </label>
            <input
              type="email"
              readOnly
              value={session?.user?.email || ""}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm text-slate-600"
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Service Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. iPhone Screen Replacement"
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Category *
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as ServiceCategory)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
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
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Estimated Duration *
            </label>
            <input
              type="text"
              required
              value={estimatedDuration}
              onChange={(e) => setEstimatedDuration(e.target.value)}
              placeholder="e.g. 2-3 hours"
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Service Mode *
            </label>
            <select
              value={serviceMode}
              onChange={(e) => setServiceMode(e.target.value as ServiceMode)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="Home Visit">Home Visit</option>
              <option value="Shop Drop-off">Shop Drop-off</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Service Coverage Area *
          </label>
          <input
            type="text"
            required
            value={serviceArea}
            onChange={(e) => setServiceArea(e.target.value)}
            placeholder="e.g. Dhanmondi, Mirpur, Uttara"
            className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Service Description *
          </label>
          <textarea
            rows={4}
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe what is included in this repair service, warranty on parts, etc."
            className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        {/* ImgBB File Upload Input */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Service Banner Image (Upload via ImgBB) *
          </label>
          <label className="mt-1 flex flex-col items-center justify-center border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-xl p-6 cursor-pointer transition bg-slate-50/50">
            {previewUrl ? (
              <Image
                src={previewUrl}
                alt="Preview"
                className="h-40 w-full max-w-sm object-cover rounded-lg mb-2"
              />
            ) : (
              <ImageIcon className="w-10 h-10 text-slate-400 mb-2" />
            )}
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600">
              <Upload className="w-4 h-4" />
              {imageFile
                ? imageFile.name
                : "Choose an image file (JPG, PNG, WEBP)"}
            </span>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white text-sm font-semibold rounded-xl transition"
          >
            {submitting ? "Uploading & Saving..." : "Publish Service"}
          </button>
        </div>
      </form>
    </div>
  );
}
