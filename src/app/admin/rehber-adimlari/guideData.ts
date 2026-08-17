export type GuideStepType = "tour" | "modal";
export type GuideDirection = "bottom" | "top" | "left" | "right";

export type GuideStep = {
  id: string;
  title: string;
  content: string;
  serviceCodes: string;
  target: string;
  type: GuideStepType;
  direction: GuideDirection;
  position: number;
  active: boolean;
  imageNames: string[];
};

const STORAGE_KEY = "eistatistik.admin.guide-steps.v1";

export function readGuideSteps(): GuideStep[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) as GuideStep[] : [];
  } catch {
    return [];
  }
}

export function writeGuideSteps(steps: GuideStep[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(steps));
}
