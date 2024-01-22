import {Command} from "./command";
import {History, HistoryType} from "../model/history";

export class Commands {

  @Command('help')
  helpCommand(): string {
    return "help - list all commands\n";
  }

  @Command('echo')
  echoCommand(args: string[]): string {
    return args.join(" ");
  }
  @Command('clear')
  clearCommand(): string | undefined {
    return undefined
  }

  @Command('banner')
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
