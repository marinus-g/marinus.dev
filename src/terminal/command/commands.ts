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


  @Command('repo', "repo - show the repository", ["repo"])
  repoCommand(): string {
    window.open("https://github.com/marinus-g/marinus.dev", "_blank")
    return "Opened repository in new tab!"
  }

  @Command('github', "github - show the github", ["github"])
  githubCommand(): History {
    const terminalService = inject(TerminalService);
    return {
      prompt: " github",
      historyType: HistoryType.INNER_HTML,
      output: () => {
        return "<span style='color: " + terminalService.theme.terminal.highlightColor + ";'>Auf meinen Github Accounts finden Sie viele öffentliche Repositories.\n" +
          "<a style='color: " + terminalService.theme.terminal.clickableColor + ";' target='_blank' href=\"https://github.com/marinus-g\">Github</a>\n" +
          "<a style='color: " + terminalService.theme.terminal.clickableColor + ";' target='_blank' href='https://github.com/Vantrex'>Privates Github</a></span>"
      }
    }
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
        "\n" +
        "Welcome to my Website!\n" +
        "                                                                                                          "
    }
  }

  @Command('reload', "reload - reload the page", ["reload"], ["rl", "refresh"])
  reloadCommand(): string {
    window.location.reload()
    return "Reloading the page.."
  }

  @Command('ping', "ping - ping a ip or domain", ["ping <ip/domain>"], ["p"])
  pingCommand(args: string[]): History {
    if (args.length == 0) {
      return {
        prompt: " ping",
        historyType: HistoryType.LINE_WRAP,
        output: "usage: ping <ip/domain>"
      }
    }
    const ip = args[0];
    const terminalService = inject(TerminalService);
    terminalService.disableInput = true;
    const history = {
      prompt: " ping " + ip,
      historyType: HistoryType.LINE_WRAP,
      output: "PING " + ip
    }
    const times: number[] = [];
    let pings = 0;
    let timeout = false;
    for (let i = 0; i < 3; i++) {
      if (terminalService.breakForLoops) {
        history.output = history.output + "\nRequest canceled!"
        break;
      }
      setTimeout(() => {
        pings++;
        terminalService.ping(ip).then(value => {
          history.output = history.output + "\n64 bytes from " + ip + ": icmp_seq=1 ttl=64 time=" + value + "ms"
          times.push(value);
        }).catch(reason => {
          if (timeout) {
            return;
          }
          timeout = true;
          history.output = history.output + "\nRequest timed out!"
        }).finally(() => {
          if (i == 2) {
            terminalService.disableInput = false;
            const avg = times.reduce((a, b) => a + b, 0) / times.length;
            history.output = history.output + "\n--- " + ip + " ping statistics ---\n";
            history.output = history.output + " " + pings +  " packets transmitted, " + times.length + " received, " + Math.round(100 - (times.length / pings * 100)) + "% packet loss, avg response time " + (avg.toString() == 'NaN' ? '-1' : Math.round(avg)) + "ms\n";
          }
        })
      }, i * 1000)
    }
    return history;
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
