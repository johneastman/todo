/* * * * * * * * * * *
 * Integration Tests *
 * * * * * * * * * * *
 *
 * These tests are for user interaction.
 */
import {
    render,
    screen,
    fireEvent,
    waitFor,
} from "@testing-library/react-native";
import App from "../components/App";
import React from "react";
import { getTextElementValue } from "./testUtils";
import { ReactTestInstance } from "react-test-renderer";
import AsyncStorage from "@react-native-async-storage/async-storage";

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

    afterEach(async () => {
        await AsyncStorage.clear();
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

    describe("move items with add and update", () => {
        it("adds items in reverse order", () => {
            let listNames: string[] = ["List A", "List B", "List C"];

            listNames.forEach((listName) => {
                addList(listName, "Top");
            });

            // The lists will be added in reverse order, so ensure the first list is the last one added and
            // the last list is the first one added.
            listNames.reverse().forEach((listName, index) => {
                let value: string | ReactTestInstance = getTextElementValue(
                    screen.getByTestId(`list-cell-name-${index}`)
                );
                expect(value).toEqual(listName);
            });
        });

        it("moves last item to top", async () => {
            let listNames: string[] = ["List A", "List B", "List C"];

            listNames.forEach((listName) => {
                addList(listName);
            });

            updateList(2, "Top");

            ["List C", "List A", "List B"].forEach((listName, index) => {
                let value: string | ReactTestInstance = getTextElementValue(
                    screen.getByTestId(`list-cell-name-${index}`)
                );
                expect(value).toEqual(listName);
            });
        });

        it("moves first item to bottom", async () => {
            let listNames: string[] = ["List A", "List B", "List C"];

            listNames.forEach((listName) => {
                addList(listName);
            });

            updateList(0, "Bottom");

            ["List B", "List C", "List A"].forEach((listName, index) => {
                let value: string | ReactTestInstance = getTextElementValue(
                    screen.getByTestId(`list-cell-name-${index}`)
                );
                expect(value).toEqual(listName);
            });
        });
    });
});

function addList(name: string, positionDisplayName: string = "Bottom"): void {
    fireEvent.press(screen.getByText("Add List"));

    // Give the list a name
    fireEvent.changeText(
        screen.getByPlaceholderText("Enter the name of your list"),
        name
    );

    // Select where in the list the new item is added
    fireEvent.press(screen.getByText(positionDisplayName));

    fireEvent.press(screen.getByText("Add"));
}

function updateList(
    currentPositionIndex: number,
    positionDisplayName: string = "Current Position"
): void {
    fireEvent.press(
        screen.getByTestId(`list-cell-update-${currentPositionIndex}`)
    );
    fireEvent.press(screen.getByText(positionDisplayName));
    fireEvent.press(screen.getByTestId("custom-modal-Update"));
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
