export interface Theme {

  name: string;
  terminal: {
    ps1: {
      nameColor: string;
      atColor: string;
      hostnameColor: string;
    };
    font: {
      family: string;
      size: string;
    }
    backgroundColor: string;
    primaryColor: string;
    secondaryColor: string;
  };

}
