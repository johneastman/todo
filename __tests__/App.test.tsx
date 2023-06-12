import {
    render,
    screen,
    fireEvent,
    waitFor,
    act,
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

    it("deletes all items from the list", () => {
        addList("my list");

        fireEvent.press(screen.getByText("my list"));

        addItem("A");
        addItem("B");
        addItem("C");

        // Confirm items are in list
        expect(screen.queryByText("A")).not.toBeNull();
        expect(screen.queryByText("B")).not.toBeNull();
        expect(screen.queryByText("C")).not.toBeNull();

        // Delete all items
        deleteAllItems();

        // Confirm items are no longer in list
        expect(screen.queryByText("A")).toBeNull();
        expect(screen.queryByText("B")).toBeNull();
        expect(screen.queryByText("C")).toBeNull();
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

async function addItem(name: string): Promise<void> {
    fireEvent.press(screen.getByText("Add Item"));

    fireEvent.changeText(
        screen.getByPlaceholderText("Enter the name of your item"),
        name
    );

    await waitFor(() => {
        fireEvent.press(screen.getByText("Add"));
    });
}

async function deleteAllItems(): Promise<void> {
    await waitFor(() => {
        fireEvent.press(screen.getByText("Delete All Items")); // "Delete all items" button
        fireEvent.press(screen.getByText("Yes")); // Confirmation modal
    });
}
