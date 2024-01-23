import { screen, fireEvent, act } from "@testing-library/react-native";
import uuid from "react-native-uuid";

import ListModal from "../components/ListModal";
import { populateListModal, renderComponent } from "./testUtils";
import {
    AppAction,
    AppData,
    AppDataContext,
    ListCRUD,
    Settings,
} from "../types";
import { List, TOP } from "../data/data";
import { appReducer } from "../data/reducers/app.reducer";
import { AppContext, defaultSettings } from "../contexts/app.context";

jest.mock("../data/utils", () => {
    return {
        getItems: jest.fn(),
        saveItems: jest.fn(),
    };
});

describe("<ListModal />", () => {
    const positiveAction = jest.fn();
    const negativeAction = jest.fn();
    const altAction = jest.fn();

    let defaultComponent: JSX.Element = listModalFactory(
        undefined,
        positiveAction,
        negativeAction,
        altAction
    );

    describe("creates a new list", () => {
        it("has add-list title", async () => {
            await renderComponent(defaultComponent);

            expect(screen.getByText("Add a New List")).not.toBeNull();
            expect(screen.getByText("Add to")).not.toBeNull();
        });

        it("creates new list with default values", async () => {
            const positiveAction = (params: ListCRUD): void => {
                assertNewListValues(params, {
                    oldPos: 0,
                    newPos: "bottom",
                    list: new List(params.list.id, "", "List", "bottom"),
                });
            };

            await renderComponent(
                listModalFactory(
                    undefined,
                    positiveAction,
                    negativeAction,
                    altAction
                )
            );

            await act(() =>
                fireEvent.press(screen.getByTestId("custom-modal-Add"))
            );
        });

        it("creates list with default values using settings for list type", async () => {
            const positiveAction = (params: ListCRUD): void => {
                assertNewListValues(params, {
                    oldPos: 0,
                    newPos: "top",
                    list: new List(params.list.id, "", "Shopping", "bottom"),
                });
            };

            const settingsContextValue: Settings = {
                isDeveloperModeEnabled: false,
                defaultListType: "Shopping",
                defaultListPosition: "top",
            };

            await renderComponent(
                listModalFactory(
                    undefined,
                    positiveAction,
                    negativeAction,
                    altAction,
                    settingsContextValue
                )
            );

            await act(() =>
                fireEvent.press(screen.getByTestId("custom-modal-Add"))
            );
        });

        it("creates new list with custom values", async () => {
            const positiveAction = (params: ListCRUD): void => {
                assertNewListValues(params, {
                    oldPos: 0,
                    newPos: "top",
                    list: new List(params.list.id, "My List", "To-Do", "top"),
                });
            };

            await renderComponent(
                listModalFactory(
                    undefined,
                    positiveAction,
                    negativeAction,
                    altAction
                )
            );

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
        const mockID: string = uuid.v4().toString();
        const mockList: List = new List(
            mockID,
            "My List",
            "Ordered To-Do",
            "bottom"
        );

        it("has update text", async () => {
            await renderComponent(
                listModalFactory(
                    mockList,
                    positiveAction,
                    negativeAction,
                    altAction
                )
            );
            expect(screen.getByText("Update List")).not.toBeNull();
            expect(screen.getByText("Move to")).not.toBeNull();
        });

        it("does not change list values", async () => {
            const positiveAction = (params: ListCRUD): void => {
                assertNewListValues(params, {
                    oldPos: 0,
                    newPos: "current",
                    list: new List(
                        params.list.id,
                        "My List",
                        "Ordered To-Do",
                        "bottom"
                    ),
                });
            };

            await renderComponent(
                listModalFactory(
                    mockList,
                    positiveAction,
                    negativeAction,
                    altAction
                )
            );

            await act(() =>
                fireEvent.press(screen.getByTestId("custom-modal-Update"))
            );
        });

        it("changes list values", async () => {
            const positiveAction = (params: ListCRUD): void => {
                assertNewListValues(params, {
                    oldPos: 0,
                    newPos: "top",
                    list: new List(
                        params.list.id,
                        "My NEW List",
                        "Shopping",
                        "top"
                    ),
                });
            };

            await renderComponent(
                listModalFactory(
                    mockList,
                    positiveAction,
                    negativeAction,
                    altAction
                )
            );

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
        await renderComponent(defaultComponent);

        fireEvent.press(screen.getByText("Cancel"));
        expect(negativeAction).toBeCalledTimes(1);
    });

    it("displays error when name is not provided", async () => {
        await renderComponent(defaultComponent);

        fireEvent.press(screen.getByText("Add"));

        expect(screen.getByText("Name must be provided")).not.toBeNull();
    });
});

function listModalFactory(
    list: List | undefined,
    positiveAction: (params: ListCRUD) => void,
    negativeAction: () => void,
    altAction: () => {},
    settings?: Settings
): JSX.Element {
    const currentIndex: number = list === undefined ? -1 : 0;

    const appData: AppData = {
        settings: settings ?? defaultSettings,
        lists: [],
        listsState: {
            currentIndex: currentIndex,
            isModalVisible: false,
            isDeleteAllModalVisible: false,
        },
        itemsState: {
            currentIndex: currentIndex,
            isModalVisible: false,
            isCopyModalVisible: false,
            isDeleteAllModalVisible: false,
        },
    };

    const appContext: AppDataContext = {
        data: appData,
        dispatch: (action: AppAction) => {
            appReducer(appData, action);
        },
    };

    return (
        <AppContext.Provider value={appContext}>
            <ListModal
                list={list}
                isVisible={true}
                positiveAction={positiveAction}
                negativeAction={negativeAction}
                currentListIndex={currentIndex}
            />
        </AppContext.Provider>
    );
}

function assertNewListValues(actual: ListCRUD, expected: ListCRUD): void {
    const { list: actualList, newPos: actualNewPos } = actual;
    const { list: expectedList, newPos: expectedNewPos } = expected;

    expect(actualList.id).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    );
    expect(actualList.name).toEqual(expectedList.name);
    expect(actualList.listType).toEqual(expectedList.listType);
    expect(actualList.defaultNewItemPosition).toEqual(
        expectedList.defaultNewItemPosition
    );

    expect(actualNewPos).toEqual(expectedNewPos);
}
