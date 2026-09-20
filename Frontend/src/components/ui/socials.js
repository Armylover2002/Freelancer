import { Globe } from 'lucide-react';
import { GithubIcon, LinkedinIcon, TwitterIcon } from './SocialIcons.jsx';

// Brand colours so each network is recognisable at a glance.
export const SOCIALS = {
  linkedin: { label: 'LinkedIn', Icon: LinkedinIcon, color: '#0A66C2' },
  github: { label: 'GitHub', Icon: GithubIcon, color: '#181717' },
  twitter: { label: 'X (Twitter)', Icon: TwitterIcon, color: '#000000' },
  website: { label: 'Website', Icon: Globe, color: '#6366F1' },
};

export const normalizeUrl = (url) => (/^https?:\/\//i.test(url) ? url : `https://${url}`);

