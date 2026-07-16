import { readFile, writeFile } from "fs/promises";
import { join } from "path";

export type SocialLink = {
  label: string;
  href: string;
  external?: boolean;
  copyValue?: string;
};

export type Project = {
  title: string;
  href: string;
  date: string;
  stack: string[];
  summary: string;
  points: string[];
};

export type BlogEntry = {
  title: string;
  href: string;
  source: string;
  role: string;
  stack: string[];
  summary: string;
  points: string[];
};

export type ExperienceEntry = {
  title: string;
  org: string;
  role: string;
  points: string[];
};

export type SkillGroup = {
  title: string;
  chips: string[];
};

export type PortfolioData = {
  profileLinks: SocialLink[];
  projects: Project[];
  blogs: BlogEntry[];
  experience: ExperienceEntry[];
  skillGroups: SkillGroup[];
  footerLinks: SocialLink[];
  resumeUrl: string;
  githubProfileUrl: string;
  githubUser: string;
  photoUrl?: string;
  sillyStats?: {
    clicks: number;
    travelPx: number;
    scrolls: number;
    keys: number;
  };
};

const dataFilePath = join(process.cwd(), "data.json");

export async function getPortfolioData(): Promise<PortfolioData> {
  try {
    const fileContent = await readFile(dataFilePath, "utf-8");
    return JSON.parse(fileContent) as PortfolioData;
  } catch (error) {
    console.error("Error reading data.json:", error);
    // Return empty fallback if error
    return {
      profileLinks: [],
      projects: [],
      blogs: [],
      experience: [],
      skillGroups: [],
      footerLinks: [],
      resumeUrl: "",
      githubProfileUrl: "",
      githubUser: "",
    };
  }
}

export async function savePortfolioData(data: PortfolioData): Promise<void> {
  await writeFile(dataFilePath, JSON.stringify(data, null, 2), "utf-8");
}
