import {Theme} from "../theme/theme";

interface Authenticatable {

}


interface User extends Authenticatable {
  id: number
  username: string
}
export interface RegisteredUser extends User {

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
