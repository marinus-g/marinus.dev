export interface Project {
  id: number;
  thumbnail: PictureBlock;
  name: string;
  projectDescription: ProjectDescription;
  link: string;
}

interface ProjectDescription {
  id: number;
  title: string;
  description: string;
}

interface ProjectDescription {
  contentBlocks: ContentBlock[];
}

interface ContentBlock {
  id: number;
}

interface TextBlock extends ContentBlock {
  text: string;
  isHtml: boolean;
}

interface PictureBlock extends ContentBlock {
  picture: string;
  isUrl: boolean;
  imageType: string;
}
