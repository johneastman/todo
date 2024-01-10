/* * * * * * * * * * *
 * Integration Tests *
 * * * * * * * * * * *
 *
 * These tests are for user interaction.
 */
import { screen, fireEvent } from "@testing-library/react-native";
import App from "../components/App";
import React from "react";
import uuid from "react-native-uuid";

import {
    expectAllItemsToEqualIsComplete,
    getTextElementValue,
    populateListModal,
    renderComponent,
} from "./testUtils";
import { ReactTestInstance, act } from "react-test-renderer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BOTTOM, List, TOP } from "../data/data";
import { getItems, getLists } from "../data/utils";
import { Position, SelectionValue } from "../types";

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

jest.mock("@react-native-clipboard/clipboard", () => {
    require("@react-native-clipboard/clipboard/jest/clipboard-mock.js");
});

describe("<App />", () => {
    beforeEach(async () => {
        // Ensure any lingering data from previous tests is cleared out.
        await AsyncStorage.clear();

        await renderComponent(<App />);
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
                    await addList(listName, TOP);
                }

                // Reverse list of names
                let reversedListNames: string[] = listNamesForAddWorkflow
                    .concat()
                    .reverse();

                // Confirm items were added in reverse order (i.e., first item added is at the bottom of the list).
                assertListOrder(reversedListNames);
            });

            it(`adds lists with "next" button`, async () => {
                await openAddListModal();

                // Add lists with "next" button
                for (const listName of listNamesForAddWorkflow) {
                    await populateListModal({ name: listName });

                    // Add the list
                    await pressNext();
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
                await act(() =>
                    fireEvent.press(
                        screen.getByTestId(`edit-list-checkbox-${i}`)
                    )
                );

                // Select Edit Button
                await openEditListModal();

                for (const listName of listNames) {
                    // Update list name
                    await populateListFieldsForUpdate({
                        name: `${listName}-${i}`,
                    });

                    // Press "Next" button to update next list
                    await pressNext();
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

            it("selects and de-selects all lists", async () => {
                // Add lists
                for (const name of listNames) {
                    await addList(name);
                }

                // Press "Select All" button
                await selectAll();

                // Confirm all lists are selected
                for (let list of await getLists()) {
                    expect(list.isSelected).toEqual(true);
                }

                // De-select all lists by pressing "Select All" button again
                await selectAll();

                // Confirm all lists are not selected
                for (let list of await getLists()) {
                    expect(list.isSelected).toEqual(false);
                }
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
        // const listName: string = generateListName();
        // const itemNames: string[] = ["Item A", "Item B", "Item C"];
        // describe("Add Workflow", () => {
        //     beforeEach(async () => {
        //         // Create a list
        //         await addList(listName);
        //         // Open on newly-created list
        //         // await selectList(listName);
        //     });
        //     it("adds an item to the list", async () => {
        //         // Add item
        //         const itemName: string = generateListName();
        //         await addItem(itemName);
        //         // Confirm item in list
        //         expect(screen.getByText(itemName)).not.toBeNull();
        //     });
        // it("adds items in reverse order", async () => {
        //     // Add each item to the top of the list
        //     for (let itemName of itemNames) {
        //         await addItem(itemName, "Top");
        //     }
        //     // Assert the items were added in reverse order.
        //     let reversedItemNames: string[] = itemNames.concat().reverse();
        //     reversedItemNames.forEach((itemName, index) => {
        //         let value: string | ReactTestInstance = getTextElementValue(
        //             screen.getByTestId(`item-cell-name-${index}`)
        //         );
        //         expect(value).toEqual(itemName);
        //     });
        // });
        // it(`adds items with "next" button`, async () => {
        //     await openAddItemModal();
        //     // Add lists with "next" button
        //     for (const listName of itemNames) {
        //         await populateItemFieldsForAdd(listName, {});
        //         // Add the list
        //         await pressNext();
        //     }
        //     // Confirm lists have been added and are in the expected order
        //     assertItemsOrder(itemNames);
        // });
    });

    //     describe("Update Workflow", () => {
    //         it("updates count after items marked as complete", async () => {
    //             await addList(listName);

    //             await selectList(listName);

    //             await addItem("A");
    //             await addItem("B");
    //             await addItem("C");

    //             // Confirm current header text
    //             expect(screen.getByText("3 / 3 Items")).not.toBeNull();

    //             // Select an item
    //             fireEvent.press(screen.getByTestId("item-cell-name-0"));

    //             // Confirm new header text
    //             expect(screen.getByText("2 / 3 Items")).not.toBeNull();

    //             // Select an item
    //             fireEvent.press(screen.getByTestId("item-cell-name-1"));

    //             // Confirm new header text
    //             expect(screen.getByText("1 / 3 Item")).not.toBeNull();

    //             // Select an item
    //             fireEvent.press(screen.getByTestId("item-cell-name-2"));

    //             // Confirm new header text
    //             expect(screen.getByText("0 / 3 Items")).not.toBeNull();
    //         });

    //         it("sets all items to complete and incomplete", async () => {
    //             let listId: string = await addList(listName);

    //             await selectList(listName);

    //             await addItem("A");
    //             await addItem("B");
    //             await addItem("C");

    //             // Open "Options" drawer
    //             await openOptionsDrawer("Item");

    //             // Set all items to complete
    //             await act(() =>
    //                 fireEvent.press(
    //                     screen.getByTestId("items-page-set-all-to-complete")
    //                 )
    //             );

    //             expectAllItemsToEqualIsComplete(await getItems(listId), true);

    //             // Open "Options" drawer again (because it closes after every action).
    //             await openOptionsDrawer("Item");

    //             // Set all items to incomplete
    //             await act(() =>
    //                 fireEvent.press(
    //                     screen.getByTestId("items-page-set-all-to-incomplete")
    //                 )
    //             );

    //             expectAllItemsToEqualIsComplete(await getItems(listId), false);
    //         });

    //         it("moves last item to top", async () => {
    //             // Create a list
    //             await addList(listName);

    //             // Click on newly-created list
    //             await selectList(listName);

    //             // Add each item to the list
    //             for (let itemName of itemNames) {
    //                 await addItem(itemName);
    //             }

    //             await updateItems(2, "Top");

    //             ["Item C", "Item A", "Item B"].forEach(
    //                 async (itemName, index) => {
    //                     let value: string | ReactTestInstance =
    //                         getTextElementValue(
    //                             await screen.findByTestId(
    //                                 `item-cell-name-${index}`
    //                             )
    //                         );
    //                     expect(value).toEqual(itemName);
    //                 }
    //             );
    //         });

    //         it("moves first item to bottom", async () => {
    //             // Create a list
    //             await addList(listName);

    //             // Click on newly-created list
    //             await selectList(listName);

    //             // Add each item to the list
    //             for (let itemName of itemNames) {
    //                 await addItem(itemName);
    //             }

    //             await updateItems(0, "Bottom");

    //             ["Item B", "Item C", "Item A"].forEach((itemName, index) => {
    //                 let value: string | ReactTestInstance = getTextElementValue(
    //                     screen.getByTestId(`item-cell-name-${index}`)
    //                 );
    //                 expect(value).toEqual(itemName);
    //             });
    //         });

    //         it(`updates multiple items with "next"`, async () => {
    //             // Create a list
    //             await addList(listName);

    //             // Click on newly-created list
    //             await selectList(listName);

    //             // Add items
    //             for (const itemName of itemNames) {
    //                 await addItem(itemName);
    //             }

    //             let i = 0;

    //             // Select edit-list checkbox
    //             await act(() =>
    //                 fireEvent.press(
    //                     screen.getByTestId(`edit-item-checkbox-${i}`)
    //                 )
    //             );

    //             // Select Edit Button
    //             await openEditItemModal();

    //             for (const itemName of itemNames) {
    //                 // Update list name
    //                 await populateItemFieldsForUpdate({
    //                     name: `${itemName}-${i}`,
    //                 });

    //                 // Press "Next" button to update next list
    //                 await pressNext();
    //                 i++;
    //             }

    //             // Dialog will dismiss itself after last one

    //             // Confirm lists have been updated and are in the correct order
    //             const newItemNames: string[] = itemNames.map(
    //                 (name, index) => `${name}-${index}`
    //             );
    //             assertItemsOrder(newItemNames);
    //         });
    //     });

    //     describe("Delete Workflow", () => {
    //         it("deletes all items from the list", async () => {
    //             // Add List
    //             await addList(listName);

    //             // Navigate into list
    //             await selectList(listName);

    //             // Add items
    //             const itemNames: string[] = ["A", "B", "C"];
    //             for (const name of itemNames) {
    //                 await addItem(name);
    //             }

    //             // Confirm items are in list
    //             for (const name of itemNames) {
    //                 expect(screen.queryByText(name)).not.toBeNull();
    //             }

    //             // Delete all items
    //             await deleteAllItems();

    //             // Confirm items are no longer in list
    //             for (const name of itemNames) {
    //                 expect(screen.queryByText(name)).toBeNull();
    //             }
    //         });
    //    });
    //});
});

/* * * * * * * * * * * *
 * Reusable Workflows  *
 * * * * * * * * * * * */
async function goBack(): Promise<void> {
    // Open Items Drawer
    await openOptionsDrawer("Item");

    // Press Back button
    await act(() => {
        fireEvent.press(screen.getByTestId("items-page-back-button"));
    });
}

async function openOptionsDrawer(view: "List" | "Item"): Promise<void> {
    await act(() => fireEvent.press(screen.getByText(`${view} Options`)));
}

// Lists

async function addList(
    name: string,
    position: SelectionValue<Position> = BOTTOM,
    listType: string = "Shopping List"
): Promise<string> {
    await openAddListModal();

    await populateListModal({
        name: name,
        position: position,
        type: listType,
    });

    // Add the list
    await act(() => {
        fireEvent.press(screen.getByText("Add"));
    });

    let lists: List[] = (await getLists()).filter((list) => list.name === name);
    if (lists.length !== 1) {
        fail(`No list found with name: ${name}`);
    }
    return lists[0].id;
}

async function updateList(
    currentPosition: number,
    newValues: { name?: string; position?: string }
): Promise<void> {
    const { name, position } = newValues;

    // Select edit-list checkbox
    act(() =>
        fireEvent.press(
            screen.getByTestId(`edit-list-checkbox-${currentPosition}`)
        )
    );

    // Select edit Button at top of screen
    await openEditListModal();

    // Update values
    await populateListFieldsForUpdate({ name: name, position: position });

    // Perform update operation
    await act(() => {
        fireEvent.press(screen.getByTestId("custom-modal-Update"));
    });
}

async function openAddListModal(): Promise<void> {
    await act(() => fireEvent.press(screen.getByText("Add List")));
}

async function openEditListModal(): Promise<void> {
    await act(() => fireEvent.press(screen.getByText("Edit List")));
}

async function selectList(listName: string): Promise<void> {
    await act(() => fireEvent.press(screen.getByText(listName)));
}

async function populateListFieldsForUpdate(newValues: {
    name?: string;
    position?: string;
}): Promise<void> {
    await act(() => {
        // Update the name of the list
        if (newValues.name !== undefined) {
            fireEvent.changeText(
                screen.getByTestId("ListModal-list-name"),
                newValues.name
            );
        }
    });

    await act(() => {
        // Select new position
        const newPosition: string =
            newValues.position === undefined
                ? "Current Position"
                : newValues.position;
        fireEvent.press(screen.getByTestId(`Move to-${newPosition}-testID`));
    });
}

async function deleteListByTestID(position: number): Promise<void> {
    // Open "Options" drawer
    await openOptionsDrawer("List");

    // Select checkbox next to item
    await act(() =>
        fireEvent.press(screen.getByTestId(`edit-list-checkbox-${position}`))
    );

    // Delete all (selected) items.
    await deleteAllLists();
}

async function deleteAllLists(): Promise<void> {
    // Open "Options" drawer
    await openOptionsDrawer("List");

    // "Delete all items" button
    await act(() =>
        fireEvent.press(screen.getByTestId("lists-page-delete-all-items"))
    );

    // Confirmation modal
    await act(() => fireEvent.press(screen.getByText("Yes")));
}

async function updateItems(
    currentPositionIndex: number,
    positionDisplayName: string = "Current Position"
): Promise<void> {
    // Edit item checkbox
    await act(() =>
        fireEvent.press(
            screen.getByTestId(`edit-item-checkbox-${currentPositionIndex}`)
        )
    );

    // Edit Button at top of screen
    await openEditItemModal();

    // Where to move the item in the list
    fireEvent.press(
        screen.getByTestId(`Move to-${positionDisplayName}-testID`)
    );

    // Press "Update" button
    await act(() => fireEvent.press(screen.getByTestId("custom-modal-Update")));
}

async function addItem(
    name: string,
    positionDisplayName: string = "Bottom"
): Promise<void> {
    // Click "Add Item" button
    await openAddItemModal();

    await populateItemFieldsForAdd(name, { position: positionDisplayName });

    // Perform add-item operation
    await act(() => {
        fireEvent.press(screen.getByText("Add"));
    });
}

async function populateItemFieldsForAdd(
    name: string,
    options: { position?: string }
): Promise<void> {
    // Give item a name
    await act(() =>
        fireEvent.changeText(
            screen.getByPlaceholderText("Enter the name of your item"),
            name
        )
    );

    // Select where in the list the new item is added.
    await act(() =>
        fireEvent.press(screen.getByText(options.position ?? "Bottom"))
    );
}

async function populateItemFieldsForUpdate(newValues: {
    name?: string;
    position?: string;
}): Promise<void> {
    // Give item a name
    if (newValues.name !== undefined) {
        await act(() =>
            fireEvent.changeText(
                screen.getByTestId("ItemModal-item-name"),
                newValues.name
            )
        );
    }

    await act(() => {
        if (newValues.position !== undefined) {
            // Select where in the list the new item is added.
            fireEvent.press(screen.getByText(newValues.position));
        }
    });
}

async function deleteAllItems(): Promise<void> {
    // Open "Options" drawer
    await openOptionsDrawer("Item");

    // Select "Delete all items" button
    await act(() =>
        fireEvent.press(screen.getByTestId("items-page-delete-all-items"))
    );

    // Confirm deletion
    await act(() => fireEvent.press(screen.getByText("Yes")));
}

async function selectAll(): Promise<void> {
    await act(() => {
        fireEvent.press(screen.getByText("Select All"));
    });
}

async function pressNext(): Promise<void> {
    await act(() => fireEvent.press(screen.getByText("Next")));
}

async function openAddItemModal(): Promise<void> {
    await act(() => fireEvent.press(screen.getByText("Add Item")));
}

async function openEditItemModal(): Promise<void> {
    await act(() => fireEvent.press(screen.getByText("Edit Item")));
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
