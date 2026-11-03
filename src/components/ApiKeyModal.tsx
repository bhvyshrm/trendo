import React, { useState, useEffect } from 'react';
import { TmdbService } from '../services/tmdb';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onKeyUpdated: () => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose, onKeyUpdated }) => {
  const [key, setKey] = useState('');
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [testing, setTesting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setKey(TmdbService.getApiKey());
      setStatusMessage(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = async () => {
    if (!key.trim()) {
      TmdbService.setApiKey('');
      setStatusMessage({ text: 'API Key cleared. Trendo will use the curated telemetry archive.', type: 'info' });
      onKeyUpdated();
      return;
    }

    setTesting(true);
    setStatusMessage(null);

    try {
      TmdbService.setApiKey(key.trim());
      // Test the key with a quick request
      await TmdbService.getTrending('movie', 'day');
      setStatusMessage({ text: 'TMDB API Key verified successfully! Live telemetry active.', type: 'success' });
      onKeyUpdated();
    } catch (err: any) {
      setStatusMessage({
        text: 'The provided API key returned an authorization error. Please check your credentials at themoviedb.org.',
        type: 'error'
      });
    } finally {
      setTesting(false);
    }
  };

  const handleResetToDemo = () => {
    TmdbService.setApiKey('');
    setKey('');
    setStatusMessage({ text: 'Reset to Trendo Curated Telemetry Archive.', type: 'info' });
    onKeyUpdated();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md transition-opacity duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-[#141416] border border-outline-variant/40 rounded-xl p-6 md:p-8 shadow-2xl relative text-left"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-outline hover:text-primary transition-colors p-1"
          aria-label="Close API settings"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        <div className="flex items-center gap-2 mb-2">
          <span className="material-symbols-outlined text-amber-400 text-[22px]">vpn_key</span>
          <h2 className="text-headline-sm font-medium text-primary">TMDB Telemetry Engine</h2>
        </div>

        <p className="text-body-sm text-on-surface-variant leading-relaxed mb-5">
          Trendo integrates directly with the official The Movie Database (TMDB v3) API to stream daily trending movies, series, rankings, and cast monographs.
        </p>

        {/* Configuration instructions */}
        <div className="bg-[#0b0b0d] border border-white/5 rounded-lg p-4 mb-5 text-body-sm space-y-2">
          <p className="text-primary font-medium flex items-center gap-1.5">
            <span className="material-symbols-outlined text-emerald-400 text-[16px]">info</span>
            How to configure:
          </p>
          <ol className="list-decimal list-inside text-outline text-xs space-y-1">
            <li>
              Register for a free account at{' '}
              <a
                href="https://www.themoviedb.org/settings/api"
                target="_blank"
                rel="noreferrer"
                className="text-amber-400 underline hover:text-amber-300"
              >
                themoviedb.org/settings/api
              </a>.
            </li>
            <li>Copy your <strong className="text-primary">API Key (v3 auth)</strong>.</li>
            <li>
              Either paste it below, or add <code className="bg-[#1c1c1f] text-primary px-1 rounded">VITE_TMDB_API_KEY=your_key</code> in your local <code className="bg-[#1c1c1f] text-primary px-1 rounded">.env</code> file.
            </li>
          </ol>
        </div>

        {/* Input */}
        <div className="mb-4">
          <label className="text-label-mono-sm uppercase text-outline block mb-1.5 tracking-wider">
            TMDB v3 API Key
          </label>
          <input
            type="text"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="Paste TMDB API Key here..."
            className="w-full bg-[#0d0d0f] border border-outline-variant/40 rounded px-3.5 py-2.5 text-body-sm text-primary placeholder-[#505050] focus:border-primary focus:outline-none font-mono"
          />
        </div>

        {statusMessage && (
          <div
            className={`p-3 rounded text-body-sm mb-4 border ${
              statusMessage.type === 'success'
                ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                : statusMessage.type === 'error'
                ? 'bg-rose-950/40 border-rose-500/40 text-rose-300'
                : 'bg-[#18181b] border-white/10 text-on-surface'
            }`}
          >
            {statusMessage.text}
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/5">
          <button
            type="button"
            onClick={handleResetToDemo}
            className="text-body-sm text-outline hover:text-primary underline underline-offset-4"
          >
            Use Curated Archive
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-surface-container-high text-body-sm text-on-surface hover:text-primary transition-colors"
            >
              Close
            </button>
            <button
              type="button"
              disabled={testing}
              onClick={handleSave}
              className="px-5 py-2 rounded bg-primary text-background text-body-sm font-medium hover:bg-neutral-200 transition-colors flex items-center gap-1.5 shadow-lg disabled:opacity-50"
            >
              {testing ? (
                <>
                  <span className="material-symbols-outlined text-[16px] animate-spin">sync</span>
                  <span>Verifying...</span>
                </>
              ) : (
                <span>Save & Connect</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
