import {Injectable} from '@angular/core';
import {Theme} from "../theme/theme";
import themes from '../../themes.json';
import {History, HistoryType} from "../model/history";
import {DomSanitizer} from '@angular/platform-browser';
import {Commands} from "../command/commands";
import {commandRegistry} from '../command/command';

@Injectable({
  providedIn: 'root'

})
export class TerminalService {

  private _themes: Theme[] = themes;
  private _theme: Theme = this._themes[0];
  private header: string | null = "Welcome to my Website!";
  private _history: History[] = [];

  constructor(private sanitizer: DomSanitizer) {


     // TODO: FIX SPACES
    this.appendHistory({
      prompt: null,
      historyType: HistoryType.BANNER,
      output:
        "                                                                                         \n" +
        "  ____    __  ____    _____   ____  ____   _  __   _  ______     _____   ______  __    _ \n" +
        " |    \\  /  ||    \\  |     | |    ||    \\ | ||  | | ||   ___|   |     \\ |   ___|\\  \\  // \n" +
        " |     \\/   ||     \\ |     \\ |    ||     \\| ||  |_| | `-.`-.  _ |      \\|   ___| \\  \\//  \n" +
        " |__/\\__/|__||__|\\__\\|__|\\__\\|____||__/\\____||______||______||_||______/|______|  \\__/   \n" +
        "                                                                                         \n" +
        "                                                                                         \n"  +
        "Login as: guest\n" +
        "guest's password:\n" +
        "" +
        "Welcome to my Website!                                                                                                          \n" +
        "                                                                                                          "
    })
    new Commands();
  }

  handleCommand(command: string): void {
    const splittedCommand = command.split(" ");
    const commandName = splittedCommand[0];
    const args = splittedCommand.slice(1);
    if (!commandRegistry.has(commandName)) {
      this.appendHistory({
        prompt: " " + command,
        output: command + ": command not found. Type 'help' for more information.",
        historyType: HistoryType.NORMAL
      })
      return;
    }
    const commandFunction = commandRegistry.get(commandName);
    if (commandFunction) {
      const output = commandFunction(args);
      if (output === undefined) {
        this.clearHistory()
        return;
      }
      console.log(output)
      if (this.isHistory(output)) {
        const historyAsUnknown = output as unknown;
        const history = historyAsUnknown as History;
        this.appendHistory(history)
        return;
      }
      this.appendHistory({
        prompt: " " + command,
        output: output,
        historyType: HistoryType.NORMAL
      })
      return;
    }
    this.appendHistory({
      prompt: " " + command,
      output: command + ": A error occurred while executing the command!.",
      historyType: HistoryType.NORMAL
    })
  }

  get theme(): Theme {
    return this._theme;
  }

  set theme(value: Theme) {
    this._theme = value;
  }

  get history(): History[] {
    return this._history;
  }

  appendHistory(history: History): void {
    this._history.push(history);
  }

  appendEmptyHistory(): void {
    this._history.push({
      prompt: "",
      output: "",
      historyType: HistoryType.NORMAL
    });
  }

  clearHistory() {
    this._history = [];
  }

  isHistory(obj: any): obj is History {
    try {
      return 'prompt' in obj && 'historyType' in obj && 'output' in obj;

    } catch (e) {
      return false
    }
  }
}
