import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PublicAssetsComponent } from '../PublicAssetsComponent';
import { mipAssetsService } from '../../../services/mipAssetsService';

// Mock the service
jest.mock('../../../services/mipAssetsService');
const mockMipAssetsService = mipAssetsService as jest.Mocked<typeof mipAssetsService>;

const mockAssets = [
    {
        id: '1',
        name: 'Test Asset 1',
        creator: '0x1234567890abcdef1234567890abcdef12345678',
        collection: 'Test Collection',
        timestamp: 1640995200,
        tags: ['art', 'digital'],
        metadata: {
            description: 'Test description',
            image: '/test-image.jpg'
        },
        contractAddress: '0xtest',
        tokenId: '1'
    },
    {
        id: '2',
        name: 'Test Asset 2',
        creator: '0xabcdef1234567890abcdef1234567890abcdef12',
        collection: 'Another Collection',
        timestamp: 1640995300,
        tags: ['music', 'nft'],
        metadata: {
            description: 'Another test description'
        },
        contractAddress: '0xtest',
        tokenId: '2'
    }
];

describe('PublicAssetsComponent', () => {
    beforeEach(() => {
        mockMipAssetsService.fetchAllAssets.mockResolvedValue({
            assets: mockAssets,
            totalCount: 2,
            hasMore: false
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('renders component with assets', async () => {
        render(<PublicAssetsComponent />);

        expect(screen.getByText('Public IP Assets')).toBeInTheDocument();

        await waitFor(() => {
            expect(screen.getByText('Test Asset 1')).toBeInTheDocument();
            expect(screen.getByText('Test Asset 2')).toBeInTheDocument();
        });
    });

    test('handles search functionality', async () => {
        const user = userEvent.setup();
        render(<PublicAssetsComponent />);

        await waitFor(() => {
            expect(screen.getByText('Test Asset 1')).toBeInTheDocument();
        });

        const searchInput = screen.getByPlaceholderText(/search assets/i);
        await user.type(searchInput, 'Test Asset 1');

        await waitFor(() => {
            expect(mockMipAssetsService.fetchAllAssets).toHaveBeenCalledWith(
                0,
                20,
                expect.objectContaining({ search: 'Test Asset 1' })
            );
        });
    });

    test('handles filter changes', async () => {
        const user = userEvent.setup();
        render(<PublicAssetsComponent />);

        await waitFor(() => {
            expect(screen.getByText('Filters')).toBeInTheDocument();
        });

        // Expand filters
        await user.click(screen.getByText('Filters'));

        // Change sort filter
        const sortSelect = screen.getByRole('combobox', { name: /sort by/i });
        await user.selectOptions(sortSelect, 'name');

        await waitFor(() => {
            expect(mockMipAssetsService.fetchAllAssets).toHaveBeenCalledWith(
                0,
                20,
                expect.objectContaining({ sortBy: 'name' })
            );
        });
    });

    test('displays error state', async () => {
        mockMipAssetsService.fetchAllAssets.mockRejectedValue(new Error('Test error'));

        render(<PublicAssetsComponent />);

        await waitFor(() => {
            expect(screen.getByText(/test error/i)).toBeInTheDocument();
        });
    });

    test('displays loading state', () => {
        mockMipAssetsService.fetchAllAssets.mockImplementation(() =>
            new Promise(() => { }) // Never resolves
        );

        render(<PublicAssetsComponent />);
        expect(screen.getByText('Loading assets...')).toBeInTheDocument();
    });
});