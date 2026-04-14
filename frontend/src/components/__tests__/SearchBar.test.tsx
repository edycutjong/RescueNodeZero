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
    
    // Set value first
    fireEvent.change(input, { target: { value: "test query" } });
    
    // Press enter
    fireEvent.keyDown(input, { key: "Enter", code: "Enter" });
    
    expect(handleSearch).toHaveBeenCalledWith("test query");
    expect(handleSearch).toHaveBeenCalledTimes(1);
  });

  it("calls onSearch on form submit", () => {
    const handleSearch = jest.fn();
    render(<SearchBar isLoading={false} onSearch={handleSearch} />);

    const input = screen.getByPlaceholderText(/Search protocols/i);
    
    // Set value
    fireEvent.change(input, { target: { value: "test form" } });
    
    // Submit form (which wraps the input)
    fireEvent.submit(input.closest("form")!);
    
    expect(handleSearch).toHaveBeenCalledWith("test form");
    expect(handleSearch).toHaveBeenCalledTimes(1);
  });

  it("does not call onSearch if query is empty text", () => {
    const handleSearch = jest.fn();
    render(<SearchBar isLoading={false} onSearch={handleSearch} />);

    const input = screen.getByPlaceholderText(/Search protocols/i);
    
    // Set value to empty
    fireEvent.change(input, { target: { value: "   " } });
    
    // Press enter
    fireEvent.keyDown(input, { key: "Enter", code: "Enter" });
    
    expect(handleSearch).not.toHaveBeenCalled();
  });
});
