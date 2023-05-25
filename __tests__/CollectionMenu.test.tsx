import { render, screen, fireEvent } from "@testing-library/react-native";

import CollectionMenu from "../components/CollectionMenu";
import { Button } from "react-native";

describe("<ItemsMenu />", () => {
    const mockFn = jest.fn();

    it("calls add item", () => {
        render(itemListFactory("0 Items", mockFn));
        fireEvent.press(screen.getByText("Add Item"));

        expect(mockFn).toBeCalledTimes(1);
    });

    describe("displays number of items", () => {
        it("displays 0 items", () => {
            render(itemListFactory("0 Items", mockFn));
            expect(screen.getByText("0 Items")).not.toBeNull();
        });

        it("displays 1 item", () => {
            render(itemListFactory("1 Item", mockFn));
            expect(screen.getByText("1 Item")).not.toBeNull();
        });

        it("displays 2 items", () => {
            render(itemListFactory("2 Items", mockFn));
            expect(screen.getByText("2 Items")).not.toBeNull();
        });
    });
});

function itemListFactory(
    headerString: string,
    displayAddItemModal: () => void
): JSX.Element {
    return (
        <CollectionMenu headerString={headerString}>
            <Button title="Add Item" onPress={displayAddItemModal} />
        </CollectionMenu>
    );
}
