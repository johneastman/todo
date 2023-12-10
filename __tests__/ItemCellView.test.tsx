import { screen } from "@testing-library/react-native";

import { Item, List } from "../data/data";
import ItemsPageCell from "../components/ItemCellView";
import {
    ListCell,
    ListCellContext,
    ListTypeValue,
    Settings,
    SettingsContext,
    defaultSettings,
} from "../types";
import { renderComponent } from "./testUtils";

jest.mock("@react-native-async-storage/async-storage", () =>
    require("@react-native-async-storage/async-storage/jest/async-storage-mock")
);

describe("<ItemCellView />", () => {
    const mockItem: Item = new Item("My Item", 1, false);

    describe("display item", () => {
        describe("developer mode", () => {
            const settingsContextValues: Settings = {
                isDeveloperModeEnabled: true,
                defaultListType: "List",
                updateSettings: () => {},
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
                expect(screen.queryByText("List ID: 0")).not.toBeNull();
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
                expect(screen.queryByText("List ID: 0")).not.toBeNull();
                expect(screen.queryByText("Index: 0")).not.toBeNull();
                expect(screen.queryByText("Is Complete: True")).not.toBeNull();
            });
        });

        describe("diffent item types", () => {
            it("displays shopping list", async () => {
                await renderComponent(
                    itemCellViewFactory(mockItem, "Shopping")
                );

                expect(screen.queryByText("My Item")).not.toBeNull();

                expect(screen.queryByText("Quantity: 1")).not.toBeNull();
            });

            it("displays to-do list", async () => {
                await renderComponent(itemCellViewFactory(mockItem, "To-Do"));

                expect(screen.queryByText("My Item")).not.toBeNull();

                // To-do lists don't display a quantity
                expect(screen.queryByText("Quantity: 1")).toBeNull();
            });

            it("displays ordered to-do list", async () => {
                await renderComponent(
                    itemCellViewFactory(mockItem, "Ordered To-Do")
                );

                // Ordered to-do lists start with a number
                expect(screen.queryByText("1. My Item")).not.toBeNull();

                // To-do lists don't display a quantity
                expect(screen.queryByText("Quantity: 1")).toBeNull();
            });
        });
    });

    describe("edit-item checkbox", () => {
        it("selects item", async () => {
            const updateItemBeingEdited = (
                index: number,
                isSelected: boolean
            ): void => {
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
    listType: ListTypeValue,
    updateItemBeingEdited: (
        index: number,
        isSelected: boolean
    ) => void = jest.fn(),
    settingsContextValues?: Settings
): JSX.Element {
    const listCellContext: ListCell<Item> = {
        index: 0,
        item: item,
    };

    return (
        <SettingsContext.Provider
            value={settingsContextValues ?? defaultSettings}
        >
            <ListCellContext.Provider value={listCellContext}>
                <ItemsPageCell
                    list={new List("0", "My List", listType, "bottom")}
                    updateItems={updateItemBeingEdited}
                />
            </ListCellContext.Provider>
        </SettingsContext.Provider>
    );
}
