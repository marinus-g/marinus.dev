import {Injectable, Injector, runInInjectionContext} from '@angular/core';
import {Theme} from "../theme/theme";
import themes from '../../themes.json';
import {History, HistoryType} from "../model/history";
import {DomSanitizer} from '@angular/platform-browser';
import {Commands} from "../command/commands";
import {commandAliases, commandRegistry} from '../command/command';

@Injectable({
  providedIn: 'root'

})
export class TerminalService {

  private _themes: Theme[] = themes;
  private _theme: Theme = this._themes[0];
  private header: string | null = "Welcome to my Website!";
  private _history: History[] = [];
  private _commandHistory: string[] = [];
  private _lastCommandIndex = -1;

  private _disableInput = false;
  private _breakForLoops = false;

  constructor(private sanitizer: DomSanitizer, private injector: Injector) {

    const date = new Date();
    this.appendHistory({
      prompt: null,
      historyType: HistoryType.INNER_HTML,
      output: () => {
        return "\n" +
        "<span style='color: whitesmoke'>  ____    __  ____    _____   ____  ____   _  __   _  ______     _____   ______  __    _ </span>\n" +
        "<span style='color: whitesmoke'> |    \\  /  ||    \\  |     | |    ||    \\ | ||  | | ||   ___|   |     \\ |   ___|\\  \\  // </span>\n" +
        "<span style='color: whitesmoke'> |     \\/   ||     \\ |     \\ |    ||     \\| ||  |_| | `-.`-.  _ |      \\|   ___| \\  \\//  </span>\n" +
        "<span style='color: whitesmoke'> |__/\\__/|__||__|\\__\\|__|\\__\\|____||__/\\____||______||______||_||______/|______|  \\__/   </span>\n" +
        " \n" +
        " \n" +
        "Login as: guest\n" +
        "guest's password:\n" +
        " \n" +
        "Last login: " + date.toDateString() + " " + date.toLocaleTimeString() + " on " + this.getBrowserName() + "\n" +
        " \n" +
        "<span style='color: " + this.theme.terminal.highlightColor + ";'><span style='text-decoration-line: underline; color: "+this.theme.terminal.warningColor+"'>Hello World!</span> I´m Marinus.</span!\n" +
        "<span style='color: " + this.theme.terminal.informationColor + "; line-height: 0.4'> > Mit 16 Jahren habe ich meine Leidenschaft für das Programmieren entdeckt.</span>\n" +
        "<span style='color: " + this.theme.terminal.informationColor + "; line-height: 0.4'> > Über 8 Jahre Erfahrung in Java.</span>\n" +
        "<span style='color: " + this.theme.terminal.informationColor + "; line-height: 0.4'> > Schnelle Einarbeitung in neue Sprachen/Frameworks durch langjährige Erfahrung.\n</span>" +
        "<span style='color: " + this.theme.terminal.informationColor + "; line-height: 0.4'> > In Zukunft strebe ich eine Position als Programmierer in Ihrem Unternehmen an, um meine Fähigkeiten weiter auszubauen\n" +
          "<span style='color: " + this.theme.terminal.informationColor + "; line-height: 0.4'>   und einen wesentlichen Beitrag zum Erfolg ihres Unternehmens zu leisten.</span>"
        // "<button style=\"background-color: transparent; color: red; text-decoration-line: underline; border: none; padding: 0;\">Click here</button>, for more information about me"
      }
    })
    new Commands();
  }


  set lastCommandIndex(value: number) {
    this._lastCommandIndex = value;
  }


  get lastCommandIndex(): number {
    return this._lastCommandIndex;
  }

  get commandHistory(): string[] {
    return this._commandHistory;
  }

  handleCommand(command: string): void {
    const splittedCommand = command.split(" ");
    const commandName = splittedCommand[0];
    if (commandName == "!!") {
      if (this._commandHistory.length == 0) {
        this.appendHistory({
          prompt: " !!",
          output: "No commands in history.",
          historyType: HistoryType.NORMAL
        });
        return;
      }
      this.handleCommand(this._commandHistory[this._commandHistory.length - 1]);
      return;
    }
    const args = splittedCommand.slice(1).filter(value => value.length > 0);
    this._commandHistory.push(command);
    this.lastCommandIndex = -1;
    if (!commandRegistry.has(commandName) && !commandAliases.has(commandName)) {
      this.appendHistory({
        prompt: " " + command,
        output: command + ": command not found. Type 'help' for more information.",
        historyType: HistoryType.NORMAL
      })
      return;
    }
    runInInjectionContext(this.injector, () => {
      let commandFunction = commandRegistry.get(commandName);
      if (!commandFunction) {
        const alias = commandAliases.get(commandName);
        if (alias) {
          commandFunction = commandRegistry.get(alias);
        }
      }
      if (commandFunction) {
        const output = commandFunction(args);
        if (output === undefined) {
          this.clearHistory()
          return;
        }
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
    });
  }

  commandRegistry(): Map<string, Function> {
    return commandRegistry;
  }

  public findTheme(themeName: string): Theme | undefined {
    return this.themes.find(theme => theme.name.toLowerCase() == themeName.toLowerCase());
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

  async ping(url: string): Promise<number> {
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      url = "http://" + url;
    }
    const start = new Date().getTime();
    const response = await fetch(url, { mode: 'no-cors' });
    console.log(response)

    if (response.status == 503) {
      throw new Error(`HTTP request failed: ${response.status}`);
    }
    const end = new Date().getTime();
    return end - start;
  }

  get themes(): Theme[] {
    return this._themes;
  }


  get disableInput(): boolean {
    return this._disableInput;
  }

  set disableInput(value: boolean) {
    this._disableInput = value;
  }

  get breakForLoops(): boolean {
    return this._breakForLoops;
  }

  set breakForLoops(value: boolean) {
    this._breakForLoops = value;
  }

  set themes(value: Theme[]) {
    this._themes = value;
  }

  getBrowserName() {
    const agent = window.navigator.userAgent.toLowerCase()
    switch (true) {
      case agent.indexOf('edge') > -1:
        return 'edge';
      case agent.indexOf('opr') > -1 && !!(<any>window).opr:
        return 'opera';
      case agent.indexOf('chrome') > -1 && !!(<any>window).chrome:
        return 'chrome';
      case agent.indexOf('trident') > -1:
        return 'ie';
      case agent.indexOf('firefox') > -1:
        return 'firefox';
      case agent.indexOf('safari') > -1:
        return 'safari';
      default:
        return 'other';
    }
  }
}
