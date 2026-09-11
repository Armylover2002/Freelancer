import {
  Globe, ShoppingCart, LayoutDashboard, Smartphone, Rocket, Wrench, Search,
  ShieldCheck, Palette, Code2, Database, Cloud, Layers, Sparkles,
} from 'lucide-react';

const ICONS = {
  globe: Globe,
  ecommerce: ShoppingCart,
  cart: ShoppingCart,
  dashboard: LayoutDashboard,
  mobile: Smartphone,
  rocket: Rocket,
  maintenance: Wrench,
  seo: Search,
  security: ShieldCheck,
  design: Palette,
  code: Code2,
  database: Database,
  cloud: Cloud,
  layers: Layers,
};

export function getIcon(name) {
  return ICONS[String(name || '').toLowerCase()] || Sparkles;
}
