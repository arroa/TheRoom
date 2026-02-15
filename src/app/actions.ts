'use server';

import { generateOrchestratorDecision, generateAgentResponse, AgentContext } from '@/lib/ai';

export async function chatWithAgent(
    // We keep the same signature for compatibility, but 'agentId' might be ignored if orchestrator takes over
    agentId: string,
    userMessage: string,
    context: AgentContext,
    conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }>,
    boardState: { activeSpeaker: string | null }
) {
    try {
        const decision = await generateOrchestratorDecision(
            { agentId, userMessage, context, conversationHistory },
            boardState.activeSpeaker,
            [] // handQueue not used in new design
        );

        // 2. Execute decision
        if (decision.type === 'AGENT_SPEAK' && decision.agentId) {
            // Generate content for the chosen agent
            const content = await generateAgentResponse({
                agentId: decision.agentId,
                userMessage,
                context,
                conversationHistory
            });
            return { success: true, decision: { ...decision, content } };
        } else {
            // HAND_RAISE or YIELD - just return the decision
            return { success: true, decision };
        }

    } catch (error) {
        console.error('Error in chatWithAgent:', error);
        return {
            success: false,
            message: 'Error en la orquestación.'
        };
    }
}
