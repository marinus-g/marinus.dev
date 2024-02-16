interface ContentId {
  id: number;
}

export interface Content {
  name: string;
  content_type: string;
}

export interface ContentCreateDto extends Content {
}

export interface ContentModel extends Content, ContentId {
}

export interface WelcomeScreenContent extends ContentModel {
  welcomeMessage: string[];
}

export interface WelcomeScreenContentCreate extends ContentCreateDto {
  welcomeMessage: string[];
}
