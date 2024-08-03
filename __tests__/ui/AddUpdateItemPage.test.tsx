/**
 * Some of these tests log the following warning:
 *   The action 'NAVIGATE' with payload {"name":"Items","params":{"listIndex":0}} was not handled by any navigator.
 *
 *   Do you have a screen named 'Items'?
 *
 *   If you're trying to navigate to a screen in a nested navigator, see https://reactnavigation.org/docs/nesting-navigators#navigating-to-a-screen-in-a-nested-navigator.
 *
 *   This is a development-only warning and won't be shown in production.
 *
 * However, the tests pass and trying to add ItemsPage fails the tests with this error:
 *   TypeError: Cannot set property setGestureState of [object Object] which has only a getter
 *
 *     12 | import DeveloperModeListCellView from "./DeveloperModeListCellView";
 *     13 | import { useContext } from "react";
 *   > 14 | import {
 *        | ^
 *     15 |     RenderItemParams,
 *     16 |     ScaleDecorator,
 *     17 | } from "react-native-draggable-flatlist";
 */
import { screen, fireEvent, act } from "@testing-library/react-native";

import { Item, List } from "../../data/data";
import {
    assertItemEqual,
    pressSwitch,
    renderComponent,
    setText,
} from "../testUtils";
import { AppStackNavigatorParamList, ListsContextData } from "../../types";
import { ListsContext, defaultListsData } from "../../contexts/lists.context";
import {
    AddItem,
    ListsAction,
    ListsData,
    UpdateItem,
} from "../../data/reducers/lists.reducer";
import {
    defaultItemsStateData,
    ItemsStateContext,
    ItemsStateContextData,
} from "../../contexts/itemsState.context";
import {
    ItemsState,
    ItemsStateAction,
} from "../../data/reducers/itemsState.reducer";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AddUpdateItemPage from "../../components/pages/AddUpdateItemPage";

jest.mock("@react-native-async-storage/async-storage", () =>
    require("@react-native-async-storage/async-storage/jest/async-storage-mock")
);

const defaultItem: Item = new Item("Old Name", "", 3, false, false, false);
const itemisLocked: Item = new Item("Old Name", "", 3, false, false, true);
const items: Item[] = [defaultItem, itemisLocked];
const list: List = new List("My List", "Shopping", "bottom", items);

describe("<AddUpdateItemPage />", () => {
    const itemsStateDispatch = jest.fn();

    describe("Adds item", () => {
        it("shows an error when the name is not provided", async () => {
            const dispatch = jest.fn();

            await renderComponent(
                itemModalFactory(dispatch, itemsStateDispatch)
            );

            // Add the item
            await act(() =>
                fireEvent.press(screen.getByTestId("add-update-item-create"))
            );

            expect(dispatch).toBeCalledTimes(0);
            expect(screen.getByText("Name must be provided")).not.toBeNull();
        });

        it("with default values (no changes to the UI other than adding a name)", async () => {
            const dispatch = (action: ListsAction) => {
                expect(action.type).toEqual("ITEMS_ADD");

                const {
                    addItemParams: { listIndex, oldPos, newPos, item },
                } = action as AddItem;

                expect(listIndex).toEqual(0);
                expect(oldPos).toEqual(-1);
                expect(newPos).toEqual(2);

                assertItemEqual(
                    item,
                    new Item("My Item", "", 1, false, false, false)
                );
            };

            await renderComponent(
                itemModalFactory(dispatch, itemsStateDispatch)
            );

            await setText(screen.getByTestId("ItemModal-item-name"), "My Item");

            // Add the item
            await act(() =>
                fireEvent.press(screen.getByTestId("add-update-item-create"))
            );
        });

        it("with custom values (making changes to the UI)", async () => {
            const dispatch = (action: ListsAction) => {
                expect(action.type).toEqual("ITEMS_ADD");

                const {
                    addItemParams: { listIndex, oldPos, newPos, item },
                } = action as AddItem;

                expect(listIndex).toEqual(0);
                expect(oldPos).toEqual(-1);
                expect(newPos).toEqual(0);

                assertItemEqual(
                    item,
                    new Item(
                        "My Item",
                        "notes about my item",
                        2,
                        false,
                        false,
                        true
                    )
                );
            };

            await renderComponent(
                itemModalFactory(dispatch, itemsStateDispatch)
            );

            // Change name
            await setText(screen.getByTestId("ItemModal-item-name"), "My Item");

            // Add notes
            await setText(
                screen.getByTestId("add-update-item-notes"),
                "notes about my item"
            );

            // Change Quantity
            await act(() =>
                fireEvent.press(screen.getByTestId("increase-quantity"))
            );

            // Change position
            await act(() => fireEvent.press(screen.getByTestId("Add to-Top")));

            // Lock
            await pressSwitch(screen.getByTestId("ignore-select-all"), true);

            // Add the item
            await act(() =>
                fireEvent.press(screen.getByTestId("add-update-item-create"))
            );
        });

        it("with alternate action", async () => {
            const dispatch = (action: ListsAction) => {
                expect(action.type).toEqual("ITEMS_ADD");

                const {
                    addItemParams: { listIndex, oldPos, newPos, item },
                } = action as AddItem;

                expect(listIndex).toEqual(0);
                expect(oldPos).toEqual(-1);
                expect(newPos).toEqual(2);

                assertItemEqual(item, new Item("My Item", "", 1, false, false));
            };

            await renderComponent(
                itemModalFactory(dispatch, itemsStateDispatch)
            );

            await setText(screen.getByTestId("ItemModal-item-name"), "My Item");

            // Add the item
            await act(() =>
                fireEvent.press(screen.getByTestId("add-update-item-next"))
            );
        });
    });

    describe("Updates item", () => {
        it("shows an error when the name is deleted", async () => {
            const dispatch = jest.fn();
            await renderComponent(
                itemModalFactory(dispatch, itemsStateDispatch, 0)
            );

            // Clear name
            await setText(screen.getByTestId("ItemModal-item-name"), "");

            // Update the item
            await act(() =>
                fireEvent.press(screen.getByTestId("add-update-item-update"))
            );

            expect(dispatch).toBeCalledTimes(0);
            expect(screen.getByText("Name must be provided")).not.toBeNull();
        });

        it("with default values (no changes to the UI)", async () => {
            const dispatch = (action: ListsAction) => {
                expect(action.type).toEqual("ITEMS_UPDATE");

                const {
                    updateItemParams: { listIndex, oldPos, newPos, item },
                } = action as UpdateItem;

                expect(listIndex).toEqual(0);
                expect(oldPos).toEqual(0);
                expect(newPos).toEqual(0);

                assertItemEqual(
                    item,
                    new Item("Old Name", "", 3, false, false)
                );
            };

            await renderComponent(
                itemModalFactory(dispatch, itemsStateDispatch, 0)
            );

            // Adding the item
            await act(() =>
                fireEvent.press(screen.getByTestId("add-update-item-update"))
            );
        });

        it("with custom values (making changes to the UI)", async () => {
            const dispatch = (action: ListsAction) => {
                expect(action.type).toEqual("ITEMS_UPDATE");

                const {
                    updateItemParams: { listIndex, oldPos, newPos, item },
                } = action as UpdateItem;

                expect(listIndex).toEqual(0);
                expect(oldPos).toEqual(1);
                expect(newPos).toEqual(0);

                assertItemEqual(
                    item,
                    new Item("New Name", "updated note", 2, false, false)
                );
            };

            await renderComponent(
                itemModalFactory(dispatch, itemsStateDispatch, 1)
            );

            // Change name
            await setText(
                screen.getByTestId("ItemModal-item-name"),
                "New Name"
            );

            // Add notes
            await setText(
                screen.getByTestId("add-update-item-notes"),
                "updated note"
            );

            // Change Quantity
            await act(() =>
                fireEvent.press(screen.getByTestId("decrease-quantity"))
            );

            // Change position
            await act(() => fireEvent.press(screen.getByTestId("Move to-Top")));

            // Lock
            await pressSwitch(screen.getByTestId("ignore-select-all"), false);

            // Adding the item
            await act(() =>
                fireEvent.press(screen.getByTestId("add-update-item-update"))
            );
        });

        it("with alternate action", async () => {
            const dispatch = (action: ListsAction) => {
                expect(action.type).toEqual("ITEMS_UPDATE");

                const {
                    updateItemParams: { listIndex, oldPos, newPos, item },
                } = action as UpdateItem;

                expect(listIndex).toEqual(0);
                expect(oldPos).toEqual(0);
                expect(newPos).toEqual(0);

                assertItemEqual(
                    item,
                    new Item("Old Name", "", 3, false, false)
                );
            };

            await renderComponent(itemModalFactory(dispatch, jest.fn(), 0));

            // Adding the item
            await act(() =>
                fireEvent.press(screen.getByTestId("add-update-item-next"))
            );
        });
    });
});

function itemModalFactory(
    dispatch: (action: ListsAction) => void,
    itemsStateDispatch: (action: ItemsStateAction) => void,
    currentItemIndex?: number
): JSX.Element {
    const currentListIndex: number = 0;
    const itemIndex: number = currentItemIndex ?? -1;

    const listsData: ListsData = {
        ...defaultListsData,
        lists: [list],
    };

    const listsContextData: ListsContextData = {
        data: listsData,
        listsDispatch: dispatch,
    };

    const itemsStateData: ItemsState = {
        ...defaultItemsStateData,
        currentIndex: itemIndex,
    };

    const itemsStateContextData: ItemsStateContextData = {
        itemsState: itemsStateData,
        itemsStateDispatch: itemsStateDispatch,
    };

    const Stack = createNativeStackNavigator<AppStackNavigatorParamList>();

    return (
        <ItemsStateContext.Provider value={itemsStateContextData}>
            <ListsContext.Provider value={listsContextData}>
                <NavigationContainer>
                    <Stack.Navigator>
                        <Stack.Screen
                            name="AddUpdateItem"
                            component={AddUpdateItemPage}
                            initialParams={{
                                listIndex: currentListIndex,
                                itemIndex: itemIndex,
                                currentItem: items[itemIndex],
                            }}
                        />
                    </Stack.Navigator>
                </NavigationContainer>
            </ListsContext.Provider>
        </ItemsStateContext.Provider>
    );
}
