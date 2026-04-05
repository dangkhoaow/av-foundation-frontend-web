import { apiClient } from './client';

export interface HomepageConfig {
    id: string;
    showFeaturedArtworks: boolean;
    featuredArtworksTitle: string;
    featuredArtworksTitleEn: string;
    showNews: boolean;
    newsTitle: string;
    newsTitleEn: string;
    newsCount: number;
    showNewCreation: boolean;
    newCreationTitle: string;
    newCreationTitleEn: string;
    newCreationCollectionId: string | null;
}

export interface HomepageConfigResponse {
    success: boolean;
    message: string;
    data: HomepageConfig;
}

export const homepageConfigAPI = {
    get: async (): Promise<HomepageConfig | null> => {
        try {
            const response = await apiClient.get<HomepageConfigResponse>(
                '/api/public/homepage-config',
                undefined,
                { maxAttempts: 1, timeoutMs: 20_000 }
            );
            return response.data;
        } catch (error) {
            console.error('Failed to fetch homepage config:', error);
            return null;
        }
    },
};
