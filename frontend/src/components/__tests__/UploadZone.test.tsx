import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { UploadZone } from '../UploadZone';

// Mock fetch
global.fetch = jest.fn();

describe('UploadZone', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    (global.fetch as jest.Mock).mockClear();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders correctly', () => {
    render(<UploadZone onUploadComplete={() => {}} />);
    expect(screen.getByText('Drop photo/audio or click to upload')).toBeInTheDocument();
  });

  it('handles drag over and leave', () => {
    const { container } = render(<UploadZone onUploadComplete={() => {}} />);
    const dropzone = container.firstChild as HTMLElement;
    
    fireEvent.dragOver(dropzone);
    expect(dropzone.className).toContain('dropzone-active');
    
    fireEvent.dragLeave(dropzone);
    expect(dropzone.className).not.toContain('dropzone-active');
  });

  it('clicks the file input when the dropzone is clicked', () => {
    const { container } = render(<UploadZone onUploadComplete={() => {}} />);
    const dropzone = container.firstChild as HTMLElement;
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    const clickSpy = jest.spyOn(input, 'click');
    
    fireEvent.click(dropzone);
    expect(clickSpy).toHaveBeenCalled();
  });

  it('handles file drop', async () => {
    const mockOnUploadComplete = jest.fn();
    const { container } = render(<UploadZone onUploadComplete={mockOnUploadComplete} />);
    const dropzone = container.firstChild as HTMLElement;
    
    (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: true });

    const file = new File([''], 'audio.mp3', { type: 'audio/mp3' });
    
    await act(async () => {
      fireEvent.drop(dropzone, {
        dataTransfer: {
          files: [file],
        },
      });
    });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
      expect(mockOnUploadComplete).toHaveBeenCalled();
    });

    // Fast-forward timeout
    act(() => {
      jest.advanceTimersByTime(3000);
    });
  });

  it('ignores empty drop', async () => {
    const { container } = render(<UploadZone onUploadComplete={() => {}} />);
    const dropzone = container.firstChild as HTMLElement;
    
    await act(async () => {
      fireEvent.drop(dropzone, {
        dataTransfer: {
          files: [],
        },
      });
    });

    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('handles file input change with image/photo', async () => {
    const mockOnUploadComplete = jest.fn();
    const { container } = render(<UploadZone onUploadComplete={mockOnUploadComplete} />);
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error')); // Trigger catch branch

    const file = new File([''], 'photo.png', { type: 'image/png' });
    
    await act(async () => {
      fireEvent.change(input, {
        target: {
          files: [file],
        },
      });
    });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
      expect(mockOnUploadComplete).toHaveBeenCalled();
    });
    
    expect(screen.getByText('✓ photo.png processed (demo mode)')).toBeInTheDocument();
  });

  it('handles generic file types safely (no match)', async () => {
    const { container } = render(<UploadZone onUploadComplete={() => {}} />);
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    
    const file = new File([''], 'unknown.txt', { type: 'text/plain' });
    
    await act(async () => {
      fireEvent.change(input, {
        target: {
          files: [file],
        },
      });
    });

    // Should complete processing but do nothing to fetch
    expect(global.fetch).not.toHaveBeenCalled();
  });
});
