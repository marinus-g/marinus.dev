import {Inject, Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {END_POINT} from "../util/consts";
import {Dns} from "../model/dns";
import {firstValueFrom} from "rxjs";
import {ENV} from "../environments/environment.provider";
import {Environment} from "../environments/ienvironment";

@Injectable({
  providedIn: 'root'
})
export class DnsService {

  private readonly dnsCache: Map<string, Dns> = new Map<string, Dns>();

  constructor(private http: HttpClient, @Inject(ENV) private env: Environment) {

  }

  public async resolveDns(domain: string): Promise<Dns | undefined> {
    if (this.dnsCache.has(domain)) {
      return <Dns>this.dnsCache.get(domain);
    }
    const ip = await this.resolveFromBackend(domain);
    if (ip !== undefined) {
      this.dnsCache.set(domain, ip);
    }
    return ip;
  }

  private async resolveFromBackend(domain: string): Promise<Dns | undefined> {
    const $response = this.http.get<Dns>(this.env.apiUrl + END_POINT.DNS_RESOLVE + domain, {observe: 'response'})
    const response = firstValueFrom($response)
    try {
      const value = await response;
      if (value.status === 200) {
        return value.body as Dns;
      }
      return undefined;
    } catch (error) {
      return undefined;
    }
  }
}
