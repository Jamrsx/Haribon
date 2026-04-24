import React, { useEffect } from 'react';

const toneMap = {
    success: 'border-emerald-200 bg-emerald-50 text-emerald-800',
    error: 'border-rose-200 bg-rose-50 text-rose-800',
    warning: 'border-amber-200 bg-amber-50 text-amber-800',
    info: 'border-slate-200 bg-white text-slate-800',
};

export default function Toast({ show, type = 'info', message, onClose, autoCloseMs = 3500 }) {
    useEffect(() => {
        if (!show || !autoCloseMs) {
            return undefined;
        }

        const timeoutId = setTimeout(() => {
            onClose?.();
        }, autoCloseMs);

        return () => clearTimeout(timeoutId);
    }, [show, autoCloseMs, onClose]);

    if (!show || !message) {
        return null;
    }

    return (
        <div className="fixed right-4 top-4 z-50 w-full max-w-sm">
            <div className={`rounded-xl border px-4 py-3 shadow-md ${toneMap[type] ?? toneMap.info}`}>
                <div className="flex items-start justify-between gap-3">
                    <p className="text-sm font-medium">{message}</p>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-md px-2 py-1 text-xs font-semibold opacity-80 transition hover:opacity-100"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
