import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PublicAssetsComponent } from '../PublicAssetsComponent';

// Create test query client
const createTestQueryClient = () => new QueryClient({
    defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
    },
});

const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const queryClient = createTestQueryClient();
    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
};

describe('PublicAssetsComponent Integration Tests', () => {
    test('validates asset rendering across multiple collections', async () => {
        render(
            <TestWrapper>
                <PublicAssetsComponent network="sepolia" />
            </TestWrapper>
        );

        await waitFor(() => {
            expect(screen.getByText('Public IP Assets')).toBeInTheDocument();
        });

        // Should render assets from different collections
        await waitFor(() => {
            const collectionElements = screen.getAllByText(/Collection:/);
            expect(collectionElements.length).toBeGreaterThan(0);
        });
    });

    test('tests search and filter accuracy', async () => {
        const user = userEvent.setup();

        render(
            <TestWrapper>
                <PublicAssetsComponent network="sepolia" />
            </TestWrapper>
        );

        // Test search accuracy
        const searchInput = screen.getByPlaceholderText(/search assets/i);
        await user.type(searchInput, 'specific asset name');

        await waitFor(() => {
            // Should filter results based on search
            expect(screen.queryByText(/showing \d+ of/)).toBeInTheDocument();
        });

        // Test filter accuracy
        const filtersButton = screen.getByText('Filters');
        await user.click(filtersButton);

        // Test sort filter
        const sortSelect = screen.getByRole('combobox', { name: /sort by/i });
        await user.selectOptions(sortSelect, 'name');

        await waitFor(() => {
            // Should re-sort results
            expect(screen.getByDisplayValue('name')).toBeInTheDocument();
        });
    });

    test('benchmarks performance with large asset sets', async () => {
        const startTime = performance.now();

        render(
            <TestWrapper>
                <PublicAssetsComponent pageSize={100} network="sepolia" />
            </TestWrapper>
        );

        await waitFor(() => {
            expect(screen.getByText('Public IP Assets')).toBeInTheDocument();
        }, { timeout: 5000 });

        const endTime = performance.now();
        const loadTime = endTime - startTime;

        // Should load within reasonable time (< 3 seconds)
        expect(loadTime).toBeLessThan(3000);
    });

    test('ensures compatibility with both networks', async () => {
        // Test Sepolia
        const { rerender } = render(
            <TestWrapper>
                <PublicAssetsComponent network="sepolia" />
            </TestWrapper>
        );

        await waitFor(() => {
            expect(screen.getByText(/sepolia/i)).toBeInTheDocument();
        });

        // Test Mainnet
        rerender(
            <TestWrapper>
                <PublicAssetsComponent network="mainnet" />
            </TestWrapper>
        );

        await waitFor(() => {
            expect(screen.getByText(/mainnet/i)).toBeInTheDocument();
        });
    });
});