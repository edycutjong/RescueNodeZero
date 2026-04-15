import { render, screen, fireEvent } from '@testing-library/react';
import { FilterChips } from '../FilterChips';

describe('FilterChips', () => {
  it('renders standard filter categories', () => {
    const mockOnFilterChange = jest.fn();
    render(<FilterChips filters={{}} onFilterChange={mockOnFilterChange} />);
    
    expect(screen.getByText('Zone')).toBeInTheDocument();
    expect(screen.getByText('Priority')).toBeInTheDocument();
    expect(screen.getByText('Type')).toBeInTheDocument();
  });

  it('handles clicking a filter chip', () => {
    const mockOnFilterChange = jest.fn();
    render(<FilterChips filters={{}} onFilterChange={mockOnFilterChange} />);
    
    fireEvent.click(screen.getByText('Sector 1'));
    
    expect(mockOnFilterChange).toHaveBeenCalledWith({ zone: 'Sector_1' });
  });

  it('renders active states correctly', () => {
    const mockOnFilterChange = jest.fn();
    const { container } = render(
      <FilterChips 
        filters={{ zone: 'Sector_1', priority_level: 'IMMEDIATE', data_type: ['PHOTO'] }} 
        onFilterChange={mockOnFilterChange} 
      />
    );
    
    const activeChips = container.querySelectorAll('.chip-active');
    expect(activeChips.length).toBeGreaterThan(0);
  });
});
