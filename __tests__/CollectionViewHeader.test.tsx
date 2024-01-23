import { render, screen, fireEvent } from "@testing-library/react-native";

import CollectionViewHeader from "../components/CollectionViewHeader";

jest.mock("@react-native-async-storage/async-storage", () =>
    require("@react-native-async-storage/async-storage/jest/async-storage-mock")
);

describe("<ItemsMenu />", () => {
    const onChecked = jest.fn();

    it("selects all items", () => {
        render(itemListFactory("0 Items", onChecked));
        fireEvent.press(screen.getByText("Select All"));

        expect(onChecked).toBeCalledTimes(1);
    });

    describe("displays number of items", () => {
        it("displays 0 items", () => {
            render(itemListFactory("0 Items"));
            expect(screen.getByText("0 Items")).not.toBeNull();
        });

        it("displays 1 item", () => {
            render(itemListFactory("1 Item"));
            expect(screen.getByText("1 Item")).not.toBeNull();
        });

        it("displays 2 items", () => {
            render(itemListFactory("2 Items"));
            expect(screen.getByText("2 Items")).not.toBeNull();
        });
    });
});

function itemListFactory(
    headerString: string,
    onChecked: (isChecked: boolean) => void = jest.fn()
): JSX.Element {
    return (
        <CollectionViewHeader
            title={headerString}
            isAllSelected={false}
            onSelectAll={onChecked}
        />
    );
}
