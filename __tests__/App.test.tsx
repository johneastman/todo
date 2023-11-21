/* * * * * * * * * * *
 * Integration Tests *
 * * * * * * * * * * *
 *
 * These tests are for user interaction.
 */
import { screen, fireEvent, waitFor } from "@testing-library/react-native";
import App from "../components/App";
import React from "react";
import uuid from "react-native-uuid";

import {
    expectAllItemsToEqualIsComplete,
    getTextElementValue,
    renderComponent,
} from "./testUtils";
import { ReactTestInstance } from "react-test-renderer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { List } from "../data/data";
import { getItems, getLists } from "../data/utils";

jest.mock("@react-native-async-storage/async-storage", () =>
    require("@react-native-async-storage/async-storage/jest/async-storage-mock")
);

// Source for mocking react-native-reanimated: https://reactnavigation.org/docs/testing/
jest.mock("react-native-reanimated", () => {
    const Reanimated = require("react-native-reanimated/mock");

    // The mock for `call` immediately calls the which is incorrect
    // So we override it with a no-op
    Reanimated.default.call = () => {};

    return Reanimated;
});

describe("<App />", () => {
    beforeEach(async () => {
        // Ensure any lingering data from previous tests is cleared out.
        await AsyncStorage.clear();

        renderComponent(<App />);
    });

    afterEach(async () => {
        await AsyncStorage.clear();
    });

    describe("List Workflows", () => {
        let listName: string;

        beforeEach(() => {
            listName = generateListName();
        });

        describe("Add Workflow", () => {
            const listNamesForAddWorkflow: string[] = [
                "List A",
                "List B",
                "List C",
            ];

            it("adds a list", async () => {
                // Add list
                await addList(listName);

                // Confirm the list was created
                expect(screen.queryByText(listName)).not.toBeNull();
            });

            it("adds lists in reverse order", async () => {
                for (const listName of listNamesForAddWorkflow) {
                    await addList(listName, "Top");
                }

                // Reverse list of names
                let reversedListNames: string[] = listNamesForAddWorkflow
                    .concat()
                    .reverse();

                // Confirm items were added in reverse order (i.e., first item added is at the bottom of the list).
                assertListOrder(reversedListNames);
            });

            it(`adds lists with "next" button`, async () => {
                fireEvent.press(screen.getByText("Add List"));

                // Add lists with "next" button
                for (const listName of listNamesForAddWorkflow) {
                    populateListFieldsForAdd(listName, {});

                    // Add the list
                    await waitFor(() => {
                        fireEvent.press(screen.getByText("Next"));
                    });
                }

                // Confirm lists have been added and are in the expected order
                assertListOrder(listNamesForAddWorkflow);
            });
        });

        describe("Update Workflows", () => {
            const listNames: string[] = ["A", "B", "C"];

            it("updates list", async () => {
                // Add the list
                const oldName: string = "old name";
                const newName: string = "new name";
                await addList(oldName);

                // Confirm list with old name exists and list with new name does not
                expect(screen.queryByText(oldName)).not.toBeNull();
                expect(screen.queryByText(newName)).toBeNull();

                // Update list
                await updateList(0, { name: newName });

                // Confirm list with new name exists and list with old name does not
                expect(screen.queryByText(newName)).not.toBeNull();
                expect(screen.queryByText(oldName)).toBeNull();
            });

            it(`updates multiple lists with "next"`, async () => {
                for (const listName of listNames) {
                    await addList(listName);
                }

                let i = 0;

                // Select edit-list checkbox
                fireEvent.press(screen.getByTestId(`edit-list-checkbox-${i}`));

                // Select Edit Button
                fireEvent.press(screen.getByText("Edit List"));

                for (const listName of listNames) {
                    // Update list name
                    populateListFieldsForUpdate({ name: `${listName}-${i}` });

                    // Press "Next" button to update next list
                    fireEvent.press(screen.getByText("Next"));
                    i++;
                }

                // Dialog will dismiss itself after last one

                // Confirm lists have been updated and are in the correct order
                const newListNames: string[] = listNames.map(
                    (name, index) => `${name}-${index}`
                );
                assertListOrder(newListNames);
            });

            it("moves list from bottom to top", async () => {
                // Add lists
                for (const name of listNames) {
                    await addList(name);
                }

                // Confirm list in expected order
                assertListOrder(listNames);

                // Move last list from bottom to top
                await updateList(2, { position: "Top" });

                // Confirm list is in correct order
                assertListOrder(["C", "A", "B"]);
            });

            it("moves list from top to bottom", async () => {
                // Add lists
                for (const name of listNames) {
                    await addList(name);
                }

                // Confirm list in expected order
                assertListOrder(listNames);

                // Move the first list to the bottom
                await updateList(0, { position: "Bottom" });

                // Confirm the lists are in the correct order
                assertListOrder(["B", "C", "A"]);
            });
        });

        describe("Delete Workflows", () => {
            it("deletes a list", async () => {
                // Add the list
                await addList(listName);

                // Confirm the list has been added
                expect(screen.queryByText(listName)).not.toBeNull();

                // Delete the list
                await deleteListByTestID(0);

                // Confirm the list no longer exists
                expect(screen.queryByText(listName)).toBeNull();
            });

            it("deletes all lists", async () => {
                let lists: string[] = ["A", "B", "C"];

                // Add lists
                for (const listName of lists) {
                    await addList(listName);
                }

                // Delete all lists
                await deleteAllLists();

                // Confirm lists are deleted
                for (const listName of lists) {
                    expect(screen.queryByText(listName)).toBeNull();
                }
            });
        });
    });

    describe("Items Workflows", () => {
        const listName: string = generateListName();
        const itemNames: string[] = ["Item A", "Item B", "Item C"];

        describe("Add Workflow", () => {
            beforeEach(async () => {
                // Create a list
                await addList(listName);

                // Open on newly-created list
                fireEvent.press(screen.getByText(listName));
            });

            it("adds an item to the list", async () => {
                // Add item
                const itemName: string = generateListName();

                addItem(itemName);

                // Confirm item in list
                expect(screen.getByText(itemName)).not.toBeNull();
            });

            it("adds items in reverse order", async () => {
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

            it(`adds items with "next" button`, async () => {
                fireEvent.press(screen.getByText("Add Item"));

                // Add lists with "next" button
                for (const listName of itemNames) {
                    populateItemFieldsForAdd(listName, {});

                    // Add the list
                    await waitFor(() => {
                        fireEvent.press(screen.getByText("Next"));
                    });
                }

                // Confirm lists have been added and are in the expected order
                assertItemsOrder(itemNames);
            });
        });

        describe("Update Workflow", () => {
            it("updates count after items marked as complete", async () => {
                let listId: string = await addList(listName);

                fireEvent.press(screen.getByText(listName));

                addItem("A");
                addItem("B");
                addItem("C");

                // Confirm current header text
                expect(screen.getByText("3 / 3 Items")).not.toBeNull();

                // Select an item
                fireEvent.press(screen.getByTestId("item-cell-name-0"));

                // Confirm new header text
                expect(screen.getByText("2 / 3 Items")).not.toBeNull();

                // Select an item
                fireEvent.press(screen.getByTestId("item-cell-name-1"));

                // Confirm new header text
                expect(screen.getByText("1 / 3 Item")).not.toBeNull();

                // Select an item
                fireEvent.press(screen.getByTestId("item-cell-name-2"));

                // Confirm new header text
                expect(screen.getByText("0 / 3 Items")).not.toBeNull();
            });

            it("sets all items to complete and incomplete", async () => {
                let listId: string = await addList(listName);

                fireEvent.press(screen.getByText(listName));

                addItem("A");
                addItem("B");
                addItem("C");

                // Set all items to complete
                fireEvent.press(
                    screen.getByTestId("items-page-set-all-to-complete")
                );

                expectAllItemsToEqualIsComplete(await getItems(listId), true);

                // Set all items to incomplete
                fireEvent.press(
                    screen.getByTestId("items-page-set-all-to-incomplete")
                );

                expectAllItemsToEqualIsComplete(await getItems(listId), false);
            });

            it("moves last item to top", async () => {
                // Create a list
                await addList(listName);

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

            it("moves first item to bottom", async () => {
                // Create a list
                await addList(listName);

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

            it("copies items from another list", async () => {
                // Add first list
                let firstListName: string = "First List";
                await addList(firstListName);

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
                await addList(secondListName);

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
                    const value: string | ReactTestInstance =
                        getTextElementValue(
                            screen.getByTestId(`item-cell-name-${index}`)
                        );
                    expect(value).toEqual(itemName);
                });
            });

            it(`updates multiple items with "next"`, async () => {
                // Create a list
                await addList(listName);

                // Click on newly-created list
                fireEvent.press(screen.getByText(listName));

                // Add items
                for (const itemName of itemNames) {
                    addItem(itemName);
                }

                let i = 0;

                // Select edit-list checkbox
                fireEvent.press(screen.getByTestId(`edit-item-checkbox-${i}`));

                // Select Edit Button
                fireEvent.press(screen.getByText("Edit Item"));

                for (const itemName of itemNames) {
                    // Update list name
                    populateItemFieldsForUpdate({ name: `${itemName}-${i}` });

                    // Press "Next" button to update next list
                    fireEvent.press(screen.getByText("Next"));
                    i++;
                }

                // Dialog will dismiss itself after last one

                // Confirm lists have been updated and are in the correct order
                const newItemNames: string[] = itemNames.map(
                    (name, index) => `${name}-${index}`
                );
                assertItemsOrder(newItemNames);
            });
        });

        describe("Delete Workflow", () => {
            it("deletes all items from the list", async () => {
                // Add List
                await addList(listName);

                // Navigate into list
                fireEvent.press(screen.getByText(listName));

                // Add items
                const itemNames: string[] = ["A", "B", "C"];
                for (const name of itemNames) {
                    addItem(name);
                }

                // Confirm items are in list
                for (const name of itemNames) {
                    expect(screen.queryByText(name)).not.toBeNull();
                }

                // Delete all items
                await deleteAllItems();

                // Confirm items are no longer in list
                for (const name of itemNames) {
                    expect(screen.queryByText(name)).toBeNull();
                }
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
    positionDisplayName: string = "Bottom",
    listType: string = "Shopping List"
): Promise<string> {
    /* "positionDisplayName" can't be of type "Position" because Position types are not displayed
     * in radio button labels.
     *
     * Appear to be having same testing issues with "react-native-element-dropdown" as "react-native-popup-menu".
     * I am unable to select items from the dropdown menu. See this issue for possible help:
     *     https://github.com/hoaphantn7604/react-native-element-dropdown/issues/175
     */
    fireEvent.press(screen.getByText("Add List"));

    populateListFieldsForAdd(name, {
        position: positionDisplayName,
        type: listType,
    });

    // Add the list
    await waitFor(() => {
        fireEvent.press(screen.getByText("Add"));
    });

    let lists: List[] = (await getLists()).filter((list) => list.name === name);
    if (lists.length !== 1) {
        fail(`No list found with name: ${name}`);
    }
    return lists[0].id;
}

function populateListFieldsForAdd(
    name: string,
    options: { position?: string; type?: string }
): void {
    // Give the list a name
    fireEvent.changeText(
        screen.getByPlaceholderText("Enter the name of your list"),
        name
    );

    // Select List Type
    fireEvent.press(screen.getByText(options.type ?? "Shopping List"));

    // Select where in the list the new item is added
    fireEvent.press(
        screen.getByTestId(`Add to-${options.position ?? "Bottom"}-testID`)
    );
}

async function updateList(
    currentPosition: number,
    newValues: { name?: string; position?: string }
): Promise<void> {
    const { name, position } = newValues;

    // Select edit-list checkbox
    fireEvent.press(
        screen.getByTestId(`edit-list-checkbox-${currentPosition}`)
    );

    // Select edit Button at top of screen
    fireEvent.press(screen.getByText("Edit List"));

    // Update values
    populateListFieldsForUpdate({ name: name, position: position });

    // Perform update operation
    await waitFor(() => {
        fireEvent.press(screen.getByTestId("custom-modal-Update"));
    });
}

function populateListFieldsForUpdate(newValues: {
    name?: string;
    position?: string;
}): void {
    // Update the name of the list
    if (newValues.name !== undefined) {
        fireEvent.changeText(
            screen.getByTestId("ListModal-list-name"),
            newValues.name
        );
    }

    // Select new position
    const newPosition: string =
        newValues.position === undefined
            ? "Current Position"
            : newValues.position;
    fireEvent.press(screen.getByTestId(`Move to-${newPosition}-testID`));
}

async function deleteListByTestID(position: number): Promise<void> {
    // Select checkbox next to item
    fireEvent.press(screen.getByTestId(`edit-list-checkbox-${position}`));

    // Delete all (selected) items.
    await deleteAllLists();
}

async function deleteAllLists(): Promise<void> {
    await waitFor(() => {
        // "Delete all items" button
        fireEvent.press(screen.getByTestId("lists-page-delete-all-items"));

        // Confirmation modal
        fireEvent.press(screen.getByText("Yes"));
    });
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
    fireEvent.press(
        screen.getByTestId(`Move to-${positionDisplayName}-testID`)
    );

    // Press "Update" button
    fireEvent.press(screen.getByTestId("custom-modal-Update"));
}

async function addItem(
    name: string,
    positionDisplayName: string = "Bottom"
): Promise<void> {
    // Click "Add Item" button
    fireEvent.press(screen.getByText("Add Item"));

    populateItemFieldsForAdd(name, { position: positionDisplayName });

    // Perform add-item operation
    await waitFor(() => {
        fireEvent.press(screen.getByText("Add"));
    });
}

function populateItemFieldsForAdd(
    name: string,
    options: { position?: string }
): void {
    // Give item a name
    fireEvent.changeText(
        screen.getByPlaceholderText("Enter the name of your item"),
        name
    );

    // Select where in the list the new item is added.
    fireEvent.press(screen.getByText(options.position ?? "Bottom"));
}

function populateItemFieldsForUpdate(newValues: {
    name?: string;
    position?: string;
}): void {
    // Give item a name
    if (newValues.name !== undefined) {
        fireEvent.changeText(
            screen.getByTestId("ItemModal-item-name"),
            newValues.name
        );
    }

    if (newValues.position !== undefined) {
        // Select where in the list the new item is added.
        fireEvent.press(screen.getByText(newValues.position));
    }
}

async function deleteAllItems(): Promise<void> {
    await waitFor(() => {
        // Select "Delete all items" button
        fireEvent.press(screen.getByTestId("items-page-delete-all-items"));

        // Confirm deletion
        fireEvent.press(screen.getByText("Yes"));
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

function generateListName(): string {
    return `list-name-${uuid.v4().toString()}`;
}

/* * * * * * * * * * *
 * Assertion Helpers *
 * * * * * * * * * * */

function assertListOrder(names: string[]): void {
    names.forEach((expectedName, index) => {
        let actualName: string | ReactTestInstance = getTextElementValue(
            screen.getByTestId(`list-cell-name-${index}`)
        );
        expect(actualName).toEqual(expectedName);
    });
}

function assertItemsOrder(names: string[]): void {
    names.forEach((expectedName, index) => {
        let actualName: string | ReactTestInstance = getTextElementValue(
            screen.getByTestId(`item-cell-name-${index}`)
        );
        expect(actualName).toEqual(expectedName);
    });
}
