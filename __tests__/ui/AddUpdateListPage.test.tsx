import { screen, fireEvent, act } from "@testing-library/react-native";

import {
    assertListEqual,
    listDefault,
    populateAddUpdateListPage,
    renderComponent,
} from "../testUtils";
import {
    ListsContextData,
    ListParams,
    CollectionViewCellType,
    AppStackNavigatorParamList,
} from "../../types";
import { List, TOP } from "../../data/data";
import { ListsContext, defaultListsData } from "../../contexts/lists.context";
import {
    AddList,
    ListsAction,
    ListsData,
    UpdateList,
} from "../../data/reducers/lists.reducer";
import {
    defaultSettingsData,
    SettingsContext,
    SettingsContextData,
} from "../../contexts/settings.context";
import {
    Settings,
    SettingsAction,
    settingsReducer,
} from "../../data/reducers/settings.reducer";
import { NavigationContainer } from "@react-navigation/native";
import AddUpdateListPage from "../../components/pages/AddUpdateListPage";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const mockList: List = listDefault("My List", "Ordered To-Do", "bottom");

describe("Add Update List Page", () => {
    describe("creates a new list", () => {
        it("has add-list title", async () => {
            const dispatch = jest.fn();
            await renderComponent(addUpdateListPageFactory(-1, dispatch));

            // Tests don't allow for selecting navigation title, so I can only select the text above the radio buttons.
            expect(screen.getByText("Add to")).not.toBeNull();
        });

        it("displays error when name is not provided", async () => {
            const dispatch = jest.fn();
            await renderComponent(addUpdateListPageFactory(-1, dispatch));

            fireEvent.press(screen.getByTestId("add-update-list-create"));

            expect(screen.getByText("Name must be provided")).not.toBeNull();
            expect(dispatch).toBeCalledTimes(0);
        });

        it("creates new list with default values", async () => {
            const dispatch = (action: ListsAction) => {
                expect(action.type).toEqual("LISTS_ADD");

                const { addListParams } = action as AddList;

                assertNewListValues(addListParams, {
                    oldPos: 0,
                    newPos: 1,
                    list: listDefault("My List", "List", "bottom"),
                });
            };

            await renderComponent(addUpdateListPageFactory(-1, dispatch));

            // Give the list a name
            await act(() =>
                fireEvent.changeText(
                    screen.getByPlaceholderText("Enter the name of your list"),
                    "My List"
                )
            );

            await act(() =>
                fireEvent.press(screen.getByTestId("add-update-list-create"))
            );
        });

        it("creates new list with alternate action", async () => {
            const dispatch = (action: ListsAction) => {
                expect(action.type).toEqual("LISTS_ADD");

                const { addListParams } = action as AddList;

                assertNewListValues(addListParams, {
                    oldPos: 0,
                    newPos: 1,
                    list: listDefault("My List", "List", "bottom"),
                });
            };

            await renderComponent(addUpdateListPageFactory(-1, dispatch));

            // Give the list a name
            await act(() =>
                fireEvent.changeText(
                    screen.getByPlaceholderText("Enter the name of your list"),
                    "My List"
                )
            );

            await act(() =>
                fireEvent.press(screen.getByTestId("add-update-list-next"))
            );
        });

        it("creates list with default values using settings for list type", async () => {
            const dispatch = (action: ListsAction) => {
                expect(action.type).toEqual("LISTS_ADD");

                const { addListParams } = action as AddList;

                assertNewListValues(addListParams, {
                    oldPos: 0,
                    newPos: 0,
                    list: listDefault("My List", "Shopping", "bottom"),
                });
            };

            const settingsContextValue: Settings = {
                isDeveloperModeEnabled: false,
                defaultListType: "Shopping",
                defaultListPosition: "top",
            };

            await renderComponent(
                addUpdateListPageFactory(-1, dispatch, settingsContextValue)
            );

            // Give the list a name
            await act(() =>
                fireEvent.changeText(
                    screen.getByPlaceholderText("Enter the name of your list"),
                    "My List"
                )
            );

            await act(() =>
                fireEvent.press(screen.getByTestId("add-update-list-create"))
            );
        });

        it("creates new list with custom values", async () => {
            const dispatch = (action: ListsAction) => {
                expect(action.type).toEqual("LISTS_ADD");

                const { addListParams } = action as AddList;

                assertNewListValues(addListParams, {
                    oldPos: 0,
                    newPos: 0,
                    list: listDefault("My List", "To-Do", "top"),
                });
            };

            await renderComponent(addUpdateListPageFactory(-1, dispatch));

            await populateAddUpdateListPage({
                name: "My List",
                position: TOP,
                type: "To-Do List",
                newItemDefaultPos: TOP,
            });

            await act(() =>
                fireEvent.press(screen.getByTestId("add-update-list-create"))
            );
        });
    });

    describe("edits existing list", () => {
        describe("visible from", () => {
            it("is visible from the lists page", async () => {
                const dispatch = jest.fn();
                await renderComponent(addUpdateListPageFactory(0, dispatch));

                // Alternate action should be visible
                expect(
                    screen.getByTestId("add-update-list-next")
                ).not.toBeNull();

                // Expect the position radio buttons to be visible
                expect(
                    screen.getByTestId("list-modal-position")
                ).not.toBeNull();
            });

            it("is visible from the items page", async () => {
                const dispatch = jest.fn();
                await renderComponent(
                    addUpdateListPageFactory(
                        0,
                        dispatch,
                        defaultSettingsData,
                        "Item"
                    )
                );

                // Alternate action should be visible
                expect(screen.queryByTestId("custom-modal-Next")).toBeNull();

                // Expect the position radio buttons to be visible
                expect(screen.queryByTestId("list-modal-position")).toBeNull();
            });
        });

        it("has update text", async () => {
            const dispatch = jest.fn();
            await renderComponent(addUpdateListPageFactory(0, dispatch));

            // Tests don't allow for selecting navigation title, so I can only select the text above the radio buttons.
            expect(screen.getByText("Move to")).not.toBeNull();
        });

        it("displays error when name is removed", async () => {
            const dispatch = jest.fn();
            await renderComponent(addUpdateListPageFactory(0, dispatch));

            await act(() =>
                fireEvent.changeText(
                    screen.getByPlaceholderText("Enter the name of your list"),
                    ""
                )
            );

            fireEvent.press(screen.getByText("Update"));

            expect(screen.getByText("Name must be provided")).not.toBeNull();
            expect(dispatch).toBeCalledTimes(0);
        });

        it("does not change list values", async () => {
            const dispatch = (action: ListsAction) => {
                expect(action.type).toEqual("LISTS_UPDATE");

                const { updateListParams } = action as UpdateList;

                assertNewListValues(updateListParams, {
                    oldPos: 0,
                    newPos: 0,
                    list: listDefault("My List", "Ordered To-Do", "bottom"),
                });
            };

            await renderComponent(addUpdateListPageFactory(0, dispatch));

            await act(() =>
                fireEvent.press(screen.getByTestId("add-update-list-update"))
            );
        });

        it("updates item with alternate action", async () => {
            const dispatch = (action: ListsAction) => {
                expect(action.type).toEqual("LISTS_UPDATE");

                const { updateListParams } = action as UpdateList;

                assertNewListValues(updateListParams, {
                    oldPos: 0,
                    newPos: 0,
                    list: listDefault("My List", "Ordered To-Do", "bottom"),
                });
            };

            await renderComponent(addUpdateListPageFactory(0, dispatch));

            await act(() =>
                fireEvent.press(screen.getByTestId("add-update-list-next"))
            );
        });

        it("changes list values", async () => {
            const dispatch = (action: ListsAction) => {
                expect(action.type).toEqual("LISTS_UPDATE");

                const { updateListParams } = action as UpdateList;

                assertNewListValues(updateListParams, {
                    oldPos: 0,
                    newPos: 0,
                    list: listDefault("My NEW List", "Shopping", "top"),
                });
            };

            await renderComponent(addUpdateListPageFactory(0, dispatch));

            await populateAddUpdateListPage({
                name: "My NEW List",
                position: TOP,
                type: "Shopping List",
                newItemDefaultPos: TOP,
            });

            await act(() =>
                fireEvent.press(screen.getByTestId("add-update-list-update"))
            );
        });
    });
});

function addUpdateListPageFactory(
    currentIndex: number,
    dispatch: (action: ListsAction) => void,
    settings?: Settings,
    visibleFrom?: CollectionViewCellType
): JSX.Element {
    const lists: List[] = [mockList];

    const listsData: ListsData = {
        ...defaultListsData,
        lists: lists,
    };

    const listsContextData: ListsContextData = {
        data: listsData,
        listsDispatch: dispatch,
    };
    const settingsContext: SettingsContextData = {
        settings: settings ?? defaultSettingsData,
        settingsDispatch: (action: SettingsAction) => {
            settingsReducer(defaultSettingsData, action);
        },
    };

    const Stack = createNativeStackNavigator<AppStackNavigatorParamList>();

    return (
        <SettingsContext.Provider value={settingsContext}>
            <ListsContext.Provider value={listsContextData}>
                <NavigationContainer>
                    <Stack.Navigator>
                        <Stack.Screen
                            name="AddUpdateList"
                            component={AddUpdateListPage}
                            initialParams={{
                                listIndex: currentIndex,
                                currentList: lists[currentIndex],
                                visibleFrom: visibleFrom ?? "List",
                            }}
                        />
                    </Stack.Navigator>
                </NavigationContainer>
            </ListsContext.Provider>
        </SettingsContext.Provider>
    );
}

function assertNewListValues(actual: ListParams, expected: ListParams): void {
    const { list: actualList, newPos: actualNewPos } = actual;
    const { list: expectedList, newPos: expectedNewPos } = expected;

    expect(actualNewPos).toEqual(expectedNewPos);
    assertListEqual(actualList, expectedList);
}
