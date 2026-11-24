// Shared store so any page can register page-specific context-menu data.
// The global context menu (mounted once in App) reads from here on right-click.

type QuestionMenuData = {
  questionText?: string;
  answerText?: string;
  onToggleAnswer?: () => void;
  onQuickPeek?: () => void;
};

let menuData: QuestionMenuData = {};

export function setQuestionMenuData(data: QuestionMenuData) {
  menuData = data;
}

export function getQuestionMenuData(): QuestionMenuData {
  return menuData;
}

export function clearQuestionMenuData() {
  menuData = {};
}