export interface Project {
  id: number | undefined;
  thumbnailReference: string;
  name: string;
  difficulty: number;
  projectDescription: ProjectDescription;
  link: string;
}


interface ProjectDescription {
  markdown: string;
}
