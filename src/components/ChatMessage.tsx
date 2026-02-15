'use client';

import React from 'react';
import { Agent } from '@/lib/agents';

interface ChatMessageProps {
    agent?: Agent;
    content: string;
    isUser?: boolean;
    timestamp?: Date;
    isActive?: boolean;
}

export default function ChatMessage({ agent, content, isUser = false, timestamp, isActive = false }: ChatMessageProps) {
    return (
        <div className={`flex gap-3 mb-4 ${isUser ? 'flex-row-reverse' : 'flex-row'} ${isActive ? 'opacity-100' : 'opacity-80'}`}>
            {/* Avatar */}
            <div
                className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-xl ${isUser
                    ? 'bg-[var(--color-accent-primary)]'
                    : `border-2 border-[var(--color-border)] ${isActive ? 'ring-2 ring-[var(--color-accent-primary)] ring-offset-1 ring-offset-[var(--color-bg-primary)]' : ''}`
                    }`}
                style={!isUser && agent ? { borderColor: agent.color } : {}}
            >
                {isUser ? '👤' : agent?.avatar}
            </div>

            {/* Message Bubble */}
            <div className={`flex-1 max-w-[70%] ${isUser ? 'text-right' : 'text-left'}`}>
                {!isUser && agent && (
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-semibold" style={{ color: agent.color }}>
                            {agent.name}
                        </span>
                        <span className="text-xs text-[var(--color-text-secondary)]">
                            {agent.role}
                        </span>
                    </div>
                )}

                <div
                    className={`rounded-lg px-4 py-3 ${isUser
                        ? 'bg-[var(--color-accent-primary)] text-[var(--color-bg-primary)]'
                        : 'bg-[var(--color-bg-tertiary)] text-[var(--color-text-primary)]'
                        }`}
                >
                    <p className="text-sm leading-relaxed">{content}</p>
                </div>

                {timestamp && (
                    <div className="text-xs text-[var(--color-text-secondary)] mt-1">
                        {timestamp.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                )}
            </div>
        </div>
    );
}
