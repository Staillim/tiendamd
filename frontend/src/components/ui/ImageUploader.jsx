import { useState, useRef, useCallback } from 'react';
import { HiOutlinePhotograph, HiOutlineTrash, HiOutlineUpload } from 'react-icons/hi';
import { fileToBase64 } from '../../utils/imageHelpers';

export default function ImageUploader({ value, onChange, label = 'Imagen' }) {
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const img = value || { tipo: 'drive', valor: '' };

  const handleFile = useCallback(async (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    try {
      const base64 = await fileToBase64(file);
      onChange('base64', base64);
    } catch {
      // error reading file
    }
  }, [onChange]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer?.files?.[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => setDragOver(false);

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const getPreviewSrc = () => {
    if (!img.valor) return null;
    if (img.tipo === 'base64') return img.valor;
    const match = img.valor.match(/\/d\/([a-zA-Z0-9_-]+)/) || img.valor.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (match?.[1]) return `https://drive.google.com/thumbnail?id=${match[1]}&sz=w200`;
    return img.valor;
  };

  const previewSrc = getPreviewSrc();

  return (
    <div>
      <label className="label">{label}</label>
      <div className="space-y-3">
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="radio"
              checked={img.tipo === 'drive'}
              onChange={() => onChange('drive', img.valor)}
              className="text-blue-600"
            />
            Google Drive
          </label>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="radio"
              checked={img.tipo === 'base64'}
              onChange={() => onChange('base64', img.valor)}
              className="text-blue-600"
            />
            Base64
          </label>
        </div>

        {img.tipo === 'base64' ? (
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
            className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
              dragOver
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600'
            } ${img.valor ? 'pb-20' : ''}`}
          >
            {img.valor ? (
              <div className="space-y-3">
                <img
                  src={previewSrc || img.valor}
                  alt="Preview"
                  className="max-h-48 mx-auto rounded-lg object-contain"
                />
                <p className="text-xs text-gray-400 truncate max-w-full">
                  {img.valor.slice(0, 80)}...
                </p>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); onChange('base64', ''); }}
                  className="absolute bottom-3 right-3 inline-flex items-center gap-1 text-xs text-red-500 hover:text-red-700"
                >
                  <HiOutlineTrash className="w-4 h-4" /> Eliminar
                </button>
              </div>
            ) : (
              <div className="py-8">
                <HiOutlineUpload className="w-10 h-10 mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Arrastra una imagen aquí o haz clic para seleccionar
                </p>
                <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP</p>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
        ) : (
          <div>
            <input
              type="url"
              value={img.valor}
              onChange={(e) => onChange('drive', e.target.value)}
              placeholder="https://drive.google.com/file/d/..."
              className="input"
            />
            {previewSrc && img.tipo === 'drive' && (
              <img src={previewSrc} alt="Preview" className="mt-2 max-h-32 rounded-lg object-contain" />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
