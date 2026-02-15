
import { create } from 'zustand';

interface GameState {
    companyName: string;
    industry: string;
    country: string;
    goals: string[];
    documents: any[];

    // Boardroom State
    activeSpeaker: string | null;
    presentExecutives: string[];

    setCompanyName: (name: string) => void;
    setIndustry: (industry: string) => void;
    setCountry: (country: string) => void;
    addGoal: (goal: string) => void;
    addDocument: (doc: string) => void;

    setActiveSpeaker: (agentId: string | null) => void;
    addExecutive: (agentId: string) => void;
    removeExecutive: (agentId: string) => void;
    reset: () => void;
}

export const useGameStore = create<GameState>((set) => ({
    companyName: '',
    industry: '',
    country: '',
    goals: [],
    documents: [],

    activeSpeaker: null,
    presentExecutives: [],

    setCompanyName: (name) => set({ companyName: name }),
    setIndustry: (industry) => set({ industry }),
    setCountry: (country) => set({ country }),
    addGoal: (goal) => set((state) => ({ goals: [...state.goals, goal] })),
    addDocument: (doc) => set((state) => ({ documents: [...state.documents, doc] })),

    setActiveSpeaker: (agentId) => set({ activeSpeaker: agentId }),
    addExecutive: (agentId) => set((state) => ({
        presentExecutives: state.presentExecutives.includes(agentId)
            ? state.presentExecutives
            : [...state.presentExecutives, agentId]
    })),
    removeExecutive: (agentId) => set((state) => ({
        presentExecutives: state.presentExecutives.filter(id => id !== agentId)
    })),
    reset: () => set({
        companyName: '',
        industry: '',
        country: '',
        goals: [],
        documents: [],
        activeSpeaker: null,
        presentExecutives: []
    }),
}));
