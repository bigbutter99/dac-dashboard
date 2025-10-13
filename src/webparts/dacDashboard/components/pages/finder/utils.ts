import { Stage } from '../../../data/IDataProvider';

export const trim = (value: string): string => value.replace(/^\s+|\s+$/g, '');

export const ensureSorted = (values: string[]): string[] => [...values].sort((a, b) => a.localeCompare(b));

export const optionLabel = (stage: Stage | string): string => {
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
