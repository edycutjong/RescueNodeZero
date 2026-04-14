import { render, screen } from "@testing-library/react";
import { LatencyBadge } from "../LatencyBadge";

describe("LatencyBadge", () => {
  it("renders latency when provided", () => {
    render(<LatencyBadge latencyMs={12.5} />);
    expect(screen.getByText("12.5ms")).toBeInTheDocument();
  });

  it("renders a dash when latency is null", () => {
    render(<LatencyBadge latencyMs={null} />);
    expect(screen.getByText("—")).toBeInTheDocument();
  });

  it("has the correct styling class", () => {
    const { container } = render(<LatencyBadge latencyMs={10} />);
    expect(container.firstChild).toHaveClass("badge-latency");
  });
});
