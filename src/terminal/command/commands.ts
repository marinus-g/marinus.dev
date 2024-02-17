import {Command} from "./command";
import {History, HistoryType} from "../model/history";
import {commandDescription} from "./command";
import {needsPermission} from "./command";
import {TerminalService} from "../service/terminal.service";
import {ComponentFactoryResolver, inject, ViewContainerRef} from "@angular/core";
import {DnsService} from "../service/dns.service";
import {Dns} from "../model/dns";
import {UserService} from "../../shared/service/user.service";
import {ContentService} from "../../shared/service/content.service";
import {AuthenticationService} from "../../shared/service/authentication.service";
import {ViewService} from "../../shared/service/view.service";
import {ContentComponent} from "../../content/component/content/content.component";

export class Commands {

  constructor() {
  }

  @Command('help', "help  - list all commands", ["help"])
  helpCommand(): History {
    const contentService = inject(ContentService);
    const userService = inject(UserService)
    const output: string[] = [];
    commandDescription.forEach((value, key) => {
      if (((!needsPermission.has(key)) || (userService.registeredUser != null
        && userService.registeredUser.roles.find(role => role.commands.includes(key) || role.commands.includes("*"))))) {
        output.push(`${value}`)
      }
    });
    return {
      username: contentService.getUserName(),
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
    const contentService = inject(ContentService);
    return {
      username: contentService.getUserName(),
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
    const contentService = inject(ContentService);
    return {
      username: contentService.getUserName(),
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
  async pingCommand(args: string[]): Promise<History> {
    const contentService = inject(ContentService);
    if (args.length == 0) {
      return {
        username: contentService.getUserName(),
        prompt: " ping",
        historyType: HistoryType.LINE_WRAP,
        output: "usage: ping <ip/domain>"
      }
    }
    const terminalService = inject(TerminalService);
    terminalService.disableInput = true;
    const domain = args[0];
    let dns: Dns | undefined = {
      domain: domain,
      ip: domain
    };
    const dnsService = inject(DnsService);
    if (!domain.match(/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/)) {
      dns = await dnsService.resolveDns(domain);
    }

    const constDns = dns; // this shit is ugly af - fix me?
    if (constDns == undefined || constDns.ip == undefined) {
      terminalService.disableInput = false
      return {
        username: contentService.getUserName(),
        prompt: " ping " + domain,
        historyType: HistoryType.LINE_WRAP,
        output: "ping: " + domain + ": Name or service not known"
      }
    }
    const history = {
      username: contentService.getUserName(),
      prompt: " ping " + constDns.domain,
      historyType: HistoryType.LINE_WRAP,
      output: "PING " + constDns.domain + " (" + constDns.ip + ") 56(84) bytes of data."
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
        terminalService.ping(constDns.ip).then(value => {
          history.output = history.output + "\n64 bytes from " + dns?.domain + " (" + dns?.ip + ")" + ": icmp_seq=1 ttl=64 time=" + value + "ms"
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
            history.output = history.output + "\n--- " + constDns.domain + " ping statistics ---\n";
            history.output = history.output + " " + pings + " packets transmitted, " + times.length + " received, " + Math.round(100 - (times.length / pings * 100)) + "% packet loss, avg response time " + (avg.toString() == 'NaN' ? '-1' : Math.round(avg)) + "ms\n";
          }
        })
      }, i * 1000)
    }
    return history;
  }

  @Command('su', "su - change the user", ["su <user>"])
  async suCommand(args: string[]): Promise<History> {
    const contentService = inject(ContentService);
    if (args.length < 1) {
      return {
        username: contentService.getUserName(),
        prompt: " su",
        historyType: HistoryType.LINE_WRAP,
        output: "usage: su <user>"
      }
    }
    if (args[0].match("-")) {
      args[0] = args[0].replace("-", "root")
    }
    const userService = inject(UserService)
    const terminalService = inject(TerminalService);
    terminalService.disableInput = true;
    const userExists = await userService.isUserExist(args[0]);
    if (!userExists) {
      terminalService.disableInput = false;
      return {
        username: contentService.getUserName(),
        prompt: " su " + args[0],
        historyType: HistoryType.LINE_WRAP,
        output: "su: user " + args[0] + " does not exist"
      }
    } else {
      terminalService.disableInput = true; // TODO: Implement user password
      terminalService.userToChangeTo = args[0];
      terminalService.startPasswordInput("Password:")
      return {
        username: contentService.getUserName(),
        prompt: " su " + args[0],
        historyType: HistoryType.LINE_WRAP,
        output: ""
      }
    }
  }

  @Command('exit', "exit - exit the terminal", ["exit"], ["quit", "logout"])
  exitCommand(): string {
    const userService = inject(UserService);
    if (userService.registeredUser != null) {
      const authService = inject(AuthenticationService);
      userService.registeredUser = null;
      authService.deleteRegisteredUserToken();
      return "Goodbye!"
    }
    const terminalService = inject(TerminalService);

    terminalService.disableInput = true;
    setTimeout(() => {
      window.location.reload() // TODO: Implement back to terminal page
      // window.open('','_parent','');
    }, 500)
    return "Goodbye!"
  }

  @Command('whoami', "whoami - display the current user", ["whoami"])
  whoamiCommand(): string {
    const contentService = inject(ContentService);
    return contentService.getUserName();
  }

  @Command('ls', "ls - list the files in the current directory", ["ls"])
  lsCommand(): string {
    return "about.txt  projects  contact.txt"
  }

  @Command('cat', "cat - display the content of a file", ["cat <file>"])
  catCommand(args: string[]): string | History {
    const contentService = inject(ContentService);
    return "todo"
  }

  @Command('adduser', "adduser - add a user", ["adduser <user>"], [], true)
  adduserCommand(args: string[]): string | History {
    const contentService = inject(ContentService);
    return "todo"
  }

  @Command('deluser', "deluser - remove a user", ["deluser <user>"], [], true)
  removeuserCommand(args: string[]): string | History {
    const contentService = inject(ContentService);
    return "todo"
  }

  @Command('users', "users - list the users", ["users"], [], true)
  usersCommand(): string | History {
    const contentService = inject(ContentService);
    return "todo"
  }

  @Command('usermod', "usermod - modify a user", ["usermod <user>"], [], true)
  usermodCommand(args: string[]): string | History {
    const contentService = inject(ContentService);
    return "todo"
  }

  @Command('passwd', "passwd - change the password", ["passwd"], [], true)
  passwdCommand(): string | History {
    const contentService = inject(ContentService);
    return "todo"
  }

  @Command('addrole', "addrole - add a role", ["addrole <role>"], [], true)
  addroleCommand(args: string[]): string | History {
    const contentService = inject(ContentService);
    return "todo"
  }

  @Command('delrole', "delrole - remove a role", ["delrole <role>"], [], true)
  removeroleCommand(args: string[]): string | History {
    const contentService = inject(ContentService);
    return "todo"
  }

  @Command('roles', "roles - list the roles", ["roles"], [], true)
  rolesCommand(): string | History {
    const contentService = inject(ContentService);
    return "todo"
  }


  @Command('addcommand', "addcommand - add a command", ["addcommand <command>"], [], true)
  addCommandCommand(args: string[]): string | History {
    const contentService = inject(ContentService);
    return "todo"
  }


  @Command('delcommand', "delcommand - remove a command", ["delcommand <command>"], [], true)
  removeCommandCommand(args: string[]): string | History {
    const contentService = inject(ContentService);
    return "todo"
  }

  @Command('commands', "commands - list the commands", ["commands"], [], true)
  commandsCommand(): string | History {
    const contentService = inject(ContentService);
    return "todo"
  }

  @Command('editcommand', "editcommand - edit a command", ["editcommand <command>"], [], true)
  editCommandCommand(args: string[]): string | History {
    const contentService = inject(ContentService);
    return "todo"
  }

  @Command('addtheme', "addtheme - add a theme", ["addtheme <theme>"], [], true)
  addThemeCommand(args: string[]): string | History {
    const contentService = inject(ContentService);
    return "todo"
  }

  @Command('deltheme', "deltheme - remove a theme", ["deltheme <theme>"], [], true)
  removeThemeCommand(args: string[]): string | History {
    const contentService = inject(ContentService);
    return "todo"
  }

  @Command('themes', "themes - list the themes", ["themes"], [], true)
  themesCommand(): string | History {
    const contentService = inject(ContentService);
    return "todo"
  }

  @Command(
    'content', "content - manage content", ["content"], [], false)
  contentCommand(): string | History {
    const contentService = inject(ContentService);
    const viewService = inject(ViewService);
    viewService.currentView =  ContentComponent;
    return "todo"
  }

}

export function

displayThemeHelp(terminalService: TerminalService): History {
  const username = inject(ContentService).getUserName();
  return {
    username: username,
    prompt: " theme",
    historyType: HistoryType.LINE_WRAP,
    output: "Current theme: " + terminalService.theme.name + "\n" +
      "Available themes: " + terminalService
        .themes.map(theme => theme.name).join(", ") + "\n" +
      "usage: theme <theme> to change the applied theme!"
  }
}
