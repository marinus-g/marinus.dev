export const commandRegistry = new Map<string, Function>();


export function Command(command: string, description?: string[]) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    commandRegistry.set(command, descriptor.value);
  }
}
