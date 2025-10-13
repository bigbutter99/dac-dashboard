import { RAG, Stage, Trust } from '../../../data/IDataProvider';
import type { BadgeTone } from '../../primitives/Badge';

export const ragTone = (rag: RAG): BadgeTone => {
  switch (rag) {
    case RAG.Green:
      return 'success';
    case RAG.Amber:
      return 'warning';
    case RAG.Red:
      return 'danger';
    default:
      return 'neutral';
  }
};

export const trustScore = (trust: Trust): string => {
  switch (trust) {
    case Trust.High:
      return '0.90';
    case Trust.Medium:
      return '0.65';
    case Trust.Low:
      return '0.35';
    default:
      return '0.20';
  }
};

export const stageLabel = (stage: Stage | string): string => {
  switch (stage) {
    case Stage.Concept:
      return 'Concept';
    case Stage.Pilot:
      return 'Pilot';
    case Stage.Demo:
      return 'Demo';
    case Stage.CommercialPilot:
      return 'Commercial pilot';
    case Stage.Commercial:
      return 'Commercial';
    default:
      return stage;
  }
};

export const formatDate = (iso?: string): string => {
  if (!iso) {
    return '—';
  }
  try {
    return new Date(iso).toLocaleDateString();
  } catch {
    return iso;
  }
};
