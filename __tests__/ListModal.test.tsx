import { screen, fireEvent, act } from "@testing-library/react-native";
import uuid from "react-native-uuid";

import ListModal from "../components/ListModal";
import {
    assertListEqual,
    populateListModal,
    renderComponent,
    when,
} from "./testUtils";
import {
    AppAction,
    AppData,
    AppDataContext,
    ListCRUD,
    Settings,
} from "../types";
import { List, TOP } from "../data/data";
import { AppContext, defaultSettings } from "../contexts/app.context";
import {
    AddList,
    UpdateList,
    UpdateModalVisible,
} from "../data/reducers/app.reducer";

const mockList: List = new List(
    uuid.v4().toString(),
    "My List",
    "Ordered To-Do",
    "bottom"
);

describe("<ListModal />", () => {
    describe("creates a new list", () => {
        when("has add-list title", async () => {
            const dispatch = jest.fn();
            await renderComponent(listModalFactory(-1, dispatch));

            expect(screen.getByText("Add a New List")).not.toBeNull();
            expect(screen.getByText("Add to")).not.toBeNull();
        });

        when("displays error when name is not provided", async () => {
            const dispatch = jest.fn();
            await renderComponent(listModalFactory(-1, dispatch));

            fireEvent.press(screen.getByText("Add"));

            expect(screen.getByText("Name must be provided")).not.toBeNull();
            expect(dispatch).toBeCalledTimes(0);
        });

        when("creates new list with default values", async () => {
            const dispatch = (action: AppAction) => {
                expect(action.type).toEqual("LISTS_ADD");

                const { addListParams, isAltAction } = action as AddList;

                expect(isAltAction).toEqual(false);
                assertNewListValues(addListParams, {
                    oldPos: 0,
                    newPos: "bottom",
                    list: new List(
                        addListParams.list.id,
                        "My List",
                        "List",
                        "bottom"
                    ),
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

        when(
            "creates list with default values using settings for list type",
            async () => {
                const dispatch = (action: AppAction) => {
                    expect(action.type).toEqual("LISTS_ADD");

                    const { addListParams, isAltAction } = action as AddList;

                    expect(isAltAction).toEqual(false);

                    assertNewListValues(addListParams, {
                        oldPos: 0,
                        newPos: "top",
                        list: new List(
                            addListParams.list.id,
                            "My List",
                            "Shopping",
                            "bottom"
                        ),
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
                        screen.getByPlaceholderText(
                            "Enter the name of your list"
                        ),
                        "My List"
                    )
                );

                await act(() =>
                    fireEvent.press(screen.getByTestId("custom-modal-Add"))
                );
            }
        );

        when("creates new list with custom values", async () => {
            const dispatch = (action: AppAction) => {
                expect(action.type).toEqual("LISTS_ADD");

                const { addListParams, isAltAction } = action as AddList;

                expect(isAltAction).toEqual(false);

                assertNewListValues(addListParams, {
                    oldPos: 0,
                    newPos: "top",
                    list: new List(
                        addListParams.list.id,
                        "My List",
                        "To-Do",
                        "top"
                    ),
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
        when("has update text", async () => {
            const dispatch = (action: AppAction) => {};
            await renderComponent(listModalFactory(0, dispatch));
            expect(screen.getByText("Update List")).not.toBeNull();
            expect(screen.getByText("Move to")).not.toBeNull();
        });

        when("displays error when name is removed", async () => {
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

        when("does not change list values", async () => {
            const dispatch = (action: AppAction) => {
                expect(action.type).toEqual("LISTS_UPDATE");

                const { updateListParams, isAltAction } = action as UpdateList;

                expect(isAltAction).toEqual(false);

                assertNewListValues(updateListParams, {
                    oldPos: 0,
                    newPos: "current",
                    list: new List(
                        mockList.id,
                        "My List",
                        "Ordered To-Do",
                        "bottom"
                    ),
                });
            };

            await renderComponent(listModalFactory(0, dispatch));

            await act(() =>
                fireEvent.press(screen.getByTestId("custom-modal-Update"))
            );
        });

        when("changes list values", async () => {
            const dispatch = (action: AppAction) => {
                expect(action.type).toEqual("LISTS_UPDATE");

                const { updateListParams, isAltAction } = action as UpdateList;

                expect(isAltAction).toEqual(false);

                assertNewListValues(updateListParams, {
                    oldPos: 0,
                    newPos: "top",
                    list: new List(
                        mockList.id,
                        "My NEW List",
                        "Shopping",
                        "top"
                    ),
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

    when("dismisses modal (presses cancel button)", async () => {
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
        settings: settings ?? defaultSettings,
        lists: [mockList],
        listsState: {
            currentIndex: currentIndex,
            isModalVisible: true,
            isDeleteAllModalVisible: false,
        },
        itemsState: {
            currentIndex: currentIndex,
            isModalVisible: false,
            isCopyModalVisible: false,
            isDeleteAllModalVisible: false,
            topIndex: 0,
        },
    };

    const appContext: AppDataContext = {
        data: appData,
        dispatch: dispatch,
    };

    return (
        <AppContext.Provider value={appContext}>
            <ListModal />
        </AppContext.Provider>
    );
}

function assertNewListValues(actual: ListCRUD, expected: ListCRUD): void {
    const { list: actualList, newPos: actualNewPos } = actual;
    const { list: expectedList, newPos: expectedNewPos } = expected;

    expect(actualNewPos).toEqual(expectedNewPos);
    assertListEqual(actualList, expectedList);
}
