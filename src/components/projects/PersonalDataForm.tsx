'use client';

import { useState } from 'react';
import { updateProjectPersonalData } from '@/actions/projectActions';
import type { SocialLinks } from '@/lib/validations/projectPersonalData';

interface PersonalDataFormProps {
  projectId: string;
  initialData?: {
    bio?: string | null;
    photos?: string[];
    videos?: string[];
    socialLinks?: SocialLinks | null;
  };
}

export function PersonalDataForm({ projectId, initialData }: PersonalDataFormProps) {
  const [bio, setBio] = useState(initialData?.bio || '');
  const [photos, setPhotos] = useState<string[]>(initialData?.photos || []);
  const [videos, setVideos] = useState<string[]>(initialData?.videos || []);
  const [socialLinks, setSocialLinks] = useState<SocialLinks>(
    initialData?.socialLinks || {}
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleAddPhoto = () => {
    setPhotos([...photos, '']);
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const handlePhotoChange = (index: number, value: string) => {
    const newPhotos = [...photos];
    newPhotos[index] = value;
    setPhotos(newPhotos);
  };

  const handleAddVideo = () => {
    setVideos([...videos, '']);
  };

  const handleRemoveVideo = (index: number) => {
    setVideos(videos.filter((_, i) => i !== index));
  };

  const handleVideoChange = (index: number, value: string) => {
    const newVideos = [...videos];
    newVideos[index] = value;
    setVideos(newVideos);
  };

  const handleSocialLinkChange = (platform: keyof SocialLinks, value: string) => {
    setSocialLinks({
      ...socialLinks,
      [platform]: value || undefined,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    // Filtrer les URLs vides
    const filteredPhotos = photos.filter((url) => url.trim() !== '');
    const filteredVideos = videos.filter((url) => url.trim() !== '');
    const filteredSocialLinks = Object.fromEntries(
      Object.entries(socialLinks).filter(
        ([, value]) => value && typeof value === 'string' && value.trim() !== ''
      )
    ) as SocialLinks;

    const result = await updateProjectPersonalData({
      projectId,
      bio: bio.trim() || undefined,
      photos: filteredPhotos.length > 0 ? filteredPhotos : undefined,
      videos: filteredVideos.length > 0 ? filteredVideos : undefined,
      socialLinks: Object.keys(filteredSocialLinks).length > 0 ? filteredSocialLinks : undefined,
    });

    if (result.success) {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } else {
      setError(result.error?.message || 'Une erreur est survenue');
    }

    setIsSubmitting(false);
  };

  const socialPlatforms: Array<{ key: keyof SocialLinks; label: string; placeholder: string }> = [
    { key: 'instagram', label: 'Instagram', placeholder: 'https://instagram.com/votre-compte' },
    { key: 'facebook', label: 'Facebook', placeholder: 'https://facebook.com/votre-page' },
    { key: 'spotify', label: 'Spotify', placeholder: 'https://open.spotify.com/artist/...' },
    { key: 'youtube', label: 'YouTube', placeholder: 'https://youtube.com/@votre-chaine' },
    { key: 'twitter', label: 'Twitter/X', placeholder: 'https://twitter.com/votre-compte' },
    { key: 'tiktok', label: 'TikTok', placeholder: 'https://tiktok.com/@votre-compte' },
    { key: 'soundcloud', label: 'SoundCloud', placeholder: 'https://soundcloud.com/votre-compte' },
    { key: 'bandcamp', label: 'Bandcamp', placeholder: 'https://votre-artiste.bandcamp.com' },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
          Données personnelles sauvegardées avec succès !
        </div>
      )}

      {/* Bio */}
      <div>
        <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
          Bio artistique
        </label>
        <textarea
          id="bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={6}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Décrivez votre projet musical, votre style, votre parcours..."
        />
        <p className="mt-1 text-xs text-gray-500">{bio.length}/5000 caractères</p>
      </div>

      {/* Photos */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Photos (URLs)
          </label>
          <button
            type="button"
            onClick={handleAddPhoto}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            + Ajouter une photo
          </button>
        </div>
        <div className="space-y-2">
          {photos.map((photo, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="url"
                value={photo}
                onChange={(e) => handlePhotoChange(index, e.target.value)}
                placeholder="https://exemple.com/photo.jpg"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                type="button"
                onClick={() => handleRemovePhoto(index)}
                className="px-3 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200"
              >
                Supprimer
              </button>
            </div>
          ))}
          {photos.length === 0 && (
            <p className="text-sm text-gray-500">Aucune photo ajoutée</p>
          )}
        </div>
      </div>

      {/* Vidéos */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Vidéos (URLs YouTube, Vimeo, etc.)
          </label>
          <button
            type="button"
            onClick={handleAddVideo}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            + Ajouter une vidéo
          </button>
        </div>
        <div className="space-y-2">
          {videos.map((video, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="url"
                value={video}
                onChange={(e) => handleVideoChange(index, e.target.value)}
                placeholder="https://youtube.com/watch?v=..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                type="button"
                onClick={() => handleRemoveVideo(index)}
                className="px-3 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200"
              >
                Supprimer
              </button>
            </div>
          ))}
          {videos.length === 0 && (
            <p className="text-sm text-gray-500">Aucune vidéo ajoutée</p>
          )}
        </div>
      </div>

      {/* Liens réseaux sociaux */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Liens réseaux sociaux
        </label>
        <div className="space-y-3">
          {socialPlatforms.map((platform) => {
            const currentValue = socialLinks[platform.key];
            const stringValue = typeof currentValue === 'string' ? currentValue : '';
            return (
              <div key={platform.key}>
                <label
                  htmlFor={platform.key}
                  className="block text-xs font-medium text-gray-600 mb-1"
                >
                  {platform.label}
                </label>
                <input
                  id={platform.key}
                  type="url"
                  value={stringValue}
                  onChange={(e) => handleSocialLinkChange(platform.key, e.target.value)}
                  placeholder={platform.placeholder}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Sauvegarde...' : 'Sauvegarder'}
        </button>
      </div>
    </form>
  );
}
