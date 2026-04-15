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

  it('handles toggling a zone', () => {
    const mockOnFilterChange = jest.fn();
    render(<FilterChips filters={{ zone: 'Sector_1' }} onFilterChange={mockOnFilterChange} />);
    
    // Toggle off existing zone
    fireEvent.click(screen.getByText('Sector 1'));
    expect(mockOnFilterChange).toHaveBeenCalledWith({ zone: undefined });
    
    // Toggle new zone
    fireEvent.click(screen.getByText('Sector 2'));
    expect(mockOnFilterChange).toHaveBeenCalledWith(expect.objectContaining({ zone: 'Sector_2' }));
  });

  it('handles toggling a priority', () => {
    const mockOnFilterChange = jest.fn();
    render(<FilterChips filters={{ priority_level: 'IMMEDIATE' }} onFilterChange={mockOnFilterChange} />);
    
    // Toggle off existing priority
    fireEvent.click(screen.getAllByText('IMMEDIATE')[0]);
    expect(mockOnFilterChange).toHaveBeenCalledWith({ priority_level: undefined });
    
    // Toggle new priority
    fireEvent.click(screen.getByText('MINOR'));
    expect(mockOnFilterChange).toHaveBeenCalledWith(expect.objectContaining({ priority_level: 'MINOR' }));
  });

  it('handles toggling data types', () => {
    const mockOnFilterChange = jest.fn();
    render(<FilterChips filters={{ data_type: ['TEXT'] }} onFilterChange={mockOnFilterChange} />);
    
    // Toggle off existing type
    fireEvent.click(screen.getByText('📄 Text'));
    expect(mockOnFilterChange).toHaveBeenCalledWith({ data_type: undefined });
    
    // Toggle new type
    fireEvent.click(screen.getByText('📷 Photo'));
    expect(mockOnFilterChange).toHaveBeenCalledWith(expect.objectContaining({ data_type: ['TEXT', 'PHOTO'] }));
  });

  it('handles toggling inventory check', () => {
    const mockOnFilterChange = jest.fn();
    render(<FilterChips filters={{ inventory_check: false }} onFilterChange={mockOnFilterChange} />);
    
    fireEvent.click(screen.getByText('✓ Inventory Available'));
    expect(mockOnFilterChange).toHaveBeenCalledWith(expect.objectContaining({ inventory_check: true }));
  });

  it('handles toggling an allergy', () => {
    const mockOnFilterChange = jest.fn();
    render(<FilterChips filters={{ exclude_allergies: ['penicillin'] }} onFilterChange={mockOnFilterChange} />);
    
    // Toggle off existing allergy
    fireEvent.click(screen.getByText('⚠ penicillin'));
    expect(mockOnFilterChange).toHaveBeenCalledWith({ exclude_allergies: undefined });
    
    // Toggle new allergy
    fireEvent.click(screen.getByText('⚠ aspirin'));
    expect(mockOnFilterChange).toHaveBeenCalledWith(expect.objectContaining({ exclude_allergies: ['penicillin', 'aspirin'] }));
  });

  it('renders active states correctly', () => {
    const mockOnFilterChange = jest.fn();
    const { container } = render(
      <FilterChips 
        filters={{ 
          zone: 'Sector_1', 
          priority_level: 'IMMEDIATE', 
          data_type: ['PHOTO'], 
          inventory_check: true,
          exclude_allergies: ['penicillin']
        }} 
        onFilterChange={mockOnFilterChange} 
      />
    );
    
    const activeChips = container.querySelectorAll('.chip-active');
    expect(activeChips.length).toBeGreaterThan(0);
  });
});
