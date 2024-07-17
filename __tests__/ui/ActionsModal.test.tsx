import { fireEvent, render, screen, act } from "@testing-library/react-native";
import ActionsModal from "../../components/ActionsModal";
import { CellAction, CellSelect } from "../../types";

describe("<ActionsModal />", () => {
    const setVisible = jest.fn();

    const cellSelectActions: Map<CellSelect, () => void> = new Map([
        ["All", () => {}],
        ["None", () => {}],
    ]);

    const cellActions: Map<CellAction, () => void> = new Map([
        ["Delete", () => {}],
    ]);

    it("displays an error when no cells are selected", async () => {
        render(
            <ActionsModal
                isVisible={true}
                cellsType="List"
                cellSelectActions={cellSelectActions}
                cellsActions={cellActions}
                setVisible={setVisible}
            />
        );

        await act(() => fireEvent.press(screen.getByText("Run")));

        expect(
            screen.getByText("Select the cells on which to perform actions")
        ).not.toBeNull();
    });

    it("displays an error when no actions are selected", async () => {
        render(
            <ActionsModal
                isVisible={true}
                cellsType="List"
                cellSelectActions={cellSelectActions}
                cellsActions={cellActions}
                setVisible={setVisible}
            />
        );

        await act(() => fireEvent.press(screen.getByText("All")));

        await act(() => fireEvent.press(screen.getByText("Add")));

        await act(() => fireEvent.press(screen.getByText("Run")));

        expect(
            screen.getByText(
                "Select an action to perform on the selected cells"
            )
        ).not.toBeNull();
    });

    describe("cell actions", () => {
        beforeEach(async () => {
            render(
                <ActionsModal
                    isVisible={true}
                    cellsType="List"
                    cellSelectActions={cellSelectActions}
                    cellsActions={cellActions}
                    setVisible={setVisible}
                />
            );

            await act(() => fireEvent.press(screen.getByText("All")));
        });

        it.skip("disable terminating actions", () => {
            // TODO: test that new actions cannot be added after terminating actions.
        });

        it("adds an action", async () => {
            await act(() => fireEvent.press(screen.getByText("Add")));

            expect(screen.getByTestId("delete-action-0")).not.toBeNull();
            expect(screen.getByText("Select action")).not.toBeNull();
        });

        it.skip("deletes an action", async () => {
            // Add multiple actions and delete one. Verify the remaining actions are still
            // displayed in the correct location and the deleted action is no longer present.
        });
    });
});
