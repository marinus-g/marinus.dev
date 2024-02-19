import {Theme} from "./theme";
import {Role} from "./role";

interface Authenticatable {

}


interface User extends Authenticatable {
  id: number
  username: string
}
export interface RegisteredUser extends User {

    roles: Role[]

}

export interface GuestUser extends User {
  saveInLocalStorage: boolean
}

export interface ContentProfile extends Authenticatable {
  id: number;
  name: string;
  contentProfileType: ContentProfileType;
  themeDto: Theme;
  guestUser: GuestUser;
}

export interface ContentProfileCreateDto {
  name: string;
  contentProfileType: ContentProfileType;
  guestUser: {
    username: string;
    saveInLocalStorage: boolean;
  };
}


export enum ContentProfileType {
  PERSONAL = "PERSONAL",
  COMPANY = "COMPANY",
  EDUCATIONAL = "EDUCATIONAL",
  GUEST = "GUEST"
}

enum ContentProfileTypeHumanizedNames {
  PERSONAL = "Personal",
  COMPANY = "Company",
  EDUCATIONAL = "Educational",
  GUEST = "Guest"
}

export function contentProfileTypeToHumanizedString(contentProfileType: ContentProfileType): string {
  switch (contentProfileType) {
    case ContentProfileType.PERSONAL:
      return ContentProfileTypeHumanizedNames.PERSONAL;
    case ContentProfileType.COMPANY:
      return ContentProfileTypeHumanizedNames.COMPANY;
    case ContentProfileType.EDUCATIONAL:
      return ContentProfileTypeHumanizedNames.EDUCATIONAL;
    case ContentProfileType.GUEST:
      return ContentProfileTypeHumanizedNames.GUEST;
  }
}
