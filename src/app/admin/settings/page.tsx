"use client";

import { useState } from 'react';
import { Save, Loader2, CheckCircle } from 'lucide-react';

export default function SettingsPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    const handleSave = async () => {
        setIsSaving(true);
        // Placeholder — settings would be saved to DB or env in production
        await new Promise(r => setTimeout(r, 1000));
        setIsSaving(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    return (
        <div className="space-y-8 max-w-2xl">
            <h1 className="text-3xl font-bold text-gray-900">Settings</h1>

            {/* Notification Settings */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-6">
                <div>
                    <h2 className="text-lg font-bold text-gray-900">Notifications</h2>
                    <p className="text-sm text-gray-500 mt-1">Configure where lead alerts are sent.</p>
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Alert Email</label>
                    <input
                        type="email"
                        placeholder="umar.sarwar@corp.tkxel.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                    />
                    <p className="text-xs text-gray-400">New lead notifications will be sent to this email.</p>
                </div>
            </div>

            {/* Security */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-6">
                <div>
                    <h2 className="text-lg font-bold text-gray-900">Security</h2>
                    <p className="text-sm text-gray-500 mt-1">Update your admin password.</p>
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">New Password</label>
                    <input
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                    />
                </div>
            </div>

            {/* Save */}
            <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
                {isSaving ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
                ) : saved ? (
                    <><CheckCircle className="w-4 h-4" /> Saved!</>
                ) : (
                    <><Save className="w-4 h-4" /> Save Changes</>
                )}
            </button>
        </div>
    );
}
