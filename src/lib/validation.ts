// Input validation utilities

const MAX_MESSAGE_LENGTH = 500;
const MAX_CONVERSATION_HISTORY = 20; // Limit to prevent token overflow

/**
 * Sanitizes user input to prevent prompt injection and excessive costs
 */
export function sanitizeUserInput(input: string): string {
    // Remove excessive whitespace
    let sanitized = input.trim().replace(/\s+/g, ' ');

    // Truncate if too long
    if (sanitized.length > MAX_MESSAGE_LENGTH) {
        sanitized = sanitized.substring(0, MAX_MESSAGE_LENGTH);
    }

    // Remove potential prompt injection patterns
    // (basic protection, not comprehensive)
    const dangerousPatterns = [
        /ignore\s+(all\s+)?previous\s+instructions/gi,
        /system\s*:/gi,
        /assistant\s*:/gi,
    ];

    dangerousPatterns.forEach(pattern => {
        sanitized = sanitized.replace(pattern, '');
    });

    return sanitized;
}

/**
 * Validates message before sending to AI
 */
export function validateMessage(message: string): { valid: boolean; error?: string } {
    if (!message || message.trim().length === 0) {
        return { valid: false, error: 'El mensaje no puede estar vacío' };
    }

    if (message.length > MAX_MESSAGE_LENGTH) {
        return { valid: false, error: `El mensaje no puede exceder ${MAX_MESSAGE_LENGTH} caracteres` };
    }

    return { valid: true };
}

/**
 * Truncates conversation history to prevent token overflow
 */
export function truncateConversationHistory<T extends { role: string; content: string }>(
    history: T[],
    maxLength: number = MAX_CONVERSATION_HISTORY
): T[] {
    if (history.length <= maxLength) {
        return history;
    }

    // Keep most recent messages
    return history.slice(-maxLength);
}

/**
 * AI Error types for better error handling
 */
export enum AIErrorType {
    NETWORK_ERROR = 'NETWORK_ERROR',
    RATE_LIMIT = 'RATE_LIMIT',
    INVALID_API_KEY = 'INVALID_API_KEY',
    PARSING_ERROR = 'PARSING_ERROR',
    TIMEOUT = 'TIMEOUT',
    UNKNOWN = 'UNKNOWN'
}

export interface AIError {
    type: AIErrorType;
    message: string;
    originalError?: unknown;
}

/**
 * Classifies AI errors for better handling
 */
export function classifyAIError(error: unknown): AIError {
    const errorMessage = error instanceof Error ? error.message : String(error);

    // Network errors
    if (errorMessage.includes('fetch') || errorMessage.includes('network')) {
        return {
            type: AIErrorType.NETWORK_ERROR,
            message: 'Error de conexión. Por favor, verifica tu conexión a internet.',
            originalError: error
        };
    }

    // Rate limit
    if (errorMessage.includes('rate limit') || errorMessage.includes('429')) {
        return {
            type: AIErrorType.RATE_LIMIT,
            message: 'Demasiadas solicitudes. Por favor, espera un momento.',
            originalError: error
        };
    }

    // Invalid API key
    if (errorMessage.includes('api key') || errorMessage.includes('401') || errorMessage.includes('403')) {
        return {
            type: AIErrorType.INVALID_API_KEY,
            message: 'Error de autenticación con el servicio de IA.',
            originalError: error
        };
    }

    // Parsing errors
    if (errorMessage.includes('parse') || errorMessage.includes('JSON')) {
        return {
            type: AIErrorType.PARSING_ERROR,
            message: 'Error al procesar la respuesta de IA.',
            originalError: error
        };
    }

    // Timeout
    if (errorMessage.includes('timeout') || errorMessage.includes('timed out')) {
        return {
            type: AIErrorType.TIMEOUT,
            message: 'La solicitud tardó demasiado. Por favor, intenta de nuevo.',
            originalError: error
        };
    }

    // Unknown
    return {
        type: AIErrorType.UNKNOWN,
        message: 'Ocurrió un error inesperado. Por favor, intenta de nuevo.',
        originalError: error
    };
}
