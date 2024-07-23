import {
    ActionsState,
    actionsStateReducer,
    AddAction,
    defaultActionsState,
    DeleteAction,
    UpdateAction,
    UpdateAll,
    UpdateCellsToSelect,
    UpdateError,
} from "../../data/reducers/actions.reducer";
import { assertActionsStateEqual } from "../testUtils";

describe("actions reducer", () => {
    const prevState: ActionsState = defaultActionsState();

    const selectAll = jest.fn();
    const selectNone = jest.fn();
    const complete = jest.fn();
    const incomplete = jest.fn();
    const lock = jest.fn();
    const unlock = jest.fn();

    it("updates all", () => {
        const actualNewState: ActionsState = actionsStateReducer(
            prevState,
            new UpdateAll({
                cellsToSelect: selectAll,
                actions: [complete, incomplete],
            })
        );

        const expectedNewState: ActionsState = {
            cellsToSelect: selectAll,
            actions: [complete, incomplete],
        };

        assertActionsStateEqual(actualNewState, expectedNewState);
    });

    it("updates cells to select", () => {
        const actualNewState: ActionsState = actionsStateReducer(
            prevState,
            new UpdateCellsToSelect(selectNone)
        );

        const expectedNewState: ActionsState = {
            cellsToSelect: selectNone,
            actions: [],
        };

        assertActionsStateEqual(actualNewState, expectedNewState);
    });

    it("adds action", () => {
        const actualNewState: ActionsState = actionsStateReducer(
            prevState,
            new AddAction(lock)
        );

        const expectedNewState: ActionsState = {
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
            cellsToSelect: undefined,
            actions: [],
            error: "Error",
        };

        assertActionsStateEqual(actualNewState, expectedNewState);
    });
});
