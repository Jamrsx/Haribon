import React, { useEffect, useState } from 'react';
import { usePage } from '@inertiajs/react';

const sizeMap = {
    sm: 'h-8 w-8',
    md: 'h-9 w-9',
    lg: 'h-10 w-10',
};

const iconSizeMap = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-5 w-5',
};

export default function FavoriteButton({
    propertyId,
    initialFavorited = false,
    size = 'md',
    variant = 'floating',
    onChange,
    className = '',
    label = false,
}) {
    const { auth, csrf_token: pageCsrf } = usePage().props;
    const csrfFromMeta = typeof document !== 'undefined'
        ? document.querySelector('meta[name="csrf-token"]')?.content
        : null;
    const csrfToken = pageCsrf ?? csrfFromMeta ?? '';

    const [favorited, setFavorited] = useState(initialFavorited);
    const [pending, setPending] = useState(false);

    useEffect(() => {
        setFavorited(initialFavorited);
    }, [initialFavorited]);

    const handleClick = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!auth?.user) {
            window.location.href = `/register?role=buyer&redirect=${encodeURIComponent(window.location.pathname)}`;
            return;
        }

        if (pending) return;

        const previous = favorited;
        const optimistic = !favorited;
        setFavorited(optimistic);
        setPending(true);
        console.log('[Favorite] toggling property', propertyId, 'optimistic:', optimistic);

        try {
            const res = await fetch(`/properties/${propertyId}/favorite`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                    'X-Requested-With': 'XMLHttpRequest',
                },
                credentials: 'same-origin',
                body: JSON.stringify({}),
            });

            if (!res.ok) {
                throw new Error(`Request failed: ${res.status}`);
            }

            const data = await res.json();
            const newFavorited = !!data.favorited;
            setFavorited(newFavorited);
            onChange?.(newFavorited, data);
        } catch (err) {
            console.warn('[Favorite] toggle failed, reverting', err);
            setFavorited(previous);
        } finally {
            setPending(false);
        }
    };

    const baseClasses = variant === 'floating'
        ? `${sizeMap[size]} inline-flex items-center justify-center rounded-full bg-white/95 shadow-md transition hover:bg-white`
        : `inline-flex items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition ${
            favorited
                ? 'border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100'
                : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
        }`;

    return (
        <button
            type="button"
            onClick={handleClick}
            disabled={pending}
            className={`${baseClasses} ${className} disabled:opacity-60`}
            aria-pressed={favorited}
            aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
            title={favorited ? 'Remove from favorites' : 'Add to favorites'}
        >
            <svg
                className={`${iconSizeMap[size]} ${favorited ? 'text-rose-500' : 'text-slate-400'}`}
                viewBox="0 0 24 24"
                fill={favorited ? 'currentColor' : 'none'}
                stroke="currentColor"
                strokeWidth={favorited ? '0' : '2'}
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            {label ? <span>{favorited ? 'Saved' : 'Save'}</span> : null}
        </button>
    );
}
