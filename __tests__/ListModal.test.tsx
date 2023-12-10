import { screen, fireEvent, act } from "@testing-library/react-native";
import uuid from "react-native-uuid";

import ListModal from "../components/ListModal";
import { populateListModal, renderComponent } from "./testUtils";
import { ListTypeValue, Position, Settings, SettingsContext } from "../types";
import { List, TOP } from "../data/data";

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
            const positiveAction = (
                oldPos: number,
                newPos: Position,
                list: List
            ): void => {
                assertNewListValues(
                    list,
                    "",
                    "List",
                    "bottom",
                    newPos,
                    "bottom"
                );
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
            const positiveAction = (
                oldPos: number,
                newPos: Position,
                list: List
            ): void => {
                assertNewListValues(
                    list,
                    "",
                    "Shopping",
                    "bottom",
                    newPos,
                    "bottom"
                );
            };

            const settingsContextValue: Settings = {
                isDeveloperModeEnabled: false,
                defaultListType: "Shopping",
                updateSettings: () => {},
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
            const positiveAction = (
                oldPos: number,
                newPos: Position,
                list: List
            ): void => {
                assertNewListValues(
                    list,
                    "My List",
                    "To-Do",
                    "top",
                    newPos,
                    "top"
                );
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
            const positiveAction = (
                oldPos: number,
                newPos: Position,
                list: List
            ): void => {
                assertNewListValues(
                    list,
                    "My List",
                    "Ordered To-Do",
                    "bottom",
                    newPos,
                    "current"
                );
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
            const positiveAction = (
                oldPos: number,
                newPos: Position,
                list: List
            ): void => {
                assertNewListValues(
                    list,
                    "My NEW List",
                    "Shopping",
                    "top",
                    newPos,
                    "top"
                );
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
});

function listModalFactory(
    list: List | undefined,
    positiveAction: (oldPos: number, newPos: Position, list: List) => void,
    negativeAction: () => void,
    altAction: () => {},
    settingsContextValue?: Settings
): JSX.Element {
    const settings: Settings = settingsContextValue ?? {
        isDeveloperModeEnabled: false,
        defaultListType: "List",
        updateSettings: () => {},
    };

    return (
        <SettingsContext.Provider value={settings}>
            <ListModal
                list={list}
                isVisible={true}
                positiveAction={positiveAction}
                negativeAction={negativeAction}
                currentListIndex={list === undefined ? -1 : 0}
                altAction={altAction}
            />
        </SettingsContext.Provider>
    );
}

function assertNewListValues(
    actualList: List,
    expectedName: string,
    expectedListType: ListTypeValue,
    expectedDefaultNewItemPosition: Position,
    actualNewPosition: Position,
    expectedNewPosition: Position
): void {
    expect(actualList.id).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    );
    expect(actualList.name).toEqual(expectedName);
    expect(actualList.listType).toEqual(expectedListType);
    expect(actualList.defaultNewItemPosition).toEqual(
        expectedDefaultNewItemPosition
    );

    expect(actualNewPosition).toEqual(expectedNewPosition);
}
