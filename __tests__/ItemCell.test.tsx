import { render, screen, fireEvent } from "@testing-library/react-native";

import ItemCell from "../components/ItemCell";
import { Item } from "../data/Item";

describe("<ItemsCell />", () => {
    let drag = jest.fn();
    let updateItem = jest.fn();
    let deleteItem = jest.fn();
    let openUpdateItemModal = jest.fn();

    beforeEach(() => {
        render(
            <ItemCell
                item={new Item(0, "My Item", 1)}
                index={0}
                drag={drag}
                isActive={false}
                updateItem={updateItem}
                deleteItem={deleteItem}
                openUpdateItemModal={openUpdateItemModal}
            />
        );
    });

    it("display item data", () => {
        expect(screen.getByText("My Item")).not.toBeNull();
        expect(screen.getByText("Quantity: 1")).not.toBeNull();
    });

    it("updates item", () => {
        fireEvent.press(screen.getByText("Update"));
        expect(openUpdateItemModal).toBeCalledTimes(1);
    });

    it("deletes item", () => {
        fireEvent.press(screen.getByText("Delete"));
        expect(deleteItem).toBeCalledTimes(1);
    });

    it("marks item as complete", () => {
        fireEvent(
            screen.getByTestId("itemCell-complete-toggle"),
            "onLongPress"
        );
        expect(drag).toBeCalledTimes(1);
    });
});
