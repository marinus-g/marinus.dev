import {InjectionToken} from "@angular/core";
import {Environment} from "./ienvironment";
import {environment} from "./environment";

export const ENV = new InjectionToken<Environment>('env')

export function getEnv() {
  return environment;
}
