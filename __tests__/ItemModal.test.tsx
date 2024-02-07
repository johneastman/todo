import { screen, fireEvent, act } from "@testing-library/react-native";

import ItemModal from "../components/ItemModal";
import { Item, List } from "../data/data";
import {
    TIMEOUT_MS,
    findByText,
    getTextElementValue,
    renderComponent,
} from "./testUtils";
import { AppAction, AppData, AppDataContext, ItemCRUD } from "../types";
import { AppContext, defaultSettings } from "../contexts/app.context";

jest.mock("@react-native-async-storage/async-storage", () =>
    require("@react-native-async-storage/async-storage/jest/async-storage-mock")
);

const listId: string = "id";
const item: Item = new Item("Old Name", 3, "Item", false, false);
const list: List = new List(listId, "My List", "Shopping", "bottom", [item]);

describe("<ItemModal />", () => {
    let positiveAction = jest.fn();
    let negativeAction = jest.fn();

    beforeEach(() => {
        positiveAction.mockReset();
        negativeAction.mockReset();
    });

    describe("create new item", () => {
        it(
            "creates a new item with default values",
            async () => {
                await assertItemValues(
                    {
                        oldPos: -1,
                        newPos: 1,
                        listId: listId,
                        item: new Item("", 1, "Item", false, false),
                    },
                    () => {}
                );
            },
            TIMEOUT_MS
        );

        it(
            "creates a new item with custom values",
            async () => {
                await assertItemValues(
                    {
                        oldPos: -1,
                        newPos: 0,
                        listId: listId,
                        item: new Item("My Item", 2, "Item", false, false),
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
        it(
            "updates item with same values",
            async () => {
                await assertItemValues(
                    {
                        oldPos: 0,
                        newPos: 0,
                        listId: listId,
                        item: item,
                    },
                    () => {}
                );
            },
            TIMEOUT_MS
        );

        it(
            "updates item with new values",
            async () => {
                await assertItemValues(
                    {
                        oldPos: 0,
                        newPos: 1,
                        listId: listId,
                        item: new Item("New Name", 4, "Item", false, false),
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
                    }
                );
            },
            TIMEOUT_MS
        );
    });

    describe("Quantity", () => {
        it("increments quantity", async () => {
            await renderComponent(
                itemModalFactory(positiveAction, negativeAction, -1)
            );

            let quantityValue = getTextElementValue(
                screen.getByTestId("ItemModal-quantity")
            );
            expect(quantityValue).toEqual("1");

            fireEvent.press(findByText("+"));

            quantityValue = getTextElementValue(
                screen.getByTestId("ItemModal-quantity")
            );
            expect(quantityValue).toEqual("2");
        });

        it("decrements quantity", async () => {
            await renderComponent(
                itemModalFactory(positiveAction, negativeAction, 0)
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
            itemModalFactory(positiveAction, negativeAction, 0)
        );

        fireEvent.press(screen.getByText("Cancel"));
        expect(negativeAction).toBeCalledTimes(1);
    });

    it("presses add button", async () => {
        await renderComponent(
            itemModalFactory(positiveAction, negativeAction, 0)
        );
        expect(positiveAction).toBeCalledTimes(0);

        fireEvent.changeText(
            screen.getByTestId("ItemModal-item-name"),
            "My Item"
        );

        fireEvent.press(screen.getByText("Add"));
    });

    it("displays error when name is not provided", async () => {
        await renderComponent(
            itemModalFactory(positiveAction, negativeAction, -1)
        );

        fireEvent.press(screen.getByText("Add"));
        expect(positiveAction).toBeCalledTimes(0);

        expect(screen.getByText("Name must be provided")).not.toBeNull();
    });
});

function itemModalFactory(
    positiveAction: (params: ItemCRUD) => void,
    negativeAction: () => void,
    itemIndex: number,
    topIndex: number = 0
): JSX.Element {
    const appData: AppData = {
        settings: defaultSettings,
        lists: [list],
        listsState: {
            isModalVisible: false,
            isDeleteAllModalVisible: false,
            currentIndex: -1,
        },
        itemsState: {
            isModalVisible: false,
            currentIndex: -1,
            isCopyModalVisible: false,
            isDeleteAllModalVisible: false,
            topIndex: topIndex,
        },
    };

    const appContextData: AppDataContext = {
        data: appData,
        dispatch: (action: AppAction) => {
            throw Error("dispatch method not implemented");
        },
    };

    return (
        <AppContext.Provider value={appContextData}>
            <ItemModal
                list={list}
                currentItemIndex={itemIndex}
                isVisible={true}
                title="Add a New Item"
                positiveActionText="Add"
                positiveAction={positiveAction}
                negativeActionText="Cancel"
                negativeAction={negativeAction}
            />
        </AppContext.Provider>
    );
}

async function assertItemValues(
    expectedParams: ItemCRUD,
    actions: () => void = () => {}
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

    await renderComponent(
        itemModalFactory(positiveAction, jest.fn(), expectedOldPos)
    );

    // Actions performed on the item modal (e.g., changing the name)
    await act(() => actions());

    // Adding the item
    await act(() => fireEvent.press(screen.getByTestId("custom-modal-Add")));
}
