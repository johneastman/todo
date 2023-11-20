import { render, screen, fireEvent } from "@testing-library/react-native";

import ListViewHeader from "../components/ListViewHeader";
import { Button } from "react-native";

jest.mock("@react-native-async-storage/async-storage", () =>
    require("@react-native-async-storage/async-storage/jest/async-storage-mock")
);

describe("<ItemsMenu />", () => {
    const displayAddItemModal = jest.fn();
    const onChecked = jest.fn();

    it("calls add item", () => {
        render(itemListFactory("0 Items", displayAddItemModal, onChecked));
        fireEvent.press(screen.getByText("Add Item"));

        expect(displayAddItemModal).toBeCalledTimes(1);
    });

    it("selects all items", () => {
        render(itemListFactory("0 Items", displayAddItemModal, onChecked));
        fireEvent.press(screen.getByText("Select All"));

        expect(onChecked).toBeCalledTimes(1);
    });

    describe("displays number of items", () => {
        it("displays 0 items", () => {
            render(itemListFactory("0 Items", displayAddItemModal, onChecked));
            expect(screen.getByText("0 Items")).not.toBeNull();
        });

        it("displays 1 item", () => {
            render(itemListFactory("1 Item", displayAddItemModal, onChecked));
            expect(screen.getByText("1 Item")).not.toBeNull();
        });

        it("displays 2 items", () => {
            render(itemListFactory("2 Items", displayAddItemModal, onChecked));
            expect(screen.getByText("2 Items")).not.toBeNull();
        });
    });
});

function itemListFactory(
    headerString: string,
    displayAddItemModal: () => void,
    onChecked: (isChecked: boolean) => void
): JSX.Element {
    return (
        <ListViewHeader
            title={headerString}
            isAllSelected={false}
            onChecked={onChecked}
        >
            <Button title="Add Item" onPress={displayAddItemModal} />
        </ListViewHeader>
    );
}
