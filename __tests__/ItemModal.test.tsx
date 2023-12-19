import { screen, fireEvent, act } from "@testing-library/react-native";

import ItemModal from "../components/ItemModal";
import { Item, List } from "../data/data";
import {
    getTextElementValue,
    getTextInputElementValue,
    renderComponent,
} from "./testUtils";
import { ItemCRUD, ListContext } from "../types";
import * as utils from "../data/utils";

jest.mock("@react-native-async-storage/async-storage", () =>
    require("@react-native-async-storage/async-storage/jest/async-storage-mock")
);

const listId: string = "id";

describe("<ItemModal />", () => {
    let positiveAction = jest.fn();
    let negativeAction = jest.fn();

    describe("create new item", () => {
        it("creates a new item with default values", async () => {
            await assertItemValues({
                oldPos: 0,
                newPos: "bottom",
                listId: listId,
                item: new Item("", 1, false, false),
            });
        });

        it("creates a new item with custom values", async () => {
            await assertItemValues(
                {
                    oldPos: 0,
                    newPos: "top",
                    listId: listId,
                    item: new Item("My Item", 2, false, false),
                },
                () => {
                    fireEvent.press(screen.getByTestId("increase-quantity"));

                    fireEvent.press(screen.getByTestId("Add to-Top-testID"));

                    fireEvent.changeText(
                        screen.getByTestId("ItemModal-item-name"),
                        "My Item"
                    );
                }
            );
        });
    });

    describe("edit existing item", () => {
        const oldItem: Item = new Item("Old Name", 2, false, false);
        it("updates item with same values", async () => {
            await assertItemValues(
                {
                    oldPos: 0,
                    newPos: "current",
                    listId: listId,
                    item: oldItem,
                },
                () => {},
                oldItem
            );
        });

        it("updates item with new values", async () => {
            await assertItemValues(
                {
                    oldPos: 0,
                    newPos: "bottom",
                    listId: listId,
                    item: new Item("New Name", 3, false, false),
                },
                () => {
                    fireEvent.press(screen.getByTestId("increase-quantity"));

                    fireEvent.press(
                        screen.getByTestId("Move to-Bottom-testID")
                    );

                    fireEvent.changeText(
                        screen.getByTestId("ItemModal-item-name"),
                        "New Name"
                    );
                },
                oldItem
            );
        });
    });

    describe("Quantity", () => {
        it("increments quantity", async () => {
            await renderComponent(
                itemModalFactory(undefined, positiveAction, negativeAction)
            );

            let quantityValue = getTextElementValue(
                screen.getByTestId("ItemModal-quantity")
            );
            expect(quantityValue).toEqual("1");

            fireEvent.press(screen.getByText("+"));

            quantityValue = getTextElementValue(
                screen.getByTestId("ItemModal-quantity")
            );
            expect(quantityValue).toEqual("2");
        });

        it("decrements quantity", async () => {
            await renderComponent(
                itemModalFactory(
                    new Item("name", 3, false),
                    positiveAction,
                    negativeAction
                )
            );

            let quantityValue = getTextElementValue(
                screen.getByTestId("ItemModal-quantity")
            );

            expect(quantityValue).toEqual("3");

            fireEvent.press(screen.getByText("-"));

            quantityValue = getTextElementValue(
                screen.getByTestId("ItemModal-quantity")
            );
            expect(quantityValue).toEqual("2");

            fireEvent.press(screen.getByText("-"));

            // Test that pressing the decrement buttons, when the quantity is 1, does not decrement the quantiy anymore.
            quantityValue = getTextElementValue(
                screen.getByTestId("ItemModal-quantity")
            );
            expect(quantityValue).toEqual("1");

            fireEvent.press(screen.getByText("-"));

            quantityValue = getTextElementValue(
                screen.getByTestId("ItemModal-quantity")
            );
            expect(quantityValue).toEqual("1");
        });
    });

    it("presses cancel button", async () => {
        await renderComponent(
            itemModalFactory(undefined, positiveAction, negativeAction)
        );

        fireEvent.press(screen.getByText("Cancel"));
        expect(negativeAction).toBeCalledTimes(1);
    });

    it("presses add button", async () => {
        await renderComponent(
            itemModalFactory(undefined, positiveAction, negativeAction)
        );

        fireEvent.press(screen.getByText("Add"));
        expect(positiveAction).toBeCalledTimes(1);
    });

    describe("move items", () => {
        const item: Item = new Item("Item", 1, false);

        it("does not show 'other'", async () => {
            mockAppData([]);

            await renderComponent(
                itemModalFactory(item, positiveAction, negativeAction)
            );

            expect(screen.queryByText("Top")).not.toBeNull();
            expect(screen.queryByText("Current Position")).not.toBeNull();
            expect(screen.queryByText("Bottom")).not.toBeNull();

            expect(screen.queryByText("Other")).toBeNull();
        });

        it("does show 'other'", async () => {
            mockAppData([
                new List("0", "List 1", "Shopping", "bottom"),
                new List("1", "List 2", "Shopping", "bottom"),
            ]);

            await renderComponent(
                itemModalFactory(item, positiveAction, negativeAction)
            );

            expect(screen.queryByText("Top")).not.toBeNull();
            expect(screen.queryByText("Current Position")).not.toBeNull();
            expect(screen.queryByText("Bottom")).not.toBeNull();

            expect(screen.queryByText("Other")).not.toBeNull();
        });
    });
});

function itemModalFactory(
    item: Item | undefined,
    positiveAction: (params: ItemCRUD) => void,
    negativeAction: () => void
): JSX.Element {
    return (
        <ListContext.Provider
            value={new List(listId, "My List", "List", "bottom")}
        >
            <ItemModal
                item={item}
                index={0}
                isVisible={true}
                title="Add a New Item"
                positiveActionText="Add"
                positiveAction={positiveAction}
                negativeActionText="Cancel"
                negativeAction={negativeAction}
                listType={"Shopping"}
                altActionText={"Next"}
                altAction={jest.fn()}
            />
        </ListContext.Provider>
    );
}

/**
 * Mock function calls that retrieve data from APIs used by the app. In this case, the data being mock is
 * list data stored locally in app storage.
 *
 * @param listData shopping/todo/etc. lists
 */
function mockAppData(listData: List[]): void {
    let lists: Promise<List[]> = new Promise<List[]>((resolve) => {
        resolve(listData);
    });

    let numLists: Promise<number> = new Promise<number>((resolve) => {
        resolve(listData.length);
    });

    jest.spyOn(utils, "getLists").mockReturnValue(lists);
    jest.spyOn(utils, "getNumLists").mockReturnValue(numLists);
}

async function assertItemValues(
    expectedParams: ItemCRUD,
    actions: () => void = () => {},
    item?: Item
): Promise<void> {
    const {
        oldPos: expectedOldPos,
        newPos: expectedNewPos,
        listId: expectedListId,
        item: expectedItem,
    } = expectedParams;

    const positiveAction = (params: ItemCRUD): void => {
        const {
            oldPos: actualOldPos,
            newPos: actualNewPos,
            listId: actualListId,
            item: actualItem,
        } = params;

        expect(actualOldPos).toEqual(expectedOldPos);
        expect(actualNewPos).toEqual(expectedNewPos);
        expect(actualListId).toEqual(expectedListId);

        // Item
        expect(actualItem.type).toEqual(expectedItem.type);
        expect(actualItem.name).toEqual(expectedItem.name);
        expect(actualItem.quantity).toEqual(expectedItem.quantity);
        expect(actualItem.isComplete).toEqual(expectedItem.isComplete);
        expect(actualItem.isSelected).toEqual(expectedItem.isSelected);
    };

    await renderComponent(itemModalFactory(item, positiveAction, jest.fn()));

    // Actions performed on the item modal (e.g., changing the name)
    await act(() => actions());

    // Adding the item
    await act(() => fireEvent.press(screen.getByTestId("custom-modal-Add")));
}
