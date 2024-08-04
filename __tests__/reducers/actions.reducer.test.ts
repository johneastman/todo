import {
    ActionsState,
    actionsStateReducer,
    AddAction,
    defaultActionsState,
    DeleteAction,
    UpdateAction,
    UpdateCellsToSelect,
    UpdateSelectedIndex,
} from "../../data/reducers/actions.reducer";
import { Replace, UpdateError } from "../../data/reducers/common";
import { ActionMetadata } from "../../types";
import { assertActionsStateEqual } from "../testUtils";

describe("actions reducer", () => {
    const prevState: ActionsState = defaultActionsState();

    const selectAll: ActionMetadata = {
        label: "All",
        method: jest.fn(),
        isTerminating: false,
    };
    const complete: ActionMetadata = {
        label: "Complete",
        method: jest.fn(),
        isTerminating: false,
    };
    const incomplete: ActionMetadata = {
        label: "Incomplete",
        method: jest.fn(),
        isTerminating: false,
    };
    const lock: ActionMetadata = {
        label: "Lock",
        method: jest.fn(),
        isTerminating: false,
    };
    const unlock: ActionMetadata = {
        label: "Unlock",
        method: jest.fn(),
        isTerminating: false,
    };

    it("updates all", () => {
        const actualNewState: ActionsState = actionsStateReducer(
            prevState,
            new Replace({
                cellsToSelect: selectAll,
                actions: [complete, incomplete],
                selectedIndices: [5, 10, 15],
            })
        );

        const expectedNewState: ActionsState = {
            cellsToSelect: selectAll,
            actions: [complete, incomplete],
            selectedIndices: [5, 10, 15],
        };

        assertActionsStateEqual(actualNewState, expectedNewState);
    });

    it("updates cells to select", () => {
        const actualNewState: ActionsState = actionsStateReducer(
            prevState,
            new UpdateCellsToSelect(selectAll)
        );

        const expectedNewState: ActionsState = {
            ...prevState,
            cellsToSelect: selectAll,
        };

        assertActionsStateEqual(actualNewState, expectedNewState);
    });

    it("adds action", () => {
        const actualNewState: ActionsState = actionsStateReducer(
            prevState,
            new AddAction(lock)
        );

        const expectedNewState: ActionsState = {
            ...prevState,
            cellsToSelect: undefined,
            actions: [undefined, lock],
        };

        assertActionsStateEqual(actualNewState, expectedNewState);
    });

    it("updates action", () => {
        const oldState: ActionsState = {
            ...prevState,
            actions: [lock, unlock],
        };
        const actualNewState: ActionsState = actionsStateReducer(
            oldState,
            new UpdateAction(1, complete)
        );

        const expectedNewState: ActionsState = {
            ...prevState,
            cellsToSelect: undefined,
            actions: [lock, complete],
        };

        assertActionsStateEqual(actualNewState, expectedNewState);
    });

    it("deletes action", () => {
        const oldState: ActionsState = {
            ...prevState,
            actions: [lock, unlock, complete],
        };
        const actualNewState: ActionsState = actionsStateReducer(
            oldState,
            new DeleteAction(1)
        );

        const expectedNewState: ActionsState = {
            ...prevState,
            cellsToSelect: undefined,
            actions: [lock, complete],
        };

        assertActionsStateEqual(actualNewState, expectedNewState);
    });

    it("updates error", () => {
        const actualNewState: ActionsState = actionsStateReducer(
            prevState,
            new UpdateError("Error")
        );

        const expectedNewState: ActionsState = {
            ...prevState,
            cellsToSelect: undefined,
            error: "Error",
        };

        assertActionsStateEqual(actualNewState, expectedNewState);
    });

    describe("updates indices", () => {
        it("adds an index", () => {
            const actualNewState: ActionsState = actionsStateReducer(
                prevState,
                new UpdateSelectedIndex(true, 5)
            );

            const expectedNewState: ActionsState = {
                ...prevState,
                selectedIndices: [5],
            };

            assertActionsStateEqual(actualNewState, expectedNewState);
        });

        it("removes an index", () => {
            const oldState: ActionsState = {
                ...prevState,
                selectedIndices: [5, 10, 15],
            };

            const actualNewState: ActionsState = actionsStateReducer(
                prevState,
                new UpdateSelectedIndex(false, 10)
            );

            const expectedNewState: ActionsState = {
                ...prevState,
                selectedIndices: [5, 15],
            };

            assertActionsStateEqual(actualNewState, expectedNewState);
        });
    });
});
