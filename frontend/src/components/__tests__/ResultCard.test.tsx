import { render, screen } from '@testing-library/react';
import { ResultCard } from '../ResultCard';

describe('ResultCard', () => {
  it('renders result data correctly', () => {
    const mockResult = {
      id: '1',
      title: 'Medical Emergency',
      content_preview: 'Apply pressure to wound.',
      score: 0.88,
      data_type: 'TEXT' as const,
      match_type: 'semantic' as const,
      source: 'mock',
      metadata: {
        category: 'MEDICAL',
        priority_level: 'IMMEDIATE',
        equipment_required: ['Gloves', 'Gauze']
      }
    };
    
    render(<ResultCard result={mockResult} />);
    expect(screen.getByText('Medical Emergency')).toBeInTheDocument();
    expect(screen.getByText('Apply pressure to wound.')).toBeInTheDocument();
    expect(screen.getByText('IMMEDIATE')).toBeInTheDocument();
    expect(screen.getByText('88.0%')).toBeInTheDocument();
    expect(screen.getByText('PPE: Gloves, Gauze')).toBeInTheDocument();
  });
});
