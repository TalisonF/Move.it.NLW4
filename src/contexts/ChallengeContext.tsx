import { createContext, useState, ReactNode } from 'react'
import challenges from '../../challenges.json'

interface ChallengeProviderProps {
    children: ReactNode
}

interface Challenge {
    type: 'body' | 'eye',
    description: string,
    amount: number,
}

interface ChallengeContextData {
    level: number,
    currentExperience: number,
    challengeCompleted: number,
    activeChallenge: Challenge,
    experienceToNextLevel: number,
    resetChallenge: ()=> void,
    levelUp: () => void,
    startNewChallenge: ()=> void
}


export const ChallengeContext = createContext({} as ChallengeContextData);

export function ChallengeProvider({ children } : ChallengeProviderProps) {
    const [level, setLevel] = useState(1);
    const [currentExperience, setCurrentExperience] = useState(42);
    const [challengeCompleted, setChallengeCompleted] = useState(3);
    const [activeChallenge, setActiveChallenge] = useState(null);

    const experienceToNextLevel = Math.pow((level + 1) * 4,2);

    function levelUp(){
        setLevel(level +1);
    }

    function startNewChallenge(){
        const randomChallengeIndex = Math.floor(Math.random() * challenges.length)
        const challenge = challenges[randomChallengeIndex];

        setActiveChallenge(challenge)
    }

    function resetChallenge() {
        setActiveChallenge(null);
    }

    return (
        <ChallengeContext.Provider 
        value={{
            level,
            currentExperience,
            challengeCompleted,
            activeChallenge,
            experienceToNextLevel,
            resetChallenge,
            levelUp,
            startNewChallenge
            }}
        >
            {children}
        </ChallengeContext.Provider>
    )
}

