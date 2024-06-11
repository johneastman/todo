import { screen } from "@testing-library/react-native";

import { Item, List } from "../data/data";
import ItemsPageCell from "../components/ItemCellView";
import { ListType, Settings } from "../types";
import { renderComponent } from "./testUtils";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import DraggableFlatList, {
    RenderItemParams,
} from "react-native-draggable-flatlist";
import { ReactNode } from "react";
import {
    AppContext,
    defaultAppData,
    defaultSettings,
} from "../contexts/app.context";
import { AppAction, AppData, appReducer } from "../data/reducers/app.reducer";

jest.mock("@react-native-async-storage/async-storage", () =>
    require("@react-native-async-storage/async-storage/jest/async-storage-mock")
);

/* Needed to mitigate this error:
 *     TypeError: Cannot set property setGestureState of [object Object] which has only a getter
 * https://github.com/computerjazz/react-native-draggable-flatlist/blob/main/tests/index.test.js
 */
jest.mock("react-native-reanimated", () =>
    require("react-native-reanimated/mock")
);

describe("<ItemCellView />", () => {
    const mockItem: Item = new Item("My Item", 1, false);

    describe("display item", () => {
        describe("developer mode", () => {
            const settingsContextValues: Settings = {
                isDeveloperModeEnabled: true,
                defaultListType: "List",
                defaultListPosition: "top",
            };

            it("shows item that is not complete", async () => {
                await renderComponent(
                    itemCellViewFactory(
                        mockItem,
                        "List",
                        jest.fn(),
                        settingsContextValues
                    )
                );

                expect(screen.queryByText("My Item")).not.toBeNull();
                expect(screen.queryByText("Index: 0")).not.toBeNull();
                expect(screen.queryByText("Is Complete: False")).not.toBeNull();
            });

            it("shows item that is complete", async () => {
                const mockCompleteItem: Item = new Item("My Item", 1, true);

                await renderComponent(
                    itemCellViewFactory(
                        mockCompleteItem,
                        "List",
                        jest.fn(),
                        settingsContextValues
                    )
                );

                expect(screen.queryByText("My Item")).not.toBeNull();
                expect(screen.queryByText("Index: 0")).not.toBeNull();
                expect(screen.queryByText("Is Complete: True")).not.toBeNull();
            });
        });

        describe("diffent item types", () => {
            it("displays shopping list", async () => {
                await renderComponent(
                    itemCellViewFactory(mockItem, "Shopping")
                );

                // Display item name
                expect(screen.queryByText("My Item")).not.toBeNull();

                // Display item quantity
                expect(screen.queryByText("Quantity: 1")).not.toBeNull();

                // Add Item button should not be visible
                expect(screen.queryByTestId("section-add-item")).toBeNull();
            });

            it("displays to-do list", async () => {
                await renderComponent(itemCellViewFactory(mockItem, "To-Do"));

                // Display item name
                expect(screen.queryByText("My Item")).not.toBeNull();

                // To-do lists don't display a quantity
                expect(screen.queryByText("Quantity: 1")).toBeNull();

                // Add Item button should not be visible
                expect(screen.queryByTestId("section-add-item")).toBeNull();
            });

            it("displays ordered to-do list", async () => {
                await renderComponent(
                    itemCellViewFactory(mockItem, "Ordered To-Do")
                );

                // Ordered to-do lists start with a number
                expect(screen.queryByText("1. My Item")).not.toBeNull();

                // To-do lists don't display a quantity
                expect(screen.queryByText("Quantity: 1")).toBeNull();

                // Add Item button should not be visible
                expect(screen.queryByTestId("section-add-item")).toBeNull();
            });
        });
    });

    describe("edit-item checkbox", () => {
        it("selects item", async () => {
            const updateItemBeingEdited = (
                index: number,
                isSelected: boolean
            ): void => {
                expect(index).toEqual(0);
                expect(isSelected).toEqual(true);
            };

            await renderComponent(
                itemCellViewFactory(mockItem, "List", updateItemBeingEdited)
            );
        });

        it("de-selects item", async () => {
            const updateItemBeingEdited = (
                index: number,
                isSelected: boolean
            ): void => {
                expect(index).toEqual(0);
                expect(isSelected).toEqual(false);
            };

            const mockSelectedItem = new Item("My Item", 1, false, true);

            await renderComponent(
                itemCellViewFactory(
                    mockSelectedItem,
                    "List",
                    updateItemBeingEdited
                )
            );
        });
    });
});

function itemCellViewFactory(
    item: Item,
    listType: ListType,
    updateItemBeingEdited: (
        index: number,
        isSelected: boolean
    ) => void = jest.fn(),
    settings?: Settings
): JSX.Element {
    const renderItem = (params: RenderItemParams<Item>): ReactNode => {
        return (
            <ItemsPageCell
                listIndex={0}
                list={new List("My List", listType, "bottom")}
                updateItems={updateItemBeingEdited}
                renderParams={params}
            />
        );
    };

    const items: Item[] = [item];

    const appData: AppData = {
        ...defaultAppData,
        settings: settings ?? defaultSettings,
    };

    const appContext = {
        data: appData,
        dispatch: (action: AppAction) => {
            appReducer(appData, action);
        },
    };

    return (
        <AppContext.Provider value={appContext}>
            <GestureHandlerRootView>
                <DraggableFlatList
                    data={items}
                    keyExtractor={(_, index) => `item-${index}`}
                    renderItem={(params) => renderItem(params)}
                />
            </GestureHandlerRootView>
        </AppContext.Provider>
    );
}
