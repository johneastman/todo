import { render, screen, fireEvent } from "@testing-library/react-native";

import ItemsMenu from "../components/ItemsMenu";

describe("<ItemsMenu />", () => {
    const mockFn = jest.fn();

    it("calls add item", () => {
        render(itemListFactory("Name", 0, mockFn));
        fireEvent.press(screen.getByText("Add Item"));

        expect(mockFn).toBeCalledTimes(1);
    });

    describe("displays number of items", () => {
        it("displays 0 items", () => {
            render(itemListFactory("Name", 0, mockFn));
            expect(screen.getByText("0 Items")).not.toBeNull();
        });

        it("displays 1 item", () => {
            render(itemListFactory("Name", 1, mockFn));
            expect(screen.getByText("1 Item")).not.toBeNull();
        });

        it("displays 2 items", () => {
            render(itemListFactory("Name", 2, mockFn));
            expect(screen.getByText("2 Items")).not.toBeNull();
        });
    });
});

function itemListFactory(
    name: string,
    quantity: number,
    displayAddItemModal: () => void
): JSX.Element {
    return (
        <ItemsMenu
            listName={name}
            quantity={quantity}
            displayAddItemModal={displayAddItemModal}
        />
    );
}
