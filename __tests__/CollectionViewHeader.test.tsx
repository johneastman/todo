import { render, screen, fireEvent } from "@testing-library/react-native";

import CollectionViewHeader from "../components/CollectionViewHeader";
import { List, ListViewCellItem } from "../data/data";
import { CollectionViewCellType } from "../types";

jest.mock("@react-native-async-storage/async-storage", () =>
    require("@react-native-async-storage/async-storage/jest/async-storage-mock")
);

/**
 * Not testing the error condition because that's a development error
 * a regular user would never encounter.
 */
describe("<CollectionViewHeader />", () => {
    const onChecked = jest.fn();

    describe("Lists", () => {
        it("displays header for 0 lists", () => {
            const lists: List[] = [];
            render(itemListFactory(onChecked, "List", lists));
            expect(screen.getByText("0 lists")).not.toBeNull();
        });

        it("displays header for 1 list", () => {
            const lists: List[] = [
                new List("0", "List 1", "List", "bottom", []),
            ];
            render(itemListFactory(onChecked, "List", lists));
            expect(screen.getByText("1 list")).not.toBeNull();
        });

        it("displays header for 2 lists", () => {
            const lists: List[] = [
                new List("0", "List 1", "List", "bottom", []),
                new List("1", "List 2", "List", "bottom", []),
            ];
            render(itemListFactory(onChecked, "List", lists));
            expect(screen.getByText("2 lists")).not.toBeNull();
        });
    });

    it("selects all items", () => {
        render(itemListFactory(onChecked, "Item", [], "0 Items"));
        fireEvent.press(screen.getByText("Select All"));

        expect(onChecked).toBeCalledTimes(1);
    });

    describe("displays number of items", () => {
        it("displays 0 items", () => {
            render(itemListFactory(onChecked, "Item", [], "0 Items"));
            expect(screen.getByText("0 Items")).not.toBeNull();
        });

        it("displays 1 item", () => {
            render(itemListFactory(onChecked, "Item", [], "1 Item"));
            expect(screen.getByText("1 Item")).not.toBeNull();
        });

        it("displays 2 items", () => {
            render(itemListFactory(onChecked, "Item", [], "2 Items"));
            expect(screen.getByText("2 Items")).not.toBeNull();
        });
    });
});

function itemListFactory(
    onChecked: (isChecked: boolean) => void,
    cellsType: CollectionViewCellType,
    cells: ListViewCellItem[] = [],
    headerString?: string
): JSX.Element {
    return (
        <CollectionViewHeader
            title={headerString}
            isAllSelected={false}
            onChecked={onChecked}
            cellsType={cellsType}
            cells={cells}
            openListModal={(): void => {
                throw new Error("Function not implemented.");
            }}
        />
    );
}
