import { useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ContextMenu from "./ContextMenu";
import { getQuestionMenuData } from "../utils/contextMenuStore";

export default function GlobalContextMenu() {
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
  const location = useLocation();

  const handleContextMenu = useCallback((e: MouseEvent) => {
    e.preventDefault();
    setPosition({ x: e.clientX, y: e.clientY });
  }, []);

  useEffect(() => {
    document.addEventListener("contextmenu", handleContextMenu);
    return () => document.removeEventListener("contextmenu", handleContextMenu);
  }, [handleContextMenu]);

  if (!position) return null;

  const path = location.pathname;
  const pageType =
    path.startsWith("/question/") ? "question" : path === "/" ? "grid" : "general";
  const q = getQuestionMenuData();

  return (
    <ContextMenu
      x={position.x}
      y={position.y}
      onClose={() => setPosition(null)}
      pageType={pageType}
      questionText={path.startsWith("/question/") ? q.questionText : undefined}
      answerText={path.startsWith("/question/") ? q.answerText : undefined}
      onToggleAnswer={path.startsWith("/question/") ? q.onToggleAnswer : undefined}
      onQuickPeek={path.startsWith("/question/") ? q.onQuickPeek : undefined}
    />
  );
}