import { fireEvent, render, screen, act } from "@testing-library/react-native";
import ActionsModal from "../../components/ActionsModal";

describe("<ActionsModal />", () => {
    const setVisible = jest.fn();

    it("displays an error when no cells are selected", async () => {
        const cellSelectActions: Map<string, () => void> = new Map([
            ["All", () => {}],
            ["None", () => {}],
        ]);

        render(
            <ActionsModal
                isVisible={true}
                cellsType="List"
                cellSelectActions={cellSelectActions}
                setVisible={setVisible}
            />
        );

        await act(() => fireEvent.press(screen.getByText("Run")));

        expect(
            screen.getByText("Select the cells to perform actions on")
        ).not.toBeNull();
    });

    describe("cell actions", () => {
        beforeEach(async () => {
            const cellSelectActions: Map<string, () => void> = new Map([
                ["All", () => {}],
                ["None", () => {}],
            ]);

            render(
                <ActionsModal
                    isVisible={true}
                    cellsType="List"
                    cellSelectActions={cellSelectActions}
                    setVisible={setVisible}
                />
            );

            await act(() => fireEvent.press(screen.getByText("All")));
        });

        it("adds an action", async () => {
            await act(() => fireEvent.press(screen.getByText("Add")));

            expect(screen.getByTestId("delete-action-0")).not.toBeNull();
            expect(screen.getByText("Select action")).not.toBeNull();
        });

        // TODO: finish test. There's a bug where actions are not running.
        it.skip("deletes an action", async () => {
            // Add new actions
            const actions: string[] = ["Delete", "Lock", "Complete"];
            actions.forEach(async (action, index) => {
                // Add a new action
                await act(() => fireEvent.press(screen.getByText("Add")));

                // Select the action
                const actionView = screen.getByTestId(
                    `action-dropdown-${index}-${action}`
                );
                await act(() => fireEvent.press(actionView));
            });

            // Delete the second action
            await act(() =>
                fireEvent.press(screen.getByTestId("delete-action-1"))
            );

            // TODO: verify the action was deleted.
        });
    });
});
