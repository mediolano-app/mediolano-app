import { useEffect, useRef } from 'react';

interface PerformanceMetrics {
    loadTime: number;
    renderTime: number;
    searchTime?: number;
}

export const usePerformanceMonitor = (componentName: string) => {
    const startTime = useRef<number>(performance.now());
    const metricsRef = useRef<PerformanceMetrics>({ loadTime: 0, renderTime: 0 });

    useEffect(() => {
        const endTime = performance.now();
        metricsRef.current.loadTime = endTime - startTime.current;

        console.log(`${componentName} Performance:`, {
            loadTime: `${metricsRef.current.loadTime.toFixed(2)}ms`,
            timestamp: new Date().toISOString(),
        });
    }, [componentName]);

    const measureSearch = (searchFn: () => Promise<any>) => {
        return async (...args: any[]) => {
            const searchStart = performance.now();
            const result = await searchFn(...args);
            const searchEnd = performance.now();

            metricsRef.current.searchTime = searchEnd - searchStart;
            console.log(`${componentName} Search Performance:`, {
                searchTime: `${metricsRef.current.searchTime.toFixed(2)}ms`,
            });

            return result;
        };
    };

    return { measureSearch, metrics: metricsRef.current };
};