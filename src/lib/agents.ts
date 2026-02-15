// C-Level Agent Personas
export interface Agent {
    id: string;
    name: string;
    role: string;
    avatar: string;
    color: string;
    description: string;
}

export const agents: Agent[] = [
    {
        id: 'cfo',
        name: 'Victoria Chen',
        role: 'CFO',
        avatar: '💰',
        color: '#4CAF50',
        description: 'Directora Financiera - Enfocada en rentabilidad y gestión de riesgos'
    },
    {
        id: 'cto',
        name: 'Marcus Rodriguez',
        role: 'CTO',
        avatar: '⚙️',
        color: '#2196F3',
        description: 'Director de Tecnología - Experto en arquitectura e innovación técnica'
    },
    {
        id: 'cio',
        name: 'Sarah Kim',
        role: 'CIO',
        avatar: '📊',
        color: '#9C27B0',
        description: 'Directora de Información - Especialista en datos y sistemas empresariales'
    },
    {
        id: 'cdo',
        name: 'James Foster',
        role: 'CDO',
        avatar: '🎯',
        color: '#FF9800',
        description: 'Director Digital - Líder en transformación digital y experiencia del cliente'
    }
];
