export interface Content {
  id: number;
  name: string;
  content_type: string;
}

export interface WelcomeScreenContent extends Content {
  welcomeMessage: string[];
}

