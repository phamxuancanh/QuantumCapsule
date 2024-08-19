import { IAnswer } from 'api/practice/question.interfaces';
import { createContext, useContext } from 'react';
import { IQuestion } from 'api/practice/question.interfaces';
import { IProvider } from '../provider';


const Context = createContext<IProvider | undefined>(undefined);
export const useTotalScore = () => {
  const context = useContext(Context);
  if (!context) {
    throw new Error('useTotalScore must be used within a Provider');
  }
  return context.totalScore;
}
export const useListQuestion = () => {
  const context = useContext(Context);
  if (!context) {
    throw new Error('useListQuestion must be used within a Provider');
  }
  return context.listQuestion;
}
export const useListAnswer = () => {
  const context = useContext(Context);
  if (!context) {
    throw new Error('uselistAnswer must be used within a Provider');
  }
  return context.listAnswer;
}


export default Context;
