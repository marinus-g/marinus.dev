interface ContentId {
  id: number;
}
export interface Content {
  name: string;
  content_type: string;
}

export interface WelcomeScreenContent extends Content, ContentId {
  welcomeMessage: string[];
}

export interface WelcomeScreenContentCreate extends Content {
  welcomeMessage: string[];
}
