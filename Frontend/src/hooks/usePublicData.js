import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { publicApi } from '../api/publicApi.js';

export const useServices = () =>
  useQuery({ queryKey: ['public', 'services'], queryFn: publicApi.getServices, staleTime: 60_000 });

export const usePricing = () =>
  useQuery({ queryKey: ['public', 'pricing'], queryFn: publicApi.getPricing, staleTime: 60_000 });

export const useTeam = () =>
  useQuery({ queryKey: ['public', 'team'], queryFn: publicApi.getTeam, staleTime: 60_000 });

export const useTestimonials = () =>
  useQuery({ queryKey: ['public', 'testimonials'], queryFn: publicApi.getTestimonials, staleTime: 60_000 });

export const useFaqs = () =>
  useQuery({ queryKey: ['public', 'faqs'], queryFn: publicApi.getFaqs, staleTime: 60_000 });

export const useProjects = (params) =>
  useQuery({
    queryKey: ['public', 'projects', params],
    queryFn: () => publicApi.getProjects(params),
    staleTime: 60_000,
    placeholderData: keepPreviousData,
  });

export const useProject = (slug) =>
  useQuery({
    queryKey: ['public', 'project', slug],
    queryFn: () => publicApi.getProjectBySlug(slug),
    enabled: Boolean(slug),
  });
