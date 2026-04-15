import { render, screen, fireEvent } from '@testing-library/react';
import { UploadZone } from '../UploadZone';

describe('UploadZone', () => {
  it('renders correctly', () => {
    render(<UploadZone onUploadComplete={() => {}} />);
    expect(screen.getByText('Drop photo/audio or click to upload')).toBeInTheDocument();
  });

  it('handles drag over', () => {
    const { container } = render(<UploadZone onUploadComplete={() => {}} />);
    const dropzone = container.firstChild as HTMLElement;
    
    fireEvent.dragOver(dropzone);
    expect(dropzone.className).toContain('dropzone-active');
    
    fireEvent.dragLeave(dropzone);
    expect(dropzone.className).not.toContain('dropzone-active');
  });
});
