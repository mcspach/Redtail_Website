export type Offering = {
  title: string;
  description: string;
  bullets?: string[];
  layout?: string;
};

export const offerings: Offering[] = [
  {
    title: 'Custom Website Package',
    description:
      'Unleash new opportunities with a fresh website and online strategy.',
    bullets: [
      'Research and Competitive Analysis',
      'Responsive Design from Scratch',
      'Expert-Crafted Web Experiences in Webflow',
      'SEO ( Reviews + Data + Content Creation )',
    ],
  },
  {
    title: 'Brand + Website Package',
    description:
      'We build a unique identity for your brand, then apply the visual style to a full website and strategy.',
    bullets: [
      'Enhanced Research and Discovery',
      'Complete Brand Design Package',
      'Complete Custom Website Package',
      'Online Store Options',
    ],
  },
  {
    title: 'Hourly Design',
    description:
      'Available for web and graphic design. Full-service video production.',
  },
  {
    title: 'Hourly Web Development',
    description:
      'Available for website maintenance, optimization, and custom development.',
  },
  {
    title: 'AI-Assisted Software Design',
    description:
      'Production-ready applications for modernizing your business practices and streamlining daily operations.',
    bullets: [
      'Custom Automations and Workflow Design',
      'Dashboards, Reporting, and Internal Tools',
      'Clean Interfaces and Thoughtful User Flows',
      'Ongoing Support, Iteration, and Optimization',
    ],
  },
  {
    title: 'Audits',
    description:
      'Take a close look at your current online presence and explore improvement opportunities.',
    bullets: [
      'Brand Design Analysis',
      'User Flow Breakdown',
      'Maximize for Speed + Performance',
      'Extensive SEO Report',
    ],
  },
];
