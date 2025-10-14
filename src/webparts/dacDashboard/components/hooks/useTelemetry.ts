export interface Telemetry {
  track: (event: string, data?: Record<string, unknown>) => void;
}

export const useTelemetry = (): Telemetry => {
  const track = (event: string, data?: Record<string, unknown>): void => {
    if (data) {
      // eslint-disable-next-line no-console
      console.debug('[telemetry]', event, data);
    } else {
      // eslint-disable-next-line no-console
      console.debug('[telemetry]', event);
    }
  };

  return { track };
};

export default useTelemetry;
