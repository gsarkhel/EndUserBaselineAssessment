export interface languageTranslator {
  children: JSX.Element | JSX.Element[] | null;
  languageFile: any;
}

export type recuresiveAnimType = createjs.MovieClip & {
  [key: string]: recuresiveAnimType;
};

export interface tabsInterface {
  title: string;
  description: string;
  numberOfQuestions: number | { [key: string]: number };
  questionBank: any[];
  bgImage: string;
}

export interface generalConfigInterface {
  passingCriteria: number;
  totalMarks: number;
  numberOfQuestions: number;
  timeForNext: number;
  totalAttempts: number;
  activityName: string;
  showIcons: boolean;
  shuffleQuestions: boolean;
}

export interface extendedTabs extends tabsInterface {
  id: string;
  totalScore: number;
  bgImage: string;
}

