import {StringCallback} from "../../util/callback";

export interface History {
  username: string | undefined
  prompt: string | null;
  historyType: HistoryType;
  output: string | StringCallback;
}

export enum HistoryType {
  NORMAL,
  LINE_WRAP,
  BANNER,
  INNER_HTML,
}
