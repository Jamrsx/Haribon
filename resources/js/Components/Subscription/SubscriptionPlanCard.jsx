import React from 'react';

export default function SubscriptionPlanCard({ plan, onSelectPlan, disabled, isActive }) {
    const isPremium = plan.duration_days >= 365 || plan.duration_days === 0; // 1-year or lifetime plans

    return (
        <div className={`bg-white rounded-lg border p-6 flex flex-col ${isActive ? 'border-emerald-500 ring-2 ring-emerald-500' : 'border-slate-200'}`}>
            <div className="mb-4 flex flex-wrap gap-2">
                {isActive && (
                    <span className="inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                        Current Plan
                    </span>
                )}
                {isPremium && (
                    <div className="flex items-center gap-1 rounded-full bg-amber-500 px-3 py-1 text-xs font-semibold text-white">
                        <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        Premium
                    </div>
                )}
            </div>
            <h3 className="text-xl font-bold text-slate-900">{plan.name}</h3>
            <div className="mt-4">
                <span className="text-3xl font-bold text-slate-900">₱{plan.price}</span>
                <span className="text-slate-600 ml-2">
                    {plan.duration_days === 0 ? 'Forever' : `/${plan.duration_days} days`}
                </span>
            </div>
            {isPremium && (
                <div className="mt-3 rounded-lg bg-amber-50 border border-amber-200 p-3">
                    <div className="flex items-center gap-2">
                        <svg className="h-4 w-4 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <p className="text-xs font-semibold text-amber-900">Earn a Premium badge on your properties</p>
                    </div>
                </div>
            )}
            {(plan.duration_days >= 9999 || plan.duration_days === 0) && (
                <div className="mt-3 rounded-lg bg-emerald-50 border border-emerald-200 p-3">
                    <p className="text-xs font-semibold text-emerald-900 mb-2">Exclusive Lifetime Perks:</p>
                    <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                            <svg className="h-3 w-3 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <p className="text-xs text-emerald-800">Premium Subs Badge</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <svg className="h-3 w-3 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                            </svg>
                            <p className="text-xs text-emerald-800">Dev Supporter Badge</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <svg className="h-3 w-3 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                            <p className="text-xs text-emerald-800">Saviour Badge</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <svg className="h-3 w-3 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                            </svg>
                            <p className="text-xs text-emerald-800">Loyal Seller Badge</p>
                        </div>
                    </div>
                </div>
            )}
            <ul className="mt-6 space-y-3 flex-1">
                <li className="flex items-center text-slate-600">
                    <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {plan.max_listing >= 999 ? 'Unlimited' : `${plan.max_listing}`} property listings
                </li>
                <li className="flex items-center text-slate-600">
                    <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {plan.max_images >= 999999 ? 'Unlimited' : `${plan.max_images}`} images per listing
                </li>
            </ul>
            <button
                onClick={() => onSelectPlan(plan.id)}
                disabled={disabled || isActive}
                className={`mt-6 w-full py-3 px-4 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                    isActive
                        ? 'bg-slate-300 text-slate-700 cursor-not-allowed'
                        : 'bg-green-600 text-white hover:bg-green-700'
                }`}
            >
                {isActive ? 'Current Plan' : disabled ? 'Processing...' : 'Select Plan'}
            </button>
        </div>
    );
}
