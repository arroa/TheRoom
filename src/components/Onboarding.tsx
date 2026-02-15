'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, UserButton } from '@clerk/nextjs';
import { useGameStore } from '@/lib/store';
import { Button, Input } from '@/components/ui';

export default function Onboarding() {
    const router = useRouter();
    const { user } = useUser();
    const { setCompanyName, setIndustry, setCountry } = useGameStore();

    const [companyName, setLocalCompanyName] = useState('');
    const [industry, setLocalIndustry] = useState('');
    const [country, setLocalCountry] = useState('');

    const handleStart = () => {
        if (!companyName.trim()) return;

        setCompanyName(companyName);
        setIndustry(industry || 'Tecnología');
        setCountry(country || 'Chile');

        router.push('/boardroom');
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-[radial-gradient(circle_at_center,_var(--color-bg-secondary)_0%,_var(--color-bg-primary)_100%)] relative">
            <div className="absolute top-4 right-4">
                <UserButton
                    afterSignOutUrl="/"
                    appearance={{
                        elements: {
                            userButtonAvatarBox: "w-10 h-10 border-2 border-[var(--color-accent-primary)]"
                        }
                    }}
                />
            </div>

            <div className="max-w-md w-full">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-heading text-[var(--color-accent-primary)] mb-2">
                        TheRoom
                    </h1>
                    <p className="text-[var(--color-text-secondary)] text-sm">
                        Su Junta Directiva de IA
                    </p>
                </div>

                {/* Quick Form */}
                <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-lg p-6 space-y-4">
                    <div>
                        <label className="block text-sm text-[var(--color-text-secondary)] mb-2">
                            Nombre de su empresa *
                        </label>
                        <Input
                            value={companyName}
                            onChange={(e) => setLocalCompanyName(e.target.value)}
                            placeholder="Ej: TechCorp"
                            className="w-full"
                            autoFocus
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-[var(--color-text-secondary)] mb-2">
                            Industria (opcional)
                        </label>
                        <Input
                            value={industry}
                            onChange={(e) => setLocalIndustry(e.target.value)}
                            placeholder="Ej: Tecnología, Retail, Finanzas..."
                            className="w-full"
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-[var(--color-text-secondary)] mb-2">
                            País (opcional)
                        </label>
                        <Input
                            value={country}
                            onChange={(e) => setLocalCountry(e.target.value)}
                            placeholder="Ej: Chile, México, España..."
                            className="w-full"
                        />
                    </div>

                    <Button
                        onClick={handleStart}
                        disabled={!companyName.trim()}
                        className="w-full mt-6"
                    >
                        Entrar a la Sala de Juntas →
                    </Button>
                </div>

                {/* Footer hint */}
                <p className="text-center text-xs text-[var(--color-text-secondary)] mt-6">
                    Bienvenido, {user?.firstName || 'CEO'}. Complete los datos para comenzar.
                </p>
            </div>
        </div>
    );
}
