import { render, screen } from '@testing-library/react';
import { InventoryPanel } from '../InventoryPanel';

describe('InventoryPanel', () => {
  it('renders items and categorizes them properly', () => {
    const items = [
      { id: '1', name: 'Bandages', quantity: 10, category: 'Medical', zone: 'Sector_1' },
      { id: '2', name: 'Morphine', quantity: 2, category: 'Medical', zone: 'Sector_1' },
      { id: '3', name: 'Water', quantity: 4, category: 'Supplies', zone: 'Sector_2' },
    ];
    render(<InventoryPanel items={items} />);
    
    expect(screen.getByText('Inventory')).toBeInTheDocument();
    
    expect(screen.getByText('Bandages')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
    
    expect(screen.getByText('Morphine')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('CRITICAL')).toBeInTheDocument();

    expect(screen.getByText('Water')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('Low stock')).toBeInTheDocument();
  });
});
