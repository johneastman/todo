import { render, screen, fireEvent } from "@testing-library/react-native";

import CollectionCellActions from "../components/CollectionCellActions";

describe("<CollectionCellActions />", () => {
    it("presses buttons", () => {
        const mockUpdateAction = jest.fn();
        const mockDeleteAction = jest.fn();

        render(
            <CollectionCellActions
                updateAction={mockUpdateAction}
                deleteAction={mockDeleteAction}
            />
        );

        // Update button
        fireEvent.press(screen.getByText("Update"));
        expect(mockUpdateAction).toBeCalledTimes(1);

        // Delete Button
        fireEvent.press(screen.getByText("Delete"));
        expect(mockUpdateAction).toBeCalledTimes(1);
    });
});
