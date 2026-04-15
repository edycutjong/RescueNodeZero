import { render, screen } from '@testing-library/react';
import { ResultCard } from '../ResultCard';

describe('ResultCard', () => {
  it('renders MEDICAL result data correctly and IMMEDIATE priority', () => {
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
    // MEDICAL -> text label
    expect(screen.getByText('MEDICAL PROTOCOL')).toBeInTheDocument();
    
    expect(screen.getByText('IMMEDIATE')).toBeInTheDocument();
    expect(screen.getByText('88.0%')).toBeInTheDocument();
    expect(screen.getByText('PPE: Gloves, Gauze')).toBeInTheDocument();
    expect(screen.getByText('semantic')).toBeInTheDocument();
  });

  it('renders HAZMAT result data, DELAYED priority and un_code/zone', () => {
    const mockResult = {
      id: '2',
      title: 'Chemical Spill',
      content_preview: 'Clear the area.',
      score: 0.95,
      data_type: 'TEXT' as const,
      match_type: 'exact' as const,
      source: 'mock',
      metadata: {
        category: 'HAZMAT',
        priority_level: 'DELAYED',
        un_code: 'UN1017',
        zone: 'Sector_3',
        reporter: 'Drone-1'
      }
    };
    
    render(<ResultCard result={mockResult} />);
    expect(screen.getByText('HAZMAT PROTOCOL')).toBeInTheDocument();
    expect(screen.getByText('DELAYED')).toBeInTheDocument();
    expect(screen.getByText('UN1017')).toBeInTheDocument();
    expect(screen.getByText('Sector 3')).toBeInTheDocument();
    expect(screen.getByText('Drone-1')).toBeInTheDocument();
  });

  it('renders AUDIO result data, MINOR priority', () => {
    const mockResult = {
      id: '3',
      title: 'Audio Report',
      content_preview: 'Patient is stable.',
      score: 0.75,
      data_type: 'AUDIO' as const,
      match_type: 'hybrid' as const,
      source: 'mock',
      metadata: {
        priority_level: 'MINOR',
      }
    };
    
    render(<ResultCard result={mockResult} />);
    expect(screen.getByText('AUDIO CARD')).toBeInTheDocument();
    expect(screen.getByText('WHISPER TRANSCRIPT')).toBeInTheDocument();
    expect(screen.getByText('MINOR')).toBeInTheDocument();
  });

  it('renders PHOTO result data, EXPECTANT priority', () => {
    const mockResult = {
      id: '4',
      title: 'Field Photo',
      content_preview: 'Collapsed building structure.',
      score: 0.60,
      data_type: 'PHOTO' as const,
      match_type: 'hybrid' as const,
      source: 'mock',
      metadata: {
        priority_level: 'EXPECTANT',
      }
    };
    
    render(<ResultCard result={mockResult} />);
    expect(screen.getByText('PHOTO CARD')).toBeInTheDocument();
    expect(screen.getByText('AI CAPTION')).toBeInTheDocument();
    expect(screen.getByText('EXPECTANT')).toBeInTheDocument();
  });

  it('renders with no priority/default priority', () => {
    const mockResult = {
      id: '5',
      title: 'Unknown',
      content_preview: 'Unknown data.',
      score: 0.50,
      data_type: 'TEXT' as const,
      match_type: 'hybrid' as const,
      source: 'mock',
      metadata: {
        priority_level: 'UNKNOWN', // hits the default branch in getPriorityColor
      }
    };
    
    // We just render to hit the default branch
    render(<ResultCard result={mockResult} />);
    expect(screen.getByText('UNKNOWN')).toBeInTheDocument();
  });
  
  it('renders with empty equipment array', () => {
    const mockResult = {
      id: '6',
      title: 'Testing Empty Arrays',
      content_preview: 'Data.',
      score: 0.50,
      data_type: 'TEXT' as const,
      match_type: 'hybrid' as const,
      source: 'mock',
      metadata: {
        equipment_required: []
      }
    };
    
    render(<ResultCard result={mockResult} />);
    expect(screen.queryByText(/PPE:/)).not.toBeInTheDocument();
  });
});
