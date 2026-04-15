import { render, screen, fireEvent } from "@testing-library/react";
import { SearchBar } from "../SearchBar";

describe("SearchBar", () => {
  it("renders the input and handles typing", () => {
    const handleSearch = jest.fn();
    render(<SearchBar isLoading={false} onSearch={handleSearch} />);

    const input = screen.getByPlaceholderText(/Search protocols/i);
    expect(input).toBeInTheDocument();
    
    // Type into the input
    fireEvent.change(input, { target: { value: "test query" } });
    expect(input).toHaveValue("test query");
  });

  it("calls onSearch when Enter is pressed", () => {
    const handleSearch = jest.fn();
    render(<SearchBar isLoading={false} onSearch={handleSearch} />);

    const input = screen.getByPlaceholderText(/Search protocols/i);
    fireEvent.change(input, { target: { value: "test query" } });
    fireEvent.keyDown(input, { key: "Enter", code: "Enter" });
    
    expect(handleSearch).toHaveBeenCalledWith("test query");
  });

  it("calls onSearch on form submit", () => {
    const handleSearch = jest.fn();
    render(<SearchBar isLoading={false} onSearch={handleSearch} />);

    const input = screen.getByPlaceholderText(/Search protocols/i);
    fireEvent.change(input, { target: { value: "test form" } });
    fireEvent.submit(input.closest("form")!);
    
    expect(handleSearch).toHaveBeenCalledWith("test form");
  });

  it("does not call onSearch if query is empty text", () => {
    const handleSearch = jest.fn();
    render(<SearchBar isLoading={false} onSearch={handleSearch} />);

    const input = screen.getByPlaceholderText(/Search protocols/i);
    fireEvent.change(input, { target: { value: "   " } });
    fireEvent.keyDown(input, { key: "Enter", code: "Enter" });
    
    expect(handleSearch).not.toHaveBeenCalled();
  });

  it("renders loading indicator when isLoading is true", () => {
    const handleSearch = jest.fn();
    const { container } = render(<SearchBar isLoading={true} onSearch={handleSearch} />);
    // Look for the spinner
    const spinner = container.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });
});
