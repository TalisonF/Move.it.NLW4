import { createContext, useState, ReactNode, useEffect } from 'react'
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
    startNewChallenge: ()=> void,
    completeChallenge: () => void
}


export const ChallengeContext = createContext({} as ChallengeContextData);

export function ChallengeProvider({ children } : ChallengeProviderProps) {
    const [level, setLevel] = useState(1);
    const [currentExperience, setCurrentExperience] = useState(0);
    const [challengeCompleted, setChallengeCompleted] = useState(0);
    const [activeChallenge, setActiveChallenge] = useState(null);

    const experienceToNextLevel = Math.pow((level + 1) * 4,2);

    useEffect(()=> {
        Notification.requestPermission();
    },[])

    function levelUp(){
        setLevel(level +1);
    }

    function startNewChallenge(){
        
        const randomChallengeIndex = Math.floor(Math.random() * challenges.length)
        const challenge = challenges[randomChallengeIndex];

        setActiveChallenge(challenge);

        if(Notification.permission === 'granted'){
            new Notification('Novo desafio 😁', {
                body: `Valendo ${challenge.amount}xp!`,
                silent: true
            })
            new Audio('/notification.mp3').play();
        }

    }

    function resetChallenge() {
        setActiveChallenge(null);
    }

    function completeChallenge() {
        if(!activeChallenge){
            return;
        }

        const { amount } = activeChallenge;

        let finalExperience = currentExperience + amount;

        if(finalExperience >= experienceToNextLevel){
            finalExperience = finalExperience - experienceToNextLevel;
            levelUp();
        }

        setCurrentExperience(finalExperience);
        setActiveChallenge(null);
        setChallengeCompleted(challengeCompleted + 1);
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
            startNewChallenge,
            completeChallenge
            }}
        >
            {children}
        </ChallengeContext.Provider>
    )
}

