import { screen, fireEvent, act } from "@testing-library/react-native";

import ItemModal from "../components/ItemModal";
import { Item, List } from "../data/data";
import {
    TIMEOUT_MS,
    createSections,
    getTextElementValue,
    renderComponent,
} from "./testUtils";
import { ItemCRUD } from "../types";
import * as utils from "../data/utils";

jest.mock("@react-native-async-storage/async-storage", () =>
    require("@react-native-async-storage/async-storage/jest/async-storage-mock")
);

const listId: string = "id";

describe("<ItemModal />", () => {
    let positiveAction = jest.fn();
    let negativeAction = jest.fn();

    describe("create new item", () => {
        it(
            "creates a new item with default values",
            async () => {
                await assertItemValues({
                    oldPosition: 0,
                    newPosition: "bottom",
                    name: "",
                    quantity: 1,
                    isComplete: false,
                    type: "Item",
                    sectionIndex: 0,
                });
            },
            TIMEOUT_MS
        );

        it(
            "creates a new item with custom values",
            async () => {
                await assertItemValues(
                    {
                        oldPosition: 0,
                        newPosition: "top",
                        name: "My Item",
                        quantity: 2,
                        isComplete: false,
                        type: "Item",
                        sectionIndex: 0,
                    },
                    () => {
                        fireEvent.press(
                            screen.getByTestId("increase-quantity")
                        );

                        fireEvent.press(
                            screen.getByTestId("Add to-Top-testID")
                        );

                        fireEvent.changeText(
                            screen.getByTestId("ItemModal-item-name"),
                            "My Item"
                        );
                    }
                );
            },
            TIMEOUT_MS
        );
    });

    describe("edit existing item", () => {
        const oldItem: Item = new Item("Old Name", 2, false);
        it(
            "updates item with same values",
            async () => {
                await assertItemValues(
                    {
                        oldPosition: 0,
                        newPosition: "current",
                        name: "Old Name",
                        quantity: 2,
                        isComplete: false,
                        type: "Item",
                        sectionIndex: 0,
                    },
                    () => {},
                    oldItem
                );
            },
            TIMEOUT_MS
        );

        it(
            "updates item with new values",
            async () => {
                await assertItemValues(
                    {
                        oldPosition: 0,
                        newPosition: "bottom",
                        name: "New Name",
                        quantity: 3,
                        isComplete: false,
                        type: "Item",
                        sectionIndex: 0,
                    },
                    () => {
                        fireEvent.press(
                            screen.getByTestId("increase-quantity")
                        );

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
            },
            TIMEOUT_MS
        );
    });

    describe("Quantity", () => {
        it("increments quantity", async () => {
            await renderComponent(
                itemModalFactory(positiveAction, negativeAction)
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
                    positiveAction,
                    negativeAction,
                    new Item("name", 3, false)
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
        await renderComponent(itemModalFactory(positiveAction, negativeAction));

        fireEvent.press(screen.getByText("Cancel"));
        expect(negativeAction).toBeCalledTimes(1);
    });

    it("presses add button", async () => {
        await renderComponent(itemModalFactory(positiveAction, negativeAction));

        fireEvent.press(screen.getByText("Add"));
        expect(positiveAction).toBeCalledTimes(1);
    });
});

function itemModalFactory(
    positiveAction: (params: ItemCRUD) => void,
    negativeAction: () => void,
    item?: Item
): JSX.Element {
    const list: List = new List(listId, "My List", "List", "bottom", []);
    return (
        <ItemModal
            list={list}
            item={item}
            sections={createSections([])}
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
    newParams: ItemCRUD,
    actions: () => void = () => {},
    item?: Item
): Promise<void> {
    const {
        oldPosition: expectedOldPos,
        newPosition: expectedNewPos,
        name: expectedName,
        quantity: expectedQuantity,
        isComplete: expectedIsComplete,
        type: expectedType,
    } = newParams;

    const positiveAction = (params: ItemCRUD): void => {
        const {
            oldPosition: actualOldPos,
            newPosition: actualNewPos,
            type: actualType,
            name: actualName,
            quantity: actualQuantity,
            isComplete: actualIsComplete,
        } = params;

        expect(actualOldPos).toEqual(expectedOldPos);
        expect(actualNewPos).toEqual(expectedNewPos);
        expect(actualType).toEqual(expectedType);

        // Item
        expect(actualName).toEqual(expectedName);
        expect(actualQuantity).toEqual(expectedQuantity);
        expect(actualIsComplete).toEqual(expectedIsComplete);
    };

    await renderComponent(itemModalFactory(positiveAction, jest.fn(), item));

    // Actions performed on the item modal (e.g., changing the name)
    await act(() => actions());

    // Adding the item
    await act(() => fireEvent.press(screen.getByTestId("custom-modal-Add")));
}
