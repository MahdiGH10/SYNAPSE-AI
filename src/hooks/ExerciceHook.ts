export interface Exercice {
    userID : string;
    title: string;
    type: 'qcm' | 'problemes' | 'etudes_de_cas';
    questions: String[];
    correctAnswers: String[];
    createdAt: Date;
    updatedAt: Date;
}
export const useExercice = () => {
    const createExercice = async (exercice: Omit<Exercice, 'createdAt' | 'updatedAt'>) => {
        const response = await fetch('/api/Exercice', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(exercice),
        });
        return response.json();
    };

    const fetchExercicesByUser = async (userID: string) => {
        const response = await fetch(`/api/Exercice/${userID}`, {
            method: 'GET',
        });
        return response.json();
    }; 
    return {
        createExercice,
        fetchExercicesByUser,
    };
}