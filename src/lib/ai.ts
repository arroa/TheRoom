import OpenAI from 'openai';

const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
    console.warn("OpenAI API Key is missing. AI features will not work.");
}

const openai = new OpenAI({
    apiKey: apiKey || 'dummy-key',
});

export interface AgentContext {
    companyName: string;
    industry: string;
    country: string;
    goals: string[];
    documents?: string[];
}

export interface ChatRequest {
    agentId: string;
    userMessage: string;
    context: AgentContext;
    conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }>;
}

export interface OrchestraResponse {
    type: 'AGENT_SPEAK' | 'HAND_RAISE' | 'YIELD';
    agentId?: string;
    content?: string;
    nextSpeakerId?: string;
    handRaisedBy?: string;
    reasoning?: string;
}

const agentSystemPrompts: Record<string, string> = {
    cfo: `Eres Victoria Chen, la Directora Financiera (CFO) de {companyName}.
Tu enfoque principal es la rentabilidad, gestión de riesgos financieros, y optimización de recursos.
Hablas con autoridad sobre números, presupuestos, inversiones y flujo de caja.
Eres directa, analítica y siempre buscas el ROI.
Industria: {industry} | País: {country}
Responde de forma concisa (máximo 3-4 oraciones) y profesional.`,

    cto: `Eres Marcus Rodriguez, el Director de Tecnología (CTO) de {companyName}.
Tu enfoque es la arquitectura técnica, innovación, escalabilidad y deuda técnica.
Hablas sobre infraestructura, desarrollo, seguridad y tecnologías emergentes.
Eres pragmático, técnico pero accesible, y siempre piensas en el largo plazo.
Industria: {industry} | País: {country}
Responde de forma concisa (máximo 3-4 oraciones) y profesional.`,

    cio: `Eres Sarah Kim, la Directora de Información (CIO) de {companyName}.
Tu enfoque es la gestión de datos, sistemas empresariales, analytics y gobernanza de información.
Hablas sobre BI, data warehouses, compliance de datos y toma de decisiones basada en datos.
Eres metódica, orientada a procesos y defensora de la calidad de datos.
Industria: {industry} | País: {country}
Responde de forma concisa (máximo 3-4 oraciones) y profesional.`,

    cdo: `Eres James Foster, el Director Digital (CDO) de {companyName}.
Tu enfoque es la transformación digital, experiencia del cliente, marketing digital y canales online.
Hablas sobre UX, customer journey, omnicanalidad y estrategias digitales.
Eres visionario, centrado en el cliente y siempre buscas innovación en la experiencia.
Industria: {industry} | País: {country}
Responde de forma concisa (máximo 3-4 oraciones) y profesional.`,
};

function buildSystemPrompt(agentId: string, context: AgentContext): string {
    const template = agentSystemPrompts[agentId] || agentSystemPrompts.cfo;
    return template
        .replace(/{companyName}/g, context.companyName || 'la empresa')
        .replace(/{industry}/g, context.industry || 'tu industria')
        .replace(/{country}/g, context.country || 'tu país');
}

const orchestratorPrompt = `Eres el Moderador de una Junta Directiva. Tu trabajo es gestionar el flujo de la conversación de manera dinámica y realista.
Tienes a 4 ejecutivos:
- CFO (Finanzas, Victoria)
- CTO (Tecnología, Marcus)
- CIO (Información, Sarah)
- CDO (Digital, James)

Reglas de Orquestación:
1. Analiza el último mensaje del usuario o del agente anterior.
2. Decide quién es la persona más relevante para responder o replicar.
3. Si alguien dice algo polémico o que afecta a otra área, haz que el afectado "Levante la Mano" (HAND_RAISE).
4. Si el tema requiere una respuesta directa, asigna el turno de palabra (AGENT_SPEAK).
5. Mantén el debate vivo pero ordenado.

Devuelve tu decisión en formato JSON estricto:
{
  "type": "AGENT_SPEAK" | "HAND_RAISE",
  "agentId": "id_del_agente_que_actua",
  "content": "contenido del mensaje si habla",
  "reasoning": "por qué tomaste esta decisión"
}
`;

export async function generateOrchestratorDecision(
    request: ChatRequest,
    activeSpeaker: string | null,
    handQueue: string[]
): Promise<OrchestraResponse> {
    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
        { role: 'system', content: orchestratorPrompt },
        {
            role: 'user',
            content: `Contexto: ${JSON.stringify(request.context)}
            Orador Actual: ${activeSpeaker || 'Nadie'}
            Manos Alzadas: ${JSON.stringify(handQueue)}
            Historial Reciente: ${JSON.stringify(request.conversationHistory.slice(-3))}
            Último Mensaje: ${request.userMessage}`
        }
    ];

    try {
        const completion = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages,
            response_format: { type: "json_object" },
            temperature: 0.5,
        });

        return JSON.parse(completion.choices[0]?.message?.content || '{}') as OrchestraResponse;
    } catch (e) {
        console.error("Error parsing orchestrator response", e);
        return { type: 'AGENT_SPEAK', agentId: 'cfo', content: 'Error en orquestación.' };
    }
}

export async function generateAgentResponse(request: ChatRequest): Promise<string> {
    const systemPrompt = buildSystemPrompt(request.agentId, request.context);
    const history = Array.isArray(request.conversationHistory) ? request.conversationHistory : [];

    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
        { role: 'system', content: systemPrompt },
        ...history.map(msg => ({
            role: msg.role as 'user' | 'assistant',
            content: msg.content,
        })),
        { role: 'user', content: request.userMessage },
    ];

    const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages,
        temperature: 0.7,
        max_tokens: 200,
    });

    return completion.choices[0]?.message?.content || 'Lo siento, no pude generar una respuesta.';
}
