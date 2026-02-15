'use client';

import React from 'react';
import { Agent } from '@/lib/agents';

interface AgentCardProps {
    agent: Agent;
    isActive?: boolean; // Selected for view
    isSpeaking?: boolean;
    isHandRaised?: boolean;
    onClick?: () => void;
}

export default function AgentCard({ agent, isActive = false, isSpeaking = false, isHandRaised = false, onClick }: AgentCardProps) {
    return (
        <div
            onClick={onClick}
            className={`
        p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 relative
        ${isActive
                    ? 'bg-[var(--color-bg-tertiary)] border-[var(--color-accent-primary)] shadow-lg'
                    : 'bg-[var(--color-bg-secondary)] border-[var(--color-border)] hover:border-[var(--color-text-secondary)]'
                }
        ${isSpeaking ? 'ring-2 ring-[var(--color-accent-primary)] ring-offset-2 ring-offset-[var(--color-bg-primary)]' : ''}
      `}
        >
            {isHandRaised && (
                <div className="absolute -top-2 -right-2 bg-[var(--color-accent-primary)] text-white w-6 h-6 rounded-full flex items-center justify-center text-xs shadow-md animate-bounce">
                    ✋
                </div>
            )}

            <div className="flex items-center gap-3 mb-2">
                <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl border-2 ${isSpeaking ? 'animate-pulse' : ''}`}
                    style={{ borderColor: agent.color }}
                >
                    {agent.avatar}
                </div>
                <div className="flex-1">
                    <h3 className="font-semibold text-[var(--color-text-primary)]">{agent.name}</h3>
                    <p className="text-sm" style={{ color: agent.color }}>{agent.role}</p>
                </div>
            </div>
            <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                {agent.description}
            </p>
        </div>
    );
}
