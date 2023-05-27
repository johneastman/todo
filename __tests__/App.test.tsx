import {
    render,
    screen,
    fireEvent,
    waitFor,
} from "@testing-library/react-native";
import App from "../components/App";
import React from "react";

jest.mock("@react-native-async-storage/async-storage", () =>
    require("@react-native-async-storage/async-storage/jest/async-storage-mock")
);

// Source for mocking react-native-reanimated: https://reactnavigation.org/docs/testing/
jest.mock("react-native-reanimated", () => {
    const Reanimated = require("react-native-reanimated/mock");

    // The mock for `call` immediately calls the callback which is incorrect
    // So we override it with a no-op
    Reanimated.default.call = () => {};

    return Reanimated;
});

describe("<App />", () => {
    beforeEach(async () => {
        await waitFor(() => {
            render(<App />);
        });
    });

    it("adds a list", () => {
        addList("first");
        expect(screen.getByText("first")).not.toBeNull();
    });
});

function addList(name: string): void {
    fireEvent.press(screen.getByText("Add List"));

    fireEvent.changeText(
        screen.getByPlaceholderText("Enter the name of your list"),
        name
    );

    fireEvent.press(screen.getByText("Add"));
}
