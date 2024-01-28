export const commandRegistry = new Map<string, Function>();
export const commandUsage = new Map<string, string>();
export const commandDescription = new Map<string, string>();
export const commandAliases = new Map<string, string>();

export function Command(command: string, description: string, usage: string[], aliases?: string[]) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    commandRegistry.set(command, descriptor.value);
    commandDescription.set(command, description)
    commandUsage.set(command, usage.join("\n"))
    if (aliases != undefined) {
      console.log("aliases: " + aliases)
      aliases.forEach(alias => commandAliases.set(alias, command))
    }
  }
}
