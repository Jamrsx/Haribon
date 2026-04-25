import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import Sidebar from '../Components/UI/Sidebar';

export default function DashboardLayout({ title, children }) {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <>
            <Head title={title} />
            <div className="min-h-screen bg-slate-50">
                <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((prev) => !prev)} />
                <div className={`transition-all duration-200 ${collapsed ? 'md:pl-20' : 'md:pl-64'}`}>
                    <section className="p-4 sm:p-6 lg:p-8">
                        {children}
                    </section>
                </div>
            </div>
        </>
    );
}
