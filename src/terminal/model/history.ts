export interface History {
  prompt: string | null;
  historyType: HistoryType;
  output: string;
}

export enum HistoryType {
  NORMAL,
  LINE_WRAP,
  BANNER
}
