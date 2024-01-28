import {StringCallback} from "../../util/Callback";

export interface History {
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
