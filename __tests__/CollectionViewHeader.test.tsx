import { render, fireEvent } from "@testing-library/react-native";

import CollectionViewHeader from "../components/CollectionViewHeader";
import { CollectionViewCellType } from "../types";
import { AppContext, defaultAppContextData } from "../contexts/app.context";
import { findByText } from "./testUtils";

jest.mock("@react-native-async-storage/async-storage", () =>
    require("@react-native-async-storage/async-storage/jest/async-storage-mock")
);

describe("<CollectionViewHeader />", () => {
    const onChecked = jest.fn();

    describe("Items", () => {
        it("Displays 'Add Item' Button", () => {
            render(itemListFactory("0 Items", "Item", onChecked));
            expect(findByText("Add Item")).not.toBeNull();
        });
    });

    describe("Lists", () => {
        it("Displays 'Add List' Button", () => {
            render(itemListFactory("0 Lists", "List", onChecked));
            expect(findByText("Add List")).not.toBeNull();
        });
    });

    it("selects all items", () => {
        render(itemListFactory("0 Items", "Item", onChecked));
        fireEvent.press(findByText("Select All")!);

        expect(onChecked).toBeCalledTimes(1);
    });

    it("displays header string", () => {
        render(itemListFactory("0 Items", "Item", onChecked));
        expect(findByText("0 Items")).not.toBeNull();
    });
});

function itemListFactory(
    headerString: string,
    collectionType: CollectionViewCellType,
    onChecked: (isChecked: boolean) => void
): JSX.Element {
    return (
        <AppContext.Provider value={defaultAppContextData}>
            <CollectionViewHeader
                title={headerString}
                cells={[]}
                collectionType={collectionType}
                onSelectAll={onChecked}
            />
        </AppContext.Provider>
    );
}
