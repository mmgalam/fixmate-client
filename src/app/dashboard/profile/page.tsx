'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useSession, authClient } from '@/lib/auth-client';
import { fetchWithAuth } from '@/lib/api';
import { uploadImageToImgBB } from '@/lib/imgbb';
import type { UserProfile } from '@/types';
import { toast } from 'sonner';
import { Camera } from 'lucide-react';

export default function UpdateProfilePage() {
  const { data: session } = useSession();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [area, setArea] = useState('');
  const [bio, setBio] = useState('');
  const [currentImage, setCurrentImage] = useState('');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;
    fetchWithAuth('/api/users/me')
      .then((data: unknown) => {
        if (!active) return;
        const profile = data as UserProfile;
        setName(profile.name || '');
        setPhone(profile.phone || '');
        setArea(profile.area || '');
        setBio(profile.bio || '');
        setCurrentImage(profile.image || '');
      })
      .catch(() => {
        if (!active || !session?.user) return;
        setName(session.user.name || '');
        setCurrentImage(session.user.image || '');
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
      toast.error('Name cannot be empty');
      return;
    }

    setSaving(true);
    try {
      let imageUrl = currentImage;
      if (photoFile) {
        imageUrl = await uploadImageToImgBB(photoFile);
      }

      const validImage =
        imageUrl && !imageUrl.startsWith('blob:') ? imageUrl : undefined;

      await fetchWithAuth('/api/users/profile', {
        method: 'PATCH',
        body: JSON.stringify({
          name: name.trim(),
          phone,
          area,
          bio,
          ...(validImage ? { image: validImage } : {}),
        }),
      });

      await authClient.updateUser({
        name: name.trim(),
        ...(validImage ? { image: validImage } : {}),
      });

      if (validImage) setCurrentImage(validImage);
      setPhotoFile(null);
      toast.success('Profile updated successfully!');
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto h-96 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 animate-pulse" />
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1
          style={{ fontFamily: 'var(--font-display)' }}
          className="text-2xl font-black text-slate-950 dark:text-white"
        >
          Update Profile
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Manage your personal contact information, location area, and profile photo[cite: 2]
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-3d-card space-y-5"
      >
        <div className="flex items-center gap-5 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="relative">
            <Image
              src={
                currentImage ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  name || 'User'
                )}&background=4f46e5&color=fff`
              }
              alt={name || 'Profile'}
              width={80}
              height={80}
              unoptimized
              className="w-20 h-20 rounded-full object-cover border-2 border-slate-200 dark:border-slate-700"
            />
            <label
              className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center cursor-pointer shadow-md"
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
            <h3 className="font-bold text-slate-900 dark:text-white">{name || 'User'}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Click the camera icon to upload a new photo via ImgBB[cite: 2]
            </p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
              Email (Read-only)
            </label>
            <input
              type="email"
              readOnly
              value={session?.user?.email || ''}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/70 text-sm text-slate-500 cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
              Account Role (Read-only)
            </label>
            <input
              type="text"
              readOnly
              value={(session?.user?.role as string) || 'customer'}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/70 text-sm text-slate-500 uppercase font-semibold cursor-not-allowed"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">
            Full Name *
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+880 1700-000000"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">
              City / Area
            </label>
            <input
              type="text"
              value={area}
              onChange={(e) => setArea(e.target.value)}
              placeholder="e.g. Mirpur, Dhaka"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">
            Bio (Skills & Experience)
          </label>
          <textarea
            rows={3}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell customers about your repair specialties and years of experience..."
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
          />
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-linear-to-r from-indigo-600 to-cyan-600 hover:from-indigo-700 hover:to-cyan-700 disabled:opacity-60 text-white text-sm font-bold rounded-xl shadow-lg shadow-indigo-600/25 transition"
          >
            {saving ? 'Saving Profile...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}