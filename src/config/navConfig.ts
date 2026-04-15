/**
 * Central Navigation Configuration
 * ─────────────────────────────────
 * Add, remove, or reorder menu items here.
 * No component changes required.
 */

export interface NavChild {
  label: string;
  href: string;
  description?: string;
}

export interface NavItemConfig {
  label: string;
  href: string;
  children?: NavChild[];
}

export const navConfig: NavItemConfig[] = [
  { label: "Home", href: "/" },
  {
    label: "About",
    href: "/about",
    children: [
      { label: "Overview", href: "/about/overview", description: "Who we are and what drives us" },
      { label: "Our History", href: "/about/history", description: "Our journey through the years" },
      { label: "What We Do", href: "/about/what-we-do", description: "Our operations and expertise" },
      { label: "Our Leadership", href: "/about/leadership", description: "Meet the team behind our success" },
    ],
  },
  {
    label: "Our Products",
    href: "/products",
    children: [
      { label: "Sugar", href: "/products/sugar", description: "Premium refined sugar products" },
      { label: "Flour", href: "/products/flour", description: "High-quality flour for every need" },
      { label: "Poultry & Agro-Allied", href: "/products/poultry", description: "Poultry feeds and agro products" },
      { label: "Rice", href: "/products/rice", description: "Locally sourced premium rice" },
      { label: "Edible Oil", href: "/products/oil", description: "Pure and refined cooking oils" },
      { label: "Tomato Paste", href: "/products/tomato-paste", description: "Rich, flavourful tomato paste" },
    ],
  },
  {
    label: "Our Impact",
    href: "/impact",
    children: [
      { label: "Environment Impact", href: "/impact/environment", description: "Sustainability and green initiatives" },
      { label: "Social Impact", href: "/impact/social", description: "Community development programmes" },
      { label: "Governance", href: "/impact/governance", description: "Ethical standards and compliance" },
    ],
  },
  {
    label: "Media & Updates",
    href: "/media",
    children: [
      { label: "Press Releases", href: "/media/press", description: "Official company announcements" },
      { label: "Blogs & Articles", href: "/media/blogs", description: "Insights, stories, and thought pieces" },
      { label: "Photo Gallery", href: "/media/gallery", description: "Visual highlights and events" },
    ],
  },
  {
    label: "Careers",
    href: "/careers",
    children: [
      { label: "Vacancies & Job Opportunities", href: "/careers/jobs", description: "Explore open positions" },
      { label: "Distributor Partnerships", href: "/careers/partners", description: "Become a distribution partner" },
    ],
  },
  { label: "Contact", href: "/contact" },
];
