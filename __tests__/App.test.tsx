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
        // Ensure any lingering data from previous tests is cleared out.
        await AsyncStorage.clear();

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
        // Skipping because `MenuOption`s apparently don't render during testing: https://stackoverflow.com/a/44400297
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

    describe("move lists with add and update", () => {
        let listNames: string[] = ["List A", "List B", "List C"];

        it("adds lists in reverse order", () => {
            listNames.forEach((listName) => {
                addList(listName, "Top");
            });

            let reversedListNames: string[] = listNames.concat().reverse();

            // The lists will be added in reverse order, so ensure the first list is the last one added and
            // the last list is the first one added.
            reversedListNames.forEach((listName, index) => {
                let value: string | ReactTestInstance = getTextElementValue(
                    screen.getByTestId(`list-cell-name-${index}`)
                );
                expect(value).toEqual(listName);
            });
        });

        it("moves last list to top", () => {
            listNames.forEach((listName) => {
                addList(listName);
            });

            updateLists(2, "Top");

            ["List C", "List A", "List B"].forEach((listName, index) => {
                let value: string | ReactTestInstance = getTextElementValue(
                    screen.getByTestId(`list-cell-name-${index}`)
                );
                expect(value).toEqual(listName);
            });
        });

        it("moves first list to bottom", () => {
            listNames.forEach((listName) => {
                addList(listName);
            });

            updateLists(0, "Bottom");

            ["List B", "List C", "List A"].forEach((listName, index) => {
                let value: string | ReactTestInstance = getTextElementValue(
                    screen.getByTestId(`list-cell-name-${index}`)
                );
                expect(value).toEqual(listName);
            });
        });
    });

    describe("move items with add and update", () => {
        let itemNames: string[] = ["Item A", "Item B", "Item C"];

        it("adds items in reverse order", () => {
            // Create a list
            addList("My List");

            // Click on newly-created list
            fireEvent.press(screen.getByText("My List"));

            // Add each item to the top of the list

            itemNames.forEach((itemName) => {
                addItem(itemName, "Top");
            });

            // Assert the items were added in reverse order.
            let reversedItemNames: string[] = itemNames.concat().reverse();

            reversedItemNames.forEach((itemName, index) => {
                let value: string | ReactTestInstance = getTextElementValue(
                    screen.getByTestId(`item-cell-name-${index}`)
                );
                expect(value).toEqual(itemName);
            });
        });

        it("moves last list to top", () => {
            // Create a list
            addList("My List");

            // Click on newly-created list
            fireEvent.press(screen.getByText("My List"));

            // Add each item to the list
            itemNames.forEach((itemName) => {
                addItem(itemName);
            });

            updateLists(2, "Top");

            ["Item C", "Item A", "Item B"].forEach((itemName, index) => {
                let value: string | ReactTestInstance = getTextElementValue(
                    screen.getByTestId(`item-cell-name-${index}`)
                );
                expect(value).toEqual(itemName);
            });
        });

        it("moves first list to bottom", () => {
            // Create a list
            addList("My List");

            // Click on newly-created list
            fireEvent.press(screen.getByText("My List"));

            // Add each item to the list
            itemNames.forEach((itemName) => {
                addItem(itemName);
            });

            updateLists(0, "Bottom");

            ["Item B", "Item C", "Item A"].forEach((itemName, index) => {
                let value: string | ReactTestInstance = getTextElementValue(
                    screen.getByTestId(`item-cell-name-${index}`)
                );
                expect(value).toEqual(itemName);
            });
        });
    });
});

function addList(name: string, positionDisplayName: string = "Bottom"): void {
    /* "positionDisplayName" can't be of type "Position" because Position types are not displayed
     * in radio button labels.
     *
     * Appear to be having same testing issues with "react-native-element-dropdown" as "react-native-popup-menu".
     * I am unable to select items from the dropdown menu. See this issue for possible help:
     *     https://github.com/hoaphantn7604/react-native-element-dropdown/issues/175
     */
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

// Works for both List and Item
function updateLists(
    currentPositionIndex: number,
    positionDisplayName: string = "Current Position"
): void {
    fireEvent.press(
        screen.getByTestId(`list-cell-update-${currentPositionIndex}`)
    );
    fireEvent.press(screen.getByText(positionDisplayName));
    fireEvent.press(screen.getByTestId("custom-modal-Update"));
}

async function addItem(
    name: string,
    positionDisplayName: string = "Bottom"
): Promise<void> {
    fireEvent.press(screen.getByText("Add Item"));

    fireEvent.changeText(
        screen.getByPlaceholderText("Enter the name of your item"),
        name
    );

    // Select where in the list the new item is added.
    fireEvent.press(screen.getByText(positionDisplayName));

    await waitFor(() => {
        fireEvent.press(screen.getByText("Add"));
    });
}

async function deleteAllItems(): Promise<void> {
    await waitFor(() => {
        fireEvent.press(screen.getByTestId("items-page-delete-all-items")); // "Delete all items" button
        fireEvent.press(screen.getByText("Yes")); // Confirmation modal
    });
}
