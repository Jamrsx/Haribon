import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import Sidebar from '../Components/UI/Sidebar';

export default function DashboardLayout({ title, children }) {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <>
            <Head title={title} />
            <main className="min-h-screen bg-slate-100">
                <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((prev) => !prev)} />
                <div className={`pl-0 transition-all duration-200 ${collapsed ? 'md:pl-20' : 'md:pl-64'}`}>
                    <section className="min-h-[420px] p-4 sm:p-6">
                        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                            {children}
                        </div>
                    </section>
                </div>
            </main>
        </>
    );
}
