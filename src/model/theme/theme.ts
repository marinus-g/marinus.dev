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
    outlineColor: string
    outerColor: string;
    backgroundColor: string;
    primaryColor: string;
    secondaryColor: string;
    informationColor: string;
    warningColor: string;
    highlightColor: string;
    clickableColor: string;
  };
}
