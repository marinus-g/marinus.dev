import {Command} from "./command";
import {History, HistoryType} from "../model/history";
import {commandDescription} from "./command";
import {TerminalService} from "../service/terminal.service";
import {inject} from "@angular/core";

export class Commands {

  constructor() {
  }

  @Command('help', "help  - list all commands", ["help"])
  helpCommand(): History {
    const output: string[] = [];
    commandDescription.forEach((value, key) => {
      output.push(`${value}`)
    });
    return {
      prompt: " help",
      historyType: HistoryType.LINE_WRAP,
      output: output.join("\n")
    }
  }

  @Command('echo', "echo - echo the arguments", ["echo <args>"])
  echoCommand(args: string[]): string {
    return args.join(" ");
  }

  @Command('clear', "clear - clear the terminal", ["clear"])
  clearCommand(): string | undefined {
    return undefined
  }

  @Command('theme', "theme - change the theme", ["theme <theme>"])
  themeCommand(args: string[]): string | History {
    const terminalService = inject(TerminalService);
    if (args.length == 0) {
      return displayThemeHelp(terminalService)
    }
    const themeName = args[0];
    const theme = terminalService.findTheme(themeName)
    if (theme == undefined) {
      return 'Theme "' + args[0] + '" not found!'
    }
    terminalService.theme = theme;
    return "Theme changed successfully!";
  }


  @Command('banner', "banner - show the banner", ["banner"])
  bannerCommand(): History {
    return {
      prompt: " banner",
      historyType: HistoryType.BANNER,
      output: "" +
        "                                      ███                                       █████                     \n" +
        "                                     ░░░                                       ░░███                      \n" +
        " █████████████    ██████   ████████  ████  ████████   █████ ████  █████      ███████   ██████  █████ █████\n" +
        "░░███░░███░░███  ░░░░░███ ░░███░░███░░███ ░░███░░███ ░░███ ░███  ███░░      ███░░███  ███░░███░░███ ░░███ \n" +
        " ░███ ░███ ░███   ███████  ░███ ░░░  ░███  ░███ ░███  ░███ ░███ ░░█████    ░███ ░███ ░███████  ░███  ░███ \n" +
        " ░███ ░███ ░███  ███░░███  ░███      ░███  ░███ ░███  ░███ ░███  ░░░░███   ░███ ░███ ░███░░░   ░░███ ███  \n" +
        " █████░███ █████░░████████ █████     █████ ████ █████ ░░████████ ██████  ██░░████████░░██████   ░░█████   \n" +
        "░░░░░ ░░░ ░░░░░  ░░░░░░░░ ░░░░░     ░░░░░ ░░░░ ░░░░░   ░░░░░░░░ ░░░░░░  ░░  ░░░░░░░░  ░░░░░░     ░░░░░    \n" +
        "                                                                                                          \n" +
        "Welcome to my Website!                                                                                                          \n" +
        "                                                                                                          "
    }
  }

}

export function displayThemeHelp(terminalService: TerminalService): History {
  return {
    prompt: " theme",
    historyType: HistoryType.LINE_WRAP,
    output: "Current theme: " + terminalService.theme.name + "\n" +
      "Available themes: " + terminalService
        .themes.map(theme => theme.name).join(", ") + "\n" +
      "usage: theme <theme> to change the applied theme!"
  }
}
