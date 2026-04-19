export type NavLink = {
  label: string;
  href: string;
};

export type SectionTab = {
  num: string;
  label: string;
  active?: boolean;
};

export type Project = {
  id: string;
  title: string;
  description: string;
  tags: string[];
  url?: string;
  image_url?: string;
  featured: boolean;
  created_at: string;
};

export type ContactMessage = {
  name: string;
  email: string;
  message: string;
};