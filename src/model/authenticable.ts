import {Theme} from "./theme/theme";
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


enum ContentProfileType {
  PERSONAL,
  COMPANY,
  EDUCATIONAL,
  GUEST
}
