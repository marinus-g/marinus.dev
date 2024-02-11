import {Inject, Injectable, Injector, input, runInInjectionContext} from '@angular/core';
import {Theme} from "../model/theme/theme";
import themes from '../themes.json';
import {History, HistoryType} from "../model/history";
import {DomSanitizer} from '@angular/platform-browser';
import {Commands} from "../terminal/command/commands";
import {commandAliases, commandRegistry, needsPermission} from '../terminal/command/command';
import {ContentService} from "./content.service";
import {AuthenticationService} from "./authentication.service";
import {UserService} from "./user.service";
import {ENV} from "../environments/environment.provider";
import {Environment} from "../environments/ienvironment";

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
  private _contentService: ContentService | undefined = undefined;
  private _passwordInput: boolean = false;
  private _passwordFieldLabel: string = "";
  private _userToChangeTo: string = "";


  constructor(private sanitizer: DomSanitizer, private injector: Injector,
              private authenticationService: AuthenticationService, private userService: UserService, @Inject(ENV) private env: Environment) {
    new Commands();
  }


  set lastCommandIndex(value: number) {
    this._lastCommandIndex = value;
  }

  set contentService(value: ContentService) {
    this._contentService = value;
    const loginUserName = this._contentService?.getUserName();
    const date = new Date();
    this.appendHistory({
      username: this._contentService?.getUserName(),
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
          "Login as: " + loginUserName + "\n" +
          loginUserName + (loginUserName.endsWith("s") ? "" : "`s") + " password:\n" +
          " \n" +
          "Last login: " + date.toDateString() + " " + date.toLocaleTimeString() + " on " + this.getBrowserName() + "\n" +
          " \n"
      }
    })
  }

  get contentService(): ContentService | undefined {
    return this._contentService;
  }

  init(contentService: ContentService) {
    const terminalService = this;

    function buildInlineHtml(html: string) { // ty copilot for the help. I did not know that you can use "functions" after the replace method.
      let regex = /\{\[\{(.+?)\}\]\}/g;
      return html.replace(regex, (match) => {
        let textInsideBrackets = match.slice(3, -3);
        let replacement;
        switch (textInsideBrackets) {
          case "terminal#informationColor":
            replacement = terminalService._theme.terminal.informationColor;
            break;
          case "terminal#primaryColor":
            replacement = terminalService._theme.terminal.primaryColor;
            break;
          case "terminal#highlightColor":
            replacement = terminalService._theme.terminal.highlightColor;
            break
          case "terminal#warningColor":
            replacement = terminalService._theme.terminal.warningColor;
            break;
          case "terminal#backgroundColor":
            replacement = terminalService._theme.terminal.backgroundColor;
            break;
          case "terminal#clickableColor":
            replacement = terminalService._theme.terminal.clickableColor;
            break;
          default:
            replacement = "unknown";
        }
        return replacement;
      });
    }

    contentService.getWelcomeScreenContent().flatMap(value => {
      return value.welcomeMessage
    })
      .forEach(value => {
        this.appendHistory({
          username: this._contentService?.getUserName(),
          prompt: null,
          historyType: HistoryType.INNER_HTML,
          output() {
            return buildInlineHtml(value);
          }
        })
      })
  }


  get lastCommandIndex(): number {
    return this._lastCommandIndex;
  }

  get commandHistory(): string[] {
    return this._commandHistory;
  }

  async handleCommand(command: string): Promise<void> {
    const splittedCommand = command.split(" ");
    const commandName = splittedCommand[0];
    if (commandName == "!!") {
      if (this._commandHistory.length == 0) {
        this.appendHistory({
          username: this._contentService?.getUserName(),
          prompt: " !!",
          output: "No commands in history.",
          historyType: HistoryType.NORMAL
        });
        return;
      }
      await this.handleCommand(this._commandHistory[this._commandHistory.length - 1]);
      return;
    }
    const args = splittedCommand.slice(1).filter(value => value.length > 0);
    this._commandHistory.push(command);
    this.lastCommandIndex = -1;
    runInInjectionContext(this.injector, () => {
      const userService = this.injector.get(UserService);

      if ((!commandRegistry.has(commandName) && !commandAliases.has(commandName)) ||
        (needsPermission.has(commandName) && (userService.registeredUser == null
          || !userService.registeredUser.roles
            .find(role => role.commands.includes(commandName) || role.commands.includes("*"))))) {
        this.appendHistory({
          username: this._contentService?.getUserName(),
          prompt: " " + command,
          output: command + ": command not found. Type 'help' for more information.",
          historyType: HistoryType.NORMAL
        })
        return;
      }
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
        if (this.isHistoryPromise(output)) {
          const history = output;
          history.then(value => {
            this.appendHistory(value);
          })
          return;
        }
        if (this.isHistory(output)) {
          const historyAsUnknown = output as unknown;
          const history = historyAsUnknown as History;
          this.appendHistory(history)
          return;
        }
        this.appendHistory({
          username: this._contentService?.getUserName(),
          prompt: " " + command,
          output: output,
          historyType: HistoryType.NORMAL
        })
        return;
      }
      this.appendHistory({
        username: this._contentService?.getUserName(),
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
      username: this._contentService?.getUserName(),
      prompt: "",
      output: "",
      historyType: HistoryType.NORMAL
    });
  }

  clearHistory() {
    this._history = [];
  }

  isHistoryPromise(obj: any): obj is Promise<History> {
    try {
      return 'then' in obj && 'catch' in obj;
    } catch (e) {
      return false
    }
  }


  isHistory(obj: any): obj is History {
    try {
      return 'prompt' in obj && 'historyType' in obj && 'output' in obj;
    } catch (e) {
      return false
    }
  }

  async ping(url: string): Promise<number> {
    url = url.replace("http://", "").replace("https://", "");
    url = (this.env.production ? "http://" : "http://") + url;
    const start = new Date().getTime();
    const response = await fetch(url, {mode: 'no-cors'});
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

  get passwordInput(): boolean {
    return this._passwordInput;
  }

  set passwordInput(value: boolean) {
    this._passwordInput = value;
  }

  get passwordFieldLabel(): string {
    return this._passwordFieldLabel;
  }


  get userToChangeTo(): string {
    return this._userToChangeTo;
  }

  set userToChangeTo(value: string) {
    this._userToChangeTo = value;
  }

  startPasswordInput(label: string) {
    this._passwordFieldLabel = label;
    this.passwordInput = true;
  }

  handlePasswordInput(input: string) {
    this.passwordInput = false;
    this._passwordFieldLabel = "";
    this.authenticationService.authenticate({login: this._userToChangeTo, password: input}).then(value => {
      if (value == undefined) {
        this.disableInput = false;
        this.appendHistory({
          username: this._contentService?.getUserName(),
          prompt: " su " + this._userToChangeTo,
          historyType: HistoryType.LINE_WRAP,
          output: "su: Authentication failure"
        })
        return;
      }
      const nameBeforeChange = this._contentService?.getUserName();
      this.userService.updaterRegisteredUser()
        .finally(() => {
          this._history = this._history.slice(0, this.history.length - 1)
          this.appendHistory({
            username: nameBeforeChange,
            prompt: " su " + this._userToChangeTo,
            historyType: HistoryType.LINE_WRAP,
            output: "Logged in as " + this._userToChangeTo + " successfully!"
          })
          this.disableInput = false;
        })
    })
  }
}
