'use client';

import React, { useState } from 'react';
import { UserButton } from '@clerk/nextjs';
import { useGameStore } from '@/lib/store';
import { agents } from '@/lib/agents';
import { Button, Input } from '@/components/ui';
import { Send } from 'lucide-react';
import { chatWithAgent } from '@/app/actions';

interface Message {
    id: string;
    agentId?: string;
    content: string;
    isUser: boolean;
    timestamp: Date;
    type?: 'system' | 'normal';
}

export default function BoardroomPage() {
    const { companyName, industry, country, goals } = useGameStore();
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [presentExecutives, setPresentExecutives] = useState<string[]>([]); // IDs of execs at table
    const [activeSpeaker, setActiveSpeaker] = useState<string | null>(null);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            content: `Bienvenido a la Sala de Juntas, CEO de ${companyName || 'su empresa'}. Presente su tema y convocaré a los ejecutivos relevantes.`,
            isUser: false,
            timestamp: new Date(),
            type: 'system'
        }
    ]);

    const handleSendMessage = async () => {
        if (!inputMessage.trim() || isLoading) return;

        const newMessage: Message = {
            id: Date.now().toString(),
            content: inputMessage,
            isUser: true,
            timestamp: new Date()
        };

        setMessages([...messages, newMessage]);
        const currentInput = inputMessage;
        setInputMessage('');
        setIsLoading(true);

        try {
            // Build conversation history
            const conversationHistory = messages
                .filter(m => m.type !== 'system')
                .map(m => ({
                    role: m.isUser ? 'user' as const : 'assistant' as const,
                    content: m.content
                }));

            // Call orchestrator
            const result = await chatWithAgent(
                'orchestrator',
                currentInput,
                { companyName, industry, country, goals },
                conversationHistory,
                {
                    activeSpeaker: activeSpeaker,
                    handQueue: []
                }
            );

            if (result.success && result.decision) {
                const decision = result.decision;

                // Handle summoning
                if (decision.type === 'AGENT_SPEAK' && decision.agentId) {
                    // Add executive to table if not present
                    if (!presentExecutives.includes(decision.agentId)) {
                        const agent = agents.find(a => a.id === decision.agentId);
                        const summonMsg: Message = {
                            id: (Date.now() + 1).toString(),
                            content: `📋 Convocando a ${agent?.name} (${agent?.role}) - ${agent?.description.substring(0, 60)}...`,
                            isUser: false,
                            timestamp: new Date(),
                            type: 'system'
                        };
                        setMessages(prev => [...prev, summonMsg]);
                        setPresentExecutives(prev => [...prev, decision.agentId!]);

                        // Small delay for effect
                        await new Promise(resolve => setTimeout(resolve, 800));
                    }

                    // Set as active speaker
                    setActiveSpeaker(decision.agentId);

                    // Add their message
                    if (decision.content) {
                        const aiResponse: Message = {
                            id: (Date.now() + 2).toString(),
                            agentId: decision.agentId,
                            content: decision.content,
                            isUser: false,
                            timestamp: new Date()
                        };
                        setMessages(prev => [...prev, aiResponse]);
                    }
                }
            }

        } catch (error) {
            console.error('Error sending message:', error);
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                content: 'Lo siento, hubo un error al procesar tu mensaje.',
                isUser: false,
                timestamp: new Date(),
                type: 'system'
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-screen bg-[var(--color-bg-primary)]">
            {/* Header */}
            <div className="h-16 bg-[var(--color-bg-secondary)] border-b border-[var(--color-border)] flex items-center justify-between px-6">
                <div>
                    <h1 className="text-xl font-heading text-[var(--color-text-primary)]">
                        Sala de Juntas
                    </h1>
                    <p className="text-xs text-[var(--color-text-secondary)]">
                        {companyName} • {industry} • {country}
                    </p>
                </div>
                <UserButton afterSignOutUrl="/" />
            </div>

            {/* Board Table Area */}
            <div className="flex-1 flex flex-col">
                {/* Executive Seats */}
                <div className="h-32 bg-[var(--color-bg-secondary)] border-b border-[var(--color-border)] flex items-center justify-center gap-8 px-6">
                    {agents.map(agent => {
                        const isPresent = presentExecutives.includes(agent.id);
                        const isSpeaking = activeSpeaker === agent.id;

                        return (
                            <div
                                key={agent.id}
                                className={`flex flex-col items-center transition-all duration-500 ${isPresent ? 'opacity-100 scale-100' : 'opacity-20 scale-75'
                                    }`}
                            >
                                <div
                                    className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl border-4 transition-all duration-300 ${isSpeaking
                                            ? 'border-[var(--color-accent-primary)] shadow-lg shadow-[var(--color-accent-primary)] animate-pulse'
                                            : isPresent
                                                ? 'border-[var(--color-border)]'
                                                : 'border-transparent'
                                        }`}
                                    style={isPresent ? { borderColor: agent.color } : {}}
                                >
                                    {agent.avatar}
                                </div>
                                <p className={`text-xs mt-2 font-semibold transition-opacity ${isPresent ? 'opacity-100' : 'opacity-0'
                                    }`} style={{ color: agent.color }}>
                                    {agent.name}
                                </p>
                                <p className={`text-xs text-[var(--color-text-secondary)] transition-opacity ${isPresent ? 'opacity-100' : 'opacity-0'
                                    }`}>
                                    {agent.role}
                                </p>
                            </div>
                        );
                    })}
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {messages.map(msg => {
                        const agent = msg.agentId ? agents.find(a => a.id === msg.agentId) : null;
                        const isSystem = msg.type === 'system';

                        if (isSystem) {
                            return (
                                <div key={msg.id} className="flex justify-center">
                                    <div className="bg-[var(--color-bg-tertiary)] border border-[var(--color-border)] rounded-lg px-4 py-2 text-sm text-[var(--color-text-secondary)] max-w-2xl text-center">
                                        {msg.content}
                                    </div>
                                </div>
                            );
                        }

                        return (
                            <div key={msg.id} className={`flex gap-3 ${msg.isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                                {/* Avatar */}
                                <div
                                    className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-xl ${msg.isUser
                                            ? 'bg-[var(--color-accent-primary)]'
                                            : 'border-2'
                                        }`}
                                    style={!msg.isUser && agent ? { borderColor: agent.color } : {}}
                                >
                                    {msg.isUser ? '👤' : agent?.avatar}
                                </div>

                                {/* Message Bubble */}
                                <div className={`flex-1 max-w-[70%] ${msg.isUser ? 'text-right' : 'text-left'}`}>
                                    {!msg.isUser && agent && (
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
                                        className={`rounded-lg px-4 py-3 ${msg.isUser
                                                ? 'bg-[var(--color-accent-primary)] text-[var(--color-bg-primary)]'
                                                : 'bg-[var(--color-bg-tertiary)] text-[var(--color-text-primary)]'
                                            }`}
                                    >
                                        <p className="text-sm leading-relaxed">{msg.content}</p>
                                    </div>

                                    <div className="text-xs text-[var(--color-text-secondary)] mt-1">
                                        {msg.timestamp.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Input Area */}
                <div className="p-4 bg-[var(--color-bg-secondary)] border-t border-[var(--color-border)]">
                    <div className="flex gap-2">
                        <Input
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && !isLoading && handleSendMessage()}
                            placeholder={isLoading ? "Procesando..." : "Presente su tema a la Junta..."}
                            className="flex-1"
                            disabled={isLoading}
                        />
                        <Button onClick={handleSendMessage} disabled={!inputMessage.trim() || isLoading}>
                            {isLoading ? '⏳' : <Send className="w-4 h-4" />}
                        </Button>
                    </div>
                    {isLoading && (
                        <p className="text-xs text-[var(--color-accent-primary)] mt-2 animate-pulse">
                            🤖 Analizando tema y convocando ejecutivos...
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
