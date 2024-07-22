import { screen, fireEvent, act } from "@testing-library/react-native";

import ListModal from "../../components/ListModal";
import {
    assertListEqual,
    populateListModal,
    renderComponent,
} from "../testUtils";
import {
    ListsContextData,
    ListParams,
    CollectionViewCellType,
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
import {
    defaultListsStateData,
    ListsStateContext,
    ListsStateContextData,
} from "../../contexts/listsState.context";
import {
    ListsState,
    ListsStateAction,
    listsStateReducer,
} from "../../data/reducers/listsState.reducer";

const mockList: List = new List("My List", "Ordered To-Do", "bottom");

describe("<ListModal />", () => {
    describe("creates a new list", () => {
        it("has add-list title", async () => {
            const dispatch = jest.fn();
            await renderComponent(listModalFactory(-1, dispatch));

            expect(screen.getByText("Add a New List")).not.toBeNull();
            expect(screen.getByText("Add to")).not.toBeNull();
        });

        it("displays error when name is not provided", async () => {
            const dispatch = jest.fn();
            await renderComponent(listModalFactory(-1, dispatch));

            fireEvent.press(screen.getByText("Add"));

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
                    list: new List("My List", "List", "bottom"),
                });
            };

            await renderComponent(listModalFactory(-1, dispatch));

            // Give the list a name
            await act(() =>
                fireEvent.changeText(
                    screen.getByPlaceholderText("Enter the name of your list"),
                    "My List"
                )
            );

            await act(() =>
                fireEvent.press(screen.getByTestId("custom-modal-Add"))
            );
        });

        it("creates new list with alternate action", async () => {
            const dispatch = (action: ListsAction) => {
                expect(action.type).toEqual("LISTS_ADD");

                const { addListParams } = action as AddList;

                assertNewListValues(addListParams, {
                    oldPos: 0,
                    newPos: 1,
                    list: new List("My List", "List", "bottom"),
                });
            };

            await renderComponent(listModalFactory(-1, dispatch));

            // Give the list a name
            await act(() =>
                fireEvent.changeText(
                    screen.getByPlaceholderText("Enter the name of your list"),
                    "My List"
                )
            );

            await act(() =>
                fireEvent.press(screen.getByTestId("custom-modal-Next"))
            );
        });

        it("creates list with default values using settings for list type", async () => {
            const dispatch = (action: ListsAction) => {
                expect(action.type).toEqual("LISTS_ADD");

                const { addListParams } = action as AddList;

                assertNewListValues(addListParams, {
                    oldPos: 0,
                    newPos: 0,
                    list: new List("My List", "Shopping", "bottom"),
                });
            };

            const settingsContextValue: Settings = {
                isDeveloperModeEnabled: false,
                defaultListType: "Shopping",
                defaultListPosition: "top",
            };

            await renderComponent(
                listModalFactory(-1, dispatch, settingsContextValue)
            );

            // Give the list a name
            await act(() =>
                fireEvent.changeText(
                    screen.getByPlaceholderText("Enter the name of your list"),
                    "My List"
                )
            );

            await act(() =>
                fireEvent.press(screen.getByTestId("custom-modal-Add"))
            );
        });

        it("creates new list with custom values", async () => {
            const dispatch = (action: ListsAction) => {
                expect(action.type).toEqual("LISTS_ADD");

                const { addListParams } = action as AddList;

                assertNewListValues(addListParams, {
                    oldPos: 0,
                    newPos: 0,
                    list: new List("My List", "To-Do", "top"),
                });
            };

            await renderComponent(listModalFactory(-1, dispatch));

            await populateListModal({
                name: "My List",
                position: TOP,
                type: "To-Do List",
                newItemDefaultPos: TOP,
            });

            await act(() =>
                fireEvent.press(screen.getByTestId("custom-modal-Add"))
            );
        });
    });

    describe("edits existing list", () => {
        describe("visible from", () => {
            it("is visible from the lists page", async () => {
                const dispatch = jest.fn();
                await renderComponent(listModalFactory(0, dispatch));

                // Alternate action should be visible
                expect(screen.getByTestId("custom-modal-Next")).not.toBeNull();

                // Expect the position radio buttons to be visible
                expect(
                    screen.getByTestId("list-modal-position")
                ).not.toBeNull();
            });

            it("is visible from the items page", async () => {
                const dispatch = jest.fn();
                await renderComponent(
                    listModalFactory(0, dispatch, defaultSettingsData, "Item")
                );

                // Alternate action should be visible
                expect(screen.queryByTestId("custom-modal-Next")).toBeNull();

                // Expect the position radio buttons to be visible
                expect(screen.queryByTestId("list-modal-position")).toBeNull();
            });
        });

        it("has update text", async () => {
            const dispatch = jest.fn();
            await renderComponent(listModalFactory(0, dispatch));
            expect(screen.getByText("Update List")).not.toBeNull();
            expect(screen.getByText("Move to")).not.toBeNull();
        });

        it("displays error when name is removed", async () => {
            const dispatch = jest.fn();
            await renderComponent(listModalFactory(0, dispatch));

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
                    list: new List("My List", "Ordered To-Do", "bottom"),
                });
            };

            await renderComponent(listModalFactory(0, dispatch));

            await act(() =>
                fireEvent.press(screen.getByTestId("custom-modal-Update"))
            );
        });

        it("updates item with alternate action not", async () => {
            const dispatch = (action: ListsAction) => {
                expect(action.type).toEqual("LISTS_UPDATE");

                const { updateListParams } = action as UpdateList;

                assertNewListValues(updateListParams, {
                    oldPos: 0,
                    newPos: 0,
                    list: new List("My List", "Ordered To-Do", "bottom"),
                });
            };

            await renderComponent(listModalFactory(0, dispatch));

            await act(() =>
                fireEvent.press(screen.getByTestId("custom-modal-Next"))
            );
        });

        it("changes list values", async () => {
            const dispatch = (action: ListsAction) => {
                expect(action.type).toEqual("LISTS_UPDATE");

                const { updateListParams } = action as UpdateList;

                assertNewListValues(updateListParams, {
                    oldPos: 0,
                    newPos: 0,
                    list: new List("My NEW List", "Shopping", "top"),
                });
            };

            await renderComponent(listModalFactory(0, dispatch));

            await populateListModal({
                name: "My NEW List",
                position: TOP,
                type: "Shopping List",
                newItemDefaultPos: TOP,
            });

            await act(() =>
                fireEvent.press(screen.getByTestId("custom-modal-Update"))
            );
        });
    });
});

function listModalFactory(
    currentIndex: number,
    dispatch: (action: ListsAction) => void,
    settings?: Settings,
    visibleFrom?: CollectionViewCellType
): JSX.Element {
    const listsData: ListsData = {
        ...defaultListsData,
        lists: [mockList],
    };

    const listsStateData: ListsState = {
        ...defaultListsStateData,
        currentIndex: currentIndex,
        isModalVisible: true,
        visibleFrom: visibleFrom ?? "List",
    };

    const listsContextData: ListsContextData = {
        data: listsData,
        listsDispatch: dispatch,
    };

    const listsStateContext: ListsStateContextData = {
        listsState: listsStateData,
        listsStateDispatch: (action: ListsStateAction) => {
            listsStateReducer(defaultListsStateData, action);
        },
    };

    const settingsContext: SettingsContextData = {
        settings: settings ?? defaultSettingsData,
        settingsDispatch: (action: SettingsAction) => {
            settingsReducer(defaultSettingsData, action);
        },
    };

    return (
        <ListsStateContext.Provider value={listsStateContext}>
            <SettingsContext.Provider value={settingsContext}>
                <ListsContext.Provider value={listsContextData}>
                    <ListModal />
                </ListsContext.Provider>
            </SettingsContext.Provider>
        </ListsStateContext.Provider>
    );
}

function assertNewListValues(actual: ListParams, expected: ListParams): void {
    const { list: actualList, newPos: actualNewPos } = actual;
    const { list: expectedList, newPos: expectedNewPos } = expected;

    expect(actualNewPos).toEqual(expectedNewPos);
    assertListEqual(actualList, expectedList);
}
