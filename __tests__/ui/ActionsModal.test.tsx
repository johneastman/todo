import { fireEvent, render, screen, act } from "@testing-library/react-native";
import ActionsModal from "../../components/ActionsModal";
import { CellAction, CellSelect } from "../../types";

describe("<ActionsModal />", () => {
    const setVisible = jest.fn();
    const selectAll = jest.fn();
    const selectNone = jest.fn();
    const deleteAction = jest.fn();
    const completeAction = jest.fn();
    const incompleteAction = jest.fn();

    const cellSelectActions: Map<CellSelect, () => void> = new Map([
        ["All", selectAll],
        ["None", selectNone],
    ]);

    const cellActions: Map<CellAction, () => void> = new Map([
        ["Delete", deleteAction],
        ["Complete", completeAction],
        ["Incomplete", incompleteAction],
    ]);

    beforeEach(() => {
        render(
            <ActionsModal
                isVisible={true}
                cellsType="List"
                cellSelectActions={cellSelectActions}
                cellsActions={cellActions}
                setVisible={setVisible}
            />
        );
    });

    describe("Errors", () => {
        it("displays an error when no cells are selected", async () => {
            await act(() => fireEvent.press(screen.getByText("Run")));

            expect(
                screen.getByText("Select the cells on which to perform actions")
            ).not.toBeNull();
        });

        it("displays an error when no actions are selected", async () => {
            await act(() => fireEvent.press(screen.getByText("All")));

            await act(() => fireEvent.press(screen.getByText("Add")));

            await act(() => fireEvent.press(screen.getByText("Run")));

            expect(
                screen.getByText(
                    "Select an action to perform on the selected cells"
                )
            ).not.toBeNull();
        });
    });

    describe("cell actions", () => {
        beforeEach(async () => {
            await act(() => fireEvent.press(screen.getByText("All")));
        });

        it("adds an action", async () => {
            await act(() => fireEvent.press(screen.getByText("Add")));

            expect(screen.getByTestId("delete-action-0")).not.toBeNull();
            expect(screen.getByText("Select action")).not.toBeNull();
        });

        it("deletes an action", async () => {
            const actions: CellAction[] = ["Complete", "Incomplete", "Delete"];

            // Add a new action field for each action
            for (let index = 0; index < actions.length; index++) {
                const action: CellAction = actions[index];
                await addAction(index, action);
            }

            // Delete an action
            await act(() =>
                fireEvent.press(screen.getByTestId("delete-action-1"))
            );

            // Run the actions
            await act(() => fireEvent.press(screen.getByText("Run")));

            // Verify the action was deleted by ensuring it's associated method
            // was not called when all the actions were run.
            expect(selectAll).toBeCalled();
            expect(selectNone).not.toBeCalled();

            expect(deleteAction).toBeCalled();
            expect(completeAction).toBeCalled();
            expect(incompleteAction).not.toBeCalled();
        });

        it("disable 'add' button when last action is a terminating actions", async () => {
            // Add an action
            await addAction(0, "Delete");

            // Add another action after delete.
            await act(() => fireEvent.press(screen.getByText("Add")));

            // Another action should not have been added
            expect(screen.queryByTestId("action-dropdown-1")).toBeNull();
        });
    });

    it("Cancels actions", async () => {
        await act(() => fireEvent.press(screen.getByText("Cancel")));
        expect(setVisible).toBeCalled();
    });
});

async function addAction(index: number, action: CellAction) {
    // Press "add action" button
    await act(() => fireEvent.press(screen.getByText("Add")));

    // Select the new action
    const testId: string = `action-dropdown-${index}-${action}`;
    await act(() => fireEvent.press(screen.getByTestId(testId)));
}
