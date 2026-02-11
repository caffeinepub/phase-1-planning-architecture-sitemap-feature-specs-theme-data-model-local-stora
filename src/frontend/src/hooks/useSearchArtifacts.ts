import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';

export interface ArtifactSearchResult {
  artifact: {
    id: bigint;
    title: string;
    description: string;
    searchableText: string;
    category: string;
    isVisible: boolean;
    createdBy: string;
    media?: any;
    externalLink?: string;
    publicationDate: bigint;
    createdAt: bigint;
    lastUpdated: bigint;
    location?: string;
    platform?: string;
    tags: string[];
    rating?: number;
  };
  matchCount: bigint;
  relevanceScore: number;
  userPreferenceScore?: number;
  overallScore?: number;
  searchScore: number;
  highlightedTitle: string;
  highlightedDescription: string;
  source: string;
  visibility: bigint;
  timestamp: bigint;
  assetStatus: string;
}

export function useSearchArtifacts(query: string, category: string = 'all') {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<ArtifactSearchResult[]>({
    queryKey: ['searchArtifacts', query, category],
    queryFn: async () => {
      if (!actor) return [];
      
      // Backend search not yet implemented, return empty array
      // When backend is ready, call: actor.searchArtifacts(query, category)
      return [];
    },
    enabled: !!actor && !actorFetching && query.length > 0,
    retry: false,
  });
}
