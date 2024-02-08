import { screen, fireEvent, act } from "@testing-library/react-native";

import ItemModal from "../components/ItemModal";
import { Item, List } from "../data/data";
import { assertItemEqual, renderComponent } from "./testUtils";
import { AppAction, AppData, AppDataContext } from "../types";
import { AppContext, defaultSettings } from "../contexts/app.context";
import {
    AddItem,
    UpdateItem,
    UpdateModalVisible,
} from "../data/reducers/app.reducer";

jest.mock("@react-native-async-storage/async-storage", () =>
    require("@react-native-async-storage/async-storage/jest/async-storage-mock")
);

const listId: string = "id";
const item: Item = new Item("Old Name", 3, false, false);
const items: Item[] = [item];
const list: List = new List(listId, "My List", "Shopping", "bottom", items);

describe("<ItemModal />", () => {
    describe("Adds item", () => {
        it("name is not provided", async () => {
            const dispatch = jest.fn();
            await renderComponent(itemModalFactory(dispatch));

            // Add the item
            await act(() =>
                fireEvent.press(screen.getByTestId("custom-modal-Add"))
            );

            expect(dispatch).toBeCalledTimes(0);
            expect(screen.getByText("Name must be provided")).not.toBeNull();
        });

        it("with default values", async () => {
            const dispatch = (action: AppAction) => {
                expect(action.type).toEqual("ITEMS_ADD");

                const {
                    addItemParams: { listId, oldPos, newPos, item },
                    isAltAction,
                } = action as AddItem;

                expect(isAltAction).toEqual(false);

                expect(listId).toEqual(list.id);
                expect(oldPos).toEqual(-1);
                expect(newPos).toEqual(1);

                assertItemEqual(item, new Item("My Item", 1, false, false));
            };

            await renderComponent(itemModalFactory(dispatch));

            fireEvent.changeText(
                screen.getByTestId("ItemModal-item-name"),
                "My Item"
            );

            // Add the item
            await act(() =>
                fireEvent.press(screen.getByTestId("custom-modal-Add"))
            );
        });

        it("with custom values", async () => {
            const dispatch = (action: AppAction) => {
                expect(action.type).toEqual("ITEMS_ADD");

                const {
                    addItemParams: { listId, oldPos, newPos, item },
                    isAltAction,
                } = action as AddItem;

                expect(isAltAction).toEqual(false);

                expect(listId).toEqual(list.id);
                expect(oldPos).toEqual(-1);
                expect(newPos).toEqual(0);

                assertItemEqual(item, new Item("My Item", 2, false, false));
            };

            await renderComponent(itemModalFactory(dispatch));

            await act(() =>
                fireEvent.changeText(
                    screen.getByTestId("ItemModal-item-name"),
                    "My Item"
                )
            );

            // Change Quantity
            await act(() =>
                fireEvent.press(screen.getByTestId("increase-quantity"))
            );

            // Change position
            await act(() =>
                fireEvent.press(screen.getByTestId("Add to-Top-testID"))
            );

            // Add the item
            await act(() =>
                fireEvent.press(screen.getByTestId("custom-modal-Add"))
            );
        });

        it("with alternate action", async () => {
            const dispatch = (action: AppAction) => {
                expect(action.type).toEqual("ITEMS_ADD");

                const {
                    addItemParams: { listId, oldPos, newPos, item },
                    isAltAction,
                } = action as AddItem;

                expect(isAltAction).toEqual(true);

                expect(listId).toEqual(list.id);
                expect(oldPos).toEqual(-1);
                expect(newPos).toEqual(1);

                assertItemEqual(item, new Item("My Item", 1, false, false));
            };

            await renderComponent(itemModalFactory(dispatch));

            fireEvent.changeText(
                screen.getByTestId("ItemModal-item-name"),
                "My Item"
            );

            // Add the item
            await act(() =>
                fireEvent.press(screen.getByTestId("custom-modal-Next"))
            );
        });
    });

    describe("Updates item", () => {
        it("by removing the name", async () => {
            const dispatch = jest.fn();
            await renderComponent(itemModalFactory(dispatch, 1));

            // Clear name
            await act(() =>
                fireEvent.changeText(
                    screen.getByTestId("ItemModal-item-name"),
                    ""
                )
            );

            // Update the item
            await act(() =>
                fireEvent.press(screen.getByTestId("custom-modal-Update"))
            );

            expect(dispatch).toBeCalledTimes(0);
            expect(screen.getByText("Name must be provided")).not.toBeNull();
        });

        it("with default values", async () => {
            const dispatch = (action: AppAction) => {
                expect(action.type).toEqual("ITEMS_UPDATE");

                const {
                    updateItemParams: { listId, oldPos, newPos, item },
                    isAltAction,
                } = action as UpdateItem;

                expect(isAltAction).toEqual(false);

                expect(listId).toEqual(list.id);
                expect(oldPos).toEqual(0);
                expect(newPos).toEqual(0);

                assertItemEqual(item, new Item("Old Name", 3, false, false));
            };

            await renderComponent(itemModalFactory(dispatch, 0));

            // Adding the item
            await act(() =>
                fireEvent.press(screen.getByTestId("custom-modal-Update"))
            );
        });

        it("with custom values", async () => {
            const dispatch = (action: AppAction) => {
                expect(action.type).toEqual("ITEMS_UPDATE");

                const {
                    updateItemParams: { listId, oldPos, newPos, item },
                    isAltAction,
                } = action as UpdateItem;

                expect(isAltAction).toEqual(false);

                expect(listId).toEqual(list.id);
                expect(oldPos).toEqual(0);
                expect(newPos).toEqual(1);

                assertItemEqual(item, new Item("New Name", 2, false, false));
            };

            await renderComponent(itemModalFactory(dispatch, 0));

            fireEvent.changeText(
                screen.getByTestId("ItemModal-item-name"),
                "New Name"
            );

            // Change Quantity
            await act(() =>
                fireEvent.press(screen.getByTestId("decrease-quantity"))
            );

            // Change position
            await act(() =>
                fireEvent.press(screen.getByTestId("Move to-Bottom-testID"))
            );

            // Adding the item
            await act(() =>
                fireEvent.press(screen.getByTestId("custom-modal-Update"))
            );
        });

        it("with alternate action", async () => {
            const dispatch = (action: AppAction) => {
                expect(action.type).toEqual("ITEMS_UPDATE");

                const {
                    updateItemParams: { listId, oldPos, newPos, item },
                    isAltAction,
                } = action as UpdateItem;

                expect(isAltAction).toEqual(true);

                expect(listId).toEqual(list.id);
                expect(oldPos).toEqual(0);
                expect(newPos).toEqual(0);

                assertItemEqual(item, new Item("Old Name", 3, false, false));
            };

            await renderComponent(itemModalFactory(dispatch, 0));

            // Adding the item
            await act(() =>
                fireEvent.press(screen.getByTestId("custom-modal-Next"))
            );
        });
    });

    it("closes the modal", async () => {
        const dispatch = (action: AppAction) => {
            expect(action.type).toEqual("CELL_MODAL_VISIBLE");

            const { isVisible, collectionType, index } =
                action as UpdateModalVisible;

            expect(isVisible).toEqual(false);
            expect(collectionType).toEqual("Item");
            expect(index).toEqual(-1);
        };
        await renderComponent(itemModalFactory(dispatch, 0));

        await act(() => fireEvent.press(screen.getByText("Cancel")));
    });
});

function itemModalFactory(
    dispatch: (action: AppAction) => void,
    currentItemIndex?: number
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
            isModalVisible: true,
            currentIndex: currentItemIndex ?? -1,
            isCopyModalVisible: false,
            isDeleteAllModalVisible: false,
        },
    };

    const appContextData: AppDataContext = {
        data: appData,
        dispatch: dispatch,
    };

    return (
        <AppContext.Provider value={appContextData}>
            <ItemModal list={list} />
        </AppContext.Provider>
    );
}
