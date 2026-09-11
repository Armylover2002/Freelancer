import { useState } from 'react';
import { Loader2, Upload, X } from 'lucide-react';
import toast from 'react-hot-toast';
import clsx from 'clsx';
import { mediaAdminApi } from '../../api/adminApi.js';
import { extractErrorMessage } from '../../api/axiosClient.js';

/**
 * Uploads image(s) straight to Cloudinary via the admin media endpoint and returns
 * { url, publicId } refs. Used by Projects/Team/Testimonials forms and the Media library.
 */
export function ImageUploader({ value, onChange, multiple = false, folder = 'content', label = 'Upload image' }) {
  const [uploading, setUploading] = useState(false);
  const images = multiple ? (value || []) : value ? [value] : [];

  const handleFiles = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploading(true);
    try {
      const uploaded = await mediaAdminApi.upload(files, { folder });
      const refs = uploaded.map((m) => ({ url: m.url, publicId: m.publicId }));
      if (multiple) {
        onChange([...(value || []), ...refs]);
      } else {
        onChange(refs[0]);
      }
    } catch (err) {
      toast.error(extractErrorMessage(err));
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const removeAt = (idx) => {
    if (multiple) {
      onChange((value || []).filter((_, i) => i !== idx));
    } else {
      onChange(undefined);
    }
  };

  return (
    <div>
      <div className="flex flex-wrap gap-3">
        {images.map((img, idx) => (
          <div key={img.publicId || idx} className="group relative h-20 w-20 overflow-hidden rounded-xl border border-ink-900/10">
            <img src={img.url} alt="" className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => removeAt(idx)}
              className="absolute inset-0 flex items-center justify-center bg-black/50 text-white opacity-0 transition group-hover:opacity-100"
              aria-label="Remove image"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        ))}
        <label
          className={clsx(
            'flex h-20 w-20 cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-ink-900/15 text-ink-900/40 transition hover:border-accent-500/50 hover:text-accent-600',
            uploading && 'opacity-60'
          )}
        >
          {uploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Upload className="h-5 w-5" />}
          <span className="text-[10px] font-medium">{uploading ? 'Uploading' : label}</span>
          <input type="file" accept="image/*" multiple={multiple} className="hidden" onChange={handleFiles} disabled={uploading} />
        </label>
      </div>
    </div>
  );
}
