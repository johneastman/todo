import { fireEvent, render, screen, act } from "@testing-library/react-native";
import ActionsModal from "../../components/ActionsModal";
import { CellAction, SelectionValue } from "../../types";

describe("<ActionsModal />", () => {
    const setVisible = jest.fn();

    const selectAll = jest.fn();
    const selectSome = jest.fn();
    const selectNone = jest.fn();

    const deleteAction = jest.fn();
    const completeAction = jest.fn();
    const incompleteAction = jest.fn();

    const cellSelectActions: SelectionValue<() => void>[] = [
        { label: "All", value: selectAll },
        { label: "Some", value: selectSome },
        { label: "None", value: selectNone },
    ];

    const cellActions: SelectionValue<() => void>[] = [
        { label: "Delete", value: deleteAction },
        { label: "Complete", value: completeAction },
        { label: "Incomplete", value: incompleteAction },
    ];

    beforeEach(() => {
        render(
            <ActionsModal
                isVisible={true}
                cellsType="List"
                cellSelectActions={cellSelectActions}
                cellsActions={cellActions}
                setVisible={setVisible}
                actionCells={[
                    { label: "A", value: 0 },
                    { label: "B", value: 1 },
                    { label: "C", value: 2 },
                ]}
            />
        );
    });

    it("selects some", async () => {
        // Select "Some"
        await act(() => fireEvent.press(screen.getByText("Some")));

        // Set the first/required action
        const testId: string = `action-dropdown-0-Complete`;
        await act(() => fireEvent.press(screen.getByTestId(testId)));

        // Run the actions
        await act(() => fireEvent.press(screen.getByText("Run")));

        expect(selectNone).not.toBeCalled();
        expect(selectSome).toBeCalled();
        expect(selectAll).not.toBeCalled();

        expect(deleteAction).not.toBeCalled();
        expect(completeAction).toBeCalled();
        expect(incompleteAction).not.toBeCalled();
    });

    it("Cancels actions", async () => {
        await act(() => fireEvent.press(screen.getByText("Cancel")));
        expect(setVisible).toBeCalled();
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

            // Select "Run" without setting the required action.
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

            expect(screen.getByTestId("delete-action-1")).not.toBeNull();
        });

        it("deletes an action", async () => {
            // const actions: CellAction[] = ["Complete", "Incomplete", "Delete"];

            // Set the first/required action
            const testId: string = `action-dropdown-0-Complete`;
            await act(() => fireEvent.press(screen.getByTestId(testId)));

            // Add another action
            await addAction(1, "Delete");

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

            expect(deleteAction).not.toBeCalled();
            expect(completeAction).toBeCalled();
            expect(incompleteAction).not.toBeCalled();
        });

        it("disable 'add' button when last action is a terminating actions", async () => {
            // Add an action
            await addAction(1, "Delete");

            // Add another action after delete.
            await act(() => fireEvent.press(screen.getByText("Add")));

            // Another action should not have been added
            expect(screen.queryByTestId("action-dropdown-2")).toBeNull();
        });
    });
});

async function addAction(index: number, action: CellAction) {
    // Press "add action" button
    await act(() => fireEvent.press(screen.getByText("Add")));

    // Select the new action
    const testId: string = `action-dropdown-${index}-${action}`;
    await act(() => fireEvent.press(screen.getByTestId(testId)));
}
