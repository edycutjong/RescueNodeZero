import { render, screen } from '@testing-library/react';
import { ResultsGrid } from '../ResultsGrid';

describe('ResultsGrid', () => {
  it('renders loading state', () => {
    const { container } = render(<ResultsGrid results={[]} totalResults={0} isLoading={true} />);
    const shimmerElements = container.querySelectorAll('.shimmer');
    expect(shimmerElements.length).toBe(6);
  });

  it('renders empty state', () => {
    render(<ResultsGrid results={[]} totalResults={0} isLoading={false} />);
    expect(screen.getByText('AWAITING QUERY INPUT')).toBeInTheDocument();
  });

  it('renders results', () => {
    const mockResults = [
      {
        id: '1',
        title: 'Hazmat Incident',
        content_preview: 'Protocol for hazmat',
        score: 0.95,
        data_type: 'TEXT' as const,
        match_type: 'semantic' as const,
        source: 'mock',
        metadata: {}
      }
    ];
    render(<ResultsGrid results={mockResults} totalResults={1} isLoading={false} />);
    expect(screen.getByText('1 matches')).toBeInTheDocument();
    expect(screen.getByText('Hazmat Incident')).toBeInTheDocument();
  });
});
