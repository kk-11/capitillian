import React, { Profiler } from "react";
import { render, fireEvent } from "@testing-library/react-native";
import SpotlightOnboarding, { type SpotlightStep } from "../SpotlightOnboarding";

const rect = { x: 0, y: 0, width: 100, height: 40 };

const steps: SpotlightStep[] = [
  { key: "a", title: "Step A", body: "First step", rect },
  { key: "b", title: "Step B", body: "Second step", rect },
  { key: "c", title: "Step C", body: "Third step", rect },
];

describe("SpotlightOnboarding", () => {
  it("renders nothing when not visible", () => {
    const { queryByText } = render(
      <SpotlightOnboarding visible={false} steps={steps} onDone={jest.fn()} />
    );
    expect(queryByText("Step A")).toBeNull();
  });

  it("renders nothing when there are no steps", () => {
    const { queryByText } = render(
      <SpotlightOnboarding visible={true} steps={[]} onDone={jest.fn()} />
    );
    expect(queryByText("Step A")).toBeNull();
  });

  it("starts on the first step when opened", () => {
    const { getByText } = render(
      <SpotlightOnboarding visible={true} steps={steps} onDone={jest.fn()} />
    );
    expect(getByText("Step A")).toBeTruthy();
    expect(getByText("1/3")).toBeTruthy();
  });

  it("advances to the next step on 'Next'", () => {
    const { getByText, queryByText } = render(
      <SpotlightOnboarding visible={true} steps={steps} onDone={jest.fn()} />
    );
    fireEvent.press(getByText("Next"));
    expect(getByText("Step B")).toBeTruthy();
    expect(queryByText("Step A")).toBeNull();
  });

  it("shows 'Got it' and calls onDone on the last step", () => {
    const onDone = jest.fn();
    const { getByText } = render(
      <SpotlightOnboarding visible={true} steps={steps} onDone={onDone} />
    );
    fireEvent.press(getByText("Next")); // -> step B
    fireEvent.press(getByText("Next")); // -> step C
    expect(getByText("Got it")).toBeTruthy();
    fireEvent.press(getByText("Got it"));
    expect(onDone).toHaveBeenCalledTimes(1);
  });

  it("calls onDone when 'Skip' is pressed", () => {
    const onDone = jest.fn();
    const { getByText } = render(
      <SpotlightOnboarding visible={true} steps={steps} onDone={onDone} />
    );
    fireEvent.press(getByText("Skip"));
    expect(onDone).toHaveBeenCalledTimes(1);
  });

  it("resets to the first step as soon as it closes, not only on reopen", () => {
    const { getByText, queryByText, rerender } = render(
      <SpotlightOnboarding visible={true} steps={steps} onDone={jest.fn()} />
    );
    fireEvent.press(getByText("Next")); // -> step B

    rerender(<SpotlightOnboarding visible={false} steps={steps} onDone={jest.fn()} />);
    rerender(<SpotlightOnboarding visible={true} steps={steps} onDone={jest.fn()} />);
    expect(getByText("Step A")).toBeTruthy();
    expect(queryByText("Step B")).toBeNull();
  });

  it("reopens without a corrective re-render (no flash of the previous step)", () => {
    // Testing Library's rerender() wraps every update in act(), which
    // flushes the reset effect (and any re-render it triggers) before
    // returning — so asserting on the final DOM alone can't tell "reset on
    // open" apart from "reset on close": both settle on step A. What
    // differs is *how many commits* it took to get there: reset-on-open
    // (the bug) renders the stale step first and then corrects itself in a
    // second commit — the extra commit is the one-frame flash on a real
    // device. Reset-on-close (the fix) is already correct on the first
    // commit, so reopening only ever commits once. Profiler's onRender
    // fires once per commit, so counting its calls distinguishes the two.
    const onRender = jest.fn();
    const Wrapped = ({ visible }: { visible: boolean }) => (
      <Profiler id="spotlight" onRender={onRender}>
        <SpotlightOnboarding visible={visible} steps={steps} onDone={jest.fn()} />
      </Profiler>
    );

    const { getByText, rerender } = render(<Wrapped visible={true} />);
    fireEvent.press(getByText("Next")); // -> step B
    rerender(<Wrapped visible={false} />); // close: reset-on-close effect fires here
    onRender.mockClear();

    rerender(<Wrapped visible={true} />); // reopen
    expect(onRender).toHaveBeenCalledTimes(1);
  });

  it("does not reset mid-walkthrough while still visible", () => {
    const { getByText, queryByText, rerender } = render(
      <SpotlightOnboarding visible={true} steps={steps} onDone={jest.fn()} />
    );
    fireEvent.press(getByText("Next")); // -> step B
    rerender(<SpotlightOnboarding visible={true} steps={steps} onDone={jest.fn()} />);
    expect(getByText("Step B")).toBeTruthy();
    expect(queryByText("Step A")).toBeNull();
  });
});
