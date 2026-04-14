import { render, screen } from "@testing-library/react";
import { OfflineBadge } from "../OfflineBadge";

describe("OfflineBadge", () => {
  it("renders correctly with OFFLINE MODE text", () => {
    render(<OfflineBadge />);
    expect(screen.getByText("OFFLINE MODE")).toBeInTheDocument();
  });

  it("has the correct styling class", () => {
    const { container } = render(<OfflineBadge />);
    expect(container.firstChild).toHaveClass("badge-online");
  });
});
