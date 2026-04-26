import React from 'react';

export default function SubscriptionPlanCard({ plan, onSelectPlan, disabled, isActive }) {
    return (
        <div className={`bg-white rounded-lg border p-6 flex flex-col ${isActive ? 'border-emerald-500 ring-2 ring-emerald-500' : 'border-slate-200'}`}>
            {isActive && (
                <div className="mb-4">
                    <span className="inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                        Current Plan
                    </span>
                </div>
            )}
            <h3 className="text-xl font-bold text-slate-900">{plan.name}</h3>
            <div className="mt-4">
                <span className="text-3xl font-bold text-slate-900">₱{plan.price}</span>
                <span className="text-slate-600 ml-2">
                    {plan.duration_days === 0 ? 'Forever' : `/${plan.duration_days} days`}
                </span>
            </div>
            <ul className="mt-6 space-y-3 flex-1">
                <li className="flex items-center text-slate-600">
                    <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {plan.max_listing === 999 ? 'Unlimited' : `${plan.max_listing}`} property listings
                </li>
                <li className="flex items-center text-slate-600">
                    <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {plan.max_images === 999 ? 'Unlimited' : `${plan.max_images}`} images per listing
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
