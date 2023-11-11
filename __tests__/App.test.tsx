/* * * * * * * * * * *
 * Integration Tests *
 * * * * * * * * * * *
 *
 * These tests are for user interaction.
 */
import { screen, fireEvent, waitFor } from "@testing-library/react-native";
import App from "../components/App";
import React from "react";
import {
    expectAllItemsToEqualIsComplete,
    getTextElementValue,
    renderComponent,
} from "./testUtils";
import { ReactTestInstance } from "react-test-renderer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getItems, getLists } from "../data/utils";
import { List } from "../data/data";

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
    const listName: string = "my list";

    beforeEach(async () => {
        // Ensure any lingering data from previous tests is cleared out.
        await AsyncStorage.clear();

        renderComponent(<App />);
    });

    afterEach(async () => {
        await AsyncStorage.clear();
    });

    it("adds a list", async () => {
        await addList(listName);
        expect(screen.getByText(listName)).not.toBeNull();
    });

    it("deletes all items from the list", () => {
        addList(listName);

        fireEvent.press(screen.getByText(listName));

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

    it("deletes all lists", async () => {
        let lists: string[] = ["A", "B", "C"];

        // Add lists
        for (let listName of lists) {
            await addList(listName);
        }

        // Delete all lists
        await deleteAllLists();

        // Confirm lists are deleted
        for (let listName of lists) {
            expect(screen.queryByText(listName)).toBeNull();
        }
    });

    it("sets all items to complete and incomplete", async () => {
        let listId: string = await addList(listName);

        fireEvent.press(screen.getByText(listName));

        addItem("A");
        addItem("B");
        addItem("C");

        // Set all items to complete
        fireEvent.press(screen.getByTestId("items-page-set-all-to-complete"));

        expectAllItemsToEqualIsComplete(await getItems(listId), true);

        // Set all items to incomplete
        fireEvent.press(screen.getByTestId("items-page-set-all-to-incomplete"));

        expectAllItemsToEqualIsComplete(await getItems(listId), false);
    });

    // TODO: write code to replace dropdowns with radio buttons when tests are running
    it("copies items from another list", async () => {
        // Add first list
        let firstListName: string = "First List";
        const firstListId: string = await addList(firstListName);

        // Navigate into first list
        fireEvent.press(screen.getByText(firstListName));

        // Add items to first list
        addItem("A");
        addItem("B");
        addItem("C");

        // Go back to list view
        await goBack();

        // Add second list
        let secondListName: string = "Second List";
        const secondListId: string = await addList(secondListName);

        // Navigate into second list
        fireEvent.press(await screen.findByText(secondListName));

        // Add items to second list
        addItem("D");
        addItem("E");

        /* When the tests are running, items added to a list appear not to save unless the app navigates back
         * to the list view. So to work around this querk, the tests go back to the list view and then back
         * into the second list.
         */

        // Go back to list view
        await goBack();

        // Navigate into second list
        fireEvent.press(await screen.findByText(secondListName));

        // Copy items from first list into second list
        await copyItemsFrom(firstListName);

        // Verify items have been copied from first list into second list
        ["D", "E", "A", "B", "C"].forEach((itemName, index) => {
            const value: string | ReactTestInstance = getTextElementValue(
                screen.getByTestId(`item-cell-name-${index}`)
            );
            expect(value).toEqual(itemName);
        });
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
            addList(listName);

            // Open on newly-created list
            fireEvent.press(screen.getByText(listName));

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
            addList(listName);

            // Click on newly-created list
            fireEvent.press(screen.getByText(listName));

            // Add each item to the list
            itemNames.forEach((itemName) => {
                addItem(itemName);
            });

            updateItems(2, "Top");

            ["Item C", "Item A", "Item B"].forEach((itemName, index) => {
                let value: string | ReactTestInstance = getTextElementValue(
                    screen.getByTestId(`item-cell-name-${index}`)
                );
                expect(value).toEqual(itemName);
            });
        });

        it("moves first list to bottom", () => {
            // Create a list
            addList(listName);

            // Click on newly-created list
            fireEvent.press(screen.getByText(listName));

            // Add each item to the list
            itemNames.forEach((itemName) => {
                addItem(itemName);
            });

            updateItems(0, "Bottom");

            ["Item B", "Item C", "Item A"].forEach((itemName, index) => {
                let value: string | ReactTestInstance = getTextElementValue(
                    screen.getByTestId(`item-cell-name-${index}`)
                );
                expect(value).toEqual(itemName);
            });
        });
    });
});

// Functions that breakout reusable workflows

async function goBack(): Promise<void> {
    await waitFor(() => {
        fireEvent.press(screen.getByTestId("items-page-back-button"));
    });
}

async function addList(
    name: string,
    positionDisplayName: string = "Bottom"
): Promise<string> {
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

    let lists: List[] = (await getLists()).filter((list) => list.name === name);
    if (lists.length !== 1) {
        fail(`No list found with name: ${name}`);
    }
    return lists[0].id;
}

function updateLists(
    currentPositionIndex: number,
    positionDisplayName: string = "Current Position"
): void {
    fireEvent.press(
        screen.getByTestId(`list-cell-update-${currentPositionIndex}`)
    );
    fireEvent.press(screen.getByTestId(`${positionDisplayName}-testID`));
    fireEvent.press(screen.getByTestId("custom-modal-Update"));
}

function updateItems(
    currentPositionIndex: number,
    positionDisplayName: string = "Current Position"
): void {
    // Edit item checkbox
    fireEvent.press(
        screen.getByTestId(`edit-item-checkbox-${currentPositionIndex}`)
    );

    // Edit Button at top of screen
    fireEvent.press(screen.getByText("Edit Item"));

    // Where to move the item in the list
    fireEvent.press(screen.getByTestId(`${positionDisplayName}-testID`));

    // Press "Update" button
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

async function copyItemsFrom(listName: string): Promise<void> {
    await waitFor(() => {
        // Copy items from first list into second list
        fireEvent.press(screen.getByText("Copy Items From"));

        // Select list to copy items from
        fireEvent.press(screen.getByText(listName));

        // Confirm copy
        fireEvent.press(screen.getByText("Copy"));
    });
}

async function deleteAllItems(): Promise<void> {
    await waitFor(() => {
        fireEvent.press(screen.getByTestId("items-page-delete-all-items")); // "Delete all items" button
        fireEvent.press(screen.getByText("Yes")); // Confirmation modal
    });
}

async function deleteAllLists(): Promise<void> {
    await waitFor(() => {
        fireEvent.press(screen.getByTestId("lists-page-delete-all-items")); // "Delete all items" button
        fireEvent.press(screen.getByText("Yes")); // Confirmation button on modal
    });
}
