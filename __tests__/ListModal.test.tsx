import { screen, fireEvent, act } from "@testing-library/react-native";

import ListModal from "../components/ListModal";
import {
    assertListEqual,
    populateListModal,
    renderComponent,
} from "./testUtils";
import { AppDataContext, ListParams } from "../types";
import { List, TOP } from "../data/data";
import { AppContext, defaultAppData } from "../contexts/app.context";
import {
    AddList,
    AppAction,
    AppData,
    UpdateList,
    UpdateModalVisible,
} from "../data/reducers/app.reducer";
import {
    defaultSettingsData,
    SettingsContext,
    SettingsContextData,
} from "../contexts/settings.context";
import {
    Settings,
    SettingsAction,
    settingsReducer,
} from "../data/reducers/settings.reducer";

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
            const dispatch = (action: AppAction) => {
                expect(action.type).toEqual("LISTS_ADD");

                const { addListParams, isAltAction } = action as AddList;

                expect(isAltAction).toEqual(false);
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
            const dispatch = (action: AppAction) => {
                expect(action.type).toEqual("LISTS_ADD");

                const { addListParams, isAltAction } = action as AddList;

                expect(isAltAction).toEqual(true);
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
            const dispatch = (action: AppAction) => {
                expect(action.type).toEqual("LISTS_ADD");

                const { addListParams, isAltAction } = action as AddList;

                expect(isAltAction).toEqual(false);

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
            const dispatch = (action: AppAction) => {
                expect(action.type).toEqual("LISTS_ADD");

                const { addListParams, isAltAction } = action as AddList;

                expect(isAltAction).toEqual(false);

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
        it("has update text", async () => {
            const dispatch = (action: AppAction) => {};
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
            const dispatch = (action: AppAction) => {
                expect(action.type).toEqual("LISTS_UPDATE");

                const { updateListParams, isAltAction } = action as UpdateList;

                expect(isAltAction).toEqual(false);

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
            const dispatch = (action: AppAction) => {
                expect(action.type).toEqual("LISTS_UPDATE");

                const { updateListParams, isAltAction } = action as UpdateList;

                expect(isAltAction).toEqual(true);

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
            const dispatch = (action: AppAction) => {
                expect(action.type).toEqual("LISTS_UPDATE");

                const { updateListParams, isAltAction } = action as UpdateList;

                expect(isAltAction).toEqual(false);

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

    it("dismisses modal (presses cancel button)", async () => {
        const dispatch = (action: AppAction) => {
            expect(action.type).toEqual("CELL_MODAL_VISIBLE");

            const { collectionType, isVisible, index } =
                action as UpdateModalVisible;

            expect(collectionType).toEqual("List");
            expect(isVisible).toEqual(false);
            expect(index).toEqual(-1);
        };
        await renderComponent(listModalFactory(-1, dispatch));

        fireEvent.press(screen.getByText("Cancel"));
    });
});

function listModalFactory(
    currentIndex: number,
    dispatch: (action: AppAction) => void,
    settings?: Settings
): JSX.Element {
    const appData: AppData = {
        ...defaultAppData,
        lists: [mockList],
        listsState: {
            ...defaultAppData.listsState,
            currentIndex: currentIndex,
            isModalVisible: true,
        },
    };

    const appContext: AppDataContext = {
        data: appData,
        dispatch: dispatch,
    };

    const settingsContext: SettingsContextData = {
        settings: settings ?? defaultSettingsData,
        settingsDispatch: (action: SettingsAction) => {
            settingsReducer(defaultSettingsData, action);
        },
    };

    return (
        <SettingsContext.Provider value={settingsContext}>
            <AppContext.Provider value={appContext}>
                <ListModal />
            </AppContext.Provider>
        </SettingsContext.Provider>
    );
}

function assertNewListValues(actual: ListParams, expected: ListParams): void {
    const { list: actualList, newPos: actualNewPos } = actual;
    const { list: expectedList, newPos: expectedNewPos } = expected;

    expect(actualNewPos).toEqual(expectedNewPos);
    assertListEqual(actualList, expectedList);
}
