import { screen, fireEvent, act } from "@testing-library/react-native";

import ItemModal from "../components/ItemModal";
import { Item, List } from "../data/data";
import {
    assertItemEqual,
    pressSwitch,
    renderComponent,
    setText,
} from "./testUtils";
import { AppDataContext } from "../types";
import { AppContext, defaultAppData } from "../contexts/app.context";
import {
    AddItem,
    AppAction,
    AppData,
    UpdateItem,
} from "../data/reducers/app.reducer";
import {
    defaultItemsStateData,
    ItemsStateContext,
    ItemsStateContextData,
} from "../contexts/itemsState.context";
import {
    AddUpdateModalVisible,
    ItemsState,
    ItemsStateAction,
} from "../data/reducers/itemsState.reducer";

jest.mock("@react-native-async-storage/async-storage", () =>
    require("@react-native-async-storage/async-storage/jest/async-storage-mock")
);

const defaultItem: Item = new Item("Old Name", 3, false, false, false);
const itemIgnoreSelectAll: Item = new Item("Old Name", 3, false, false, true);
const items: Item[] = [defaultItem, itemIgnoreSelectAll];
const list: List = new List("My List", "Shopping", "bottom", items);

describe("<ItemModal />", () => {
    const itemsStateDispatch = jest.fn();

    describe("Adds item", () => {
        it("name is not provided", async () => {
            const dispatch = jest.fn();

            await renderComponent(
                itemModalFactory(dispatch, itemsStateDispatch)
            );

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
                    addItemParams: { listIndex, oldPos, newPos, item },
                    isAltAction,
                } = action as AddItem;

                expect(isAltAction).toEqual(false);

                expect(listIndex).toEqual(0);
                expect(oldPos).toEqual(-1);
                expect(newPos).toEqual(2);

                assertItemEqual(
                    item,
                    new Item("My Item", 1, false, false, false)
                );
            };

            await renderComponent(
                itemModalFactory(dispatch, itemsStateDispatch)
            );

            await setText(screen.getByTestId("ItemModal-item-name"), "My Item");

            // Add the item
            await act(() =>
                fireEvent.press(screen.getByTestId("custom-modal-Add"))
            );
        });

        it("with custom values", async () => {
            const dispatch = (action: AppAction) => {
                expect(action.type).toEqual("ITEMS_ADD");

                const {
                    addItemParams: { listIndex, oldPos, newPos, item },
                    isAltAction,
                } = action as AddItem;

                expect(isAltAction).toEqual(false);

                expect(listIndex).toEqual(0);
                expect(oldPos).toEqual(-1);
                expect(newPos).toEqual(0);

                assertItemEqual(
                    item,
                    new Item("My Item", 2, false, false, true)
                );
            };

            await renderComponent(
                itemModalFactory(dispatch, itemsStateDispatch)
            );

            await setText(screen.getByTestId("ItemModal-item-name"), "My Item");

            // Change Quantity
            await act(() =>
                fireEvent.press(screen.getByTestId("increase-quantity"))
            );

            // Change position
            await act(() => fireEvent.press(screen.getByTestId("Add to-Top")));

            // Ignore select all
            await pressSwitch(screen.getByTestId("ignore-select-all"), true);

            // Add the item
            await act(() =>
                fireEvent.press(screen.getByTestId("custom-modal-Add"))
            );
        });

        it("with alternate action", async () => {
            const dispatch = (action: AppAction) => {
                expect(action.type).toEqual("ITEMS_ADD");

                const {
                    addItemParams: { listIndex, oldPos, newPos, item },
                    isAltAction,
                } = action as AddItem;

                expect(isAltAction).toEqual(true);

                expect(listIndex).toEqual(0);
                expect(oldPos).toEqual(-1);
                expect(newPos).toEqual(2);

                assertItemEqual(item, new Item("My Item", 1, false, false));
            };

            await renderComponent(
                itemModalFactory(dispatch, itemsStateDispatch)
            );

            await setText(screen.getByTestId("ItemModal-item-name"), "My Item");

            // Add the item
            await act(() =>
                fireEvent.press(screen.getByTestId("custom-modal-Next"))
            );
        });
    });

    describe("Updates item", () => {
        it("by removing the name", async () => {
            const dispatch = jest.fn();
            await renderComponent(
                itemModalFactory(dispatch, itemsStateDispatch, 0)
            );

            // Clear name
            await setText(screen.getByTestId("ItemModal-item-name"), "");

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
                    updateItemParams: { listIndex, oldPos, newPos, item },
                    isAltAction,
                } = action as UpdateItem;

                expect(isAltAction).toEqual(false);

                expect(listIndex).toEqual(0);
                expect(oldPos).toEqual(0);
                expect(newPos).toEqual(0);

                assertItemEqual(item, new Item("Old Name", 3, false, false));
            };

            await renderComponent(
                itemModalFactory(dispatch, itemsStateDispatch, 0)
            );

            // Adding the item
            await act(() =>
                fireEvent.press(screen.getByTestId("custom-modal-Update"))
            );
        });

        it("with custom values", async () => {
            const dispatch = (action: AppAction) => {
                expect(action.type).toEqual("ITEMS_UPDATE");

                const {
                    updateItemParams: { listIndex, oldPos, newPos, item },
                    isAltAction,
                } = action as UpdateItem;

                expect(isAltAction).toEqual(false);

                expect(listIndex).toEqual(0);
                expect(oldPos).toEqual(1);
                expect(newPos).toEqual(0);

                assertItemEqual(item, new Item("New Name", 2, false, false));
            };

            await renderComponent(
                itemModalFactory(dispatch, itemsStateDispatch, 1)
            );

            await setText(
                screen.getByTestId("ItemModal-item-name"),
                "New Name"
            );

            // Change Quantity
            await act(() =>
                fireEvent.press(screen.getByTestId("decrease-quantity"))
            );

            // Change position
            await act(() => fireEvent.press(screen.getByTestId("Move to-Top")));

            // Ignore select all
            await pressSwitch(screen.getByTestId("ignore-select-all"), false);

            // Adding the item
            await act(() =>
                fireEvent.press(screen.getByTestId("custom-modal-Update"))
            );
        });

        it("with alternate action", async () => {
            const dispatch = (action: AppAction) => {
                expect(action.type).toEqual("ITEMS_UPDATE");

                const {
                    updateItemParams: { listIndex, oldPos, newPos, item },
                    isAltAction,
                } = action as UpdateItem;

                expect(isAltAction).toEqual(true);

                expect(listIndex).toEqual(0);
                expect(oldPos).toEqual(0);
                expect(newPos).toEqual(0);

                assertItemEqual(item, new Item("Old Name", 3, false, false));
            };

            await renderComponent(itemModalFactory(dispatch, jest.fn(), 0));

            // Adding the item
            await act(() =>
                fireEvent.press(screen.getByTestId("custom-modal-Next"))
            );
        });
    });

    it("closes the modal", async () => {
        const itemsStateDispatch = (action: ItemsStateAction) => {
            expect(action.type).toEqual("ADD_UPDATE_MODAL_VISIBLE");

            const { isVisible } = action as AddUpdateModalVisible;

            expect(isVisible).toEqual(false);
        };
        await renderComponent(
            itemModalFactory(jest.fn(), itemsStateDispatch, 0)
        );

        await act(() => fireEvent.press(screen.getByText("Cancel")));
    });
});

function itemModalFactory(
    dispatch: (action: AppAction) => void,
    itemsStateDispatch: (action: ItemsStateAction) => void,
    currentItemIndex?: number
): JSX.Element {
    const appData: AppData = {
        ...defaultAppData,
        lists: [list],
    };

    const appContextData: AppDataContext = {
        data: appData,
        dispatch: dispatch,
    };

    const itemsStateData: ItemsState = {
        ...defaultItemsStateData,
        isModalVisible: true,
        currentIndex: currentItemIndex ?? -1,
    };

    const itemsStateContextData: ItemsStateContextData = {
        itemsState: itemsStateData,
        itemsStateDispatch: itemsStateDispatch,
    };

    return (
        <ItemsStateContext.Provider value={itemsStateContextData}>
            <AppContext.Provider value={appContextData}>
                <ItemModal listIndex={0} list={list} />
            </AppContext.Provider>
        </ItemsStateContext.Provider>
    );
}
