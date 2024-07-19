import { render } from "@testing-library/react-native";

import CollectionViewHeader from "../../components/CollectionViewHeader";
import { CollectionViewCellType } from "../../types";
import {
    ListsContext,
    defaultListsContextData,
} from "../../contexts/lists.context";
import { findByText } from "../testUtils";

jest.mock("@react-native-async-storage/async-storage", () =>
    require("@react-native-async-storage/async-storage/jest/async-storage-mock")
);

describe("<CollectionViewHeader />", () => {
    describe("Items", () => {
        it("Displays 'Add Item' Button", () => {
            render(itemListFactory("0 Items", "Item"));
            expect(findByText("Add Item")).not.toBeNull();
        });
    });

    describe("Lists", () => {
        it("Displays 'Add List' Button", () => {
            render(itemListFactory("0 Lists", "List"));
            expect(findByText("Add List")).not.toBeNull();
        });
    });

    it("displays header string", () => {
        render(itemListFactory("0 Items", "Item"));
        expect(findByText("0 Items")).not.toBeNull();
    });
});

function itemListFactory(
    headerString: string,
    collectionType: CollectionViewCellType
): JSX.Element {
    const setAddUpdateModalVisible = jest.fn();

    return (
        <ListsContext.Provider value={defaultListsContextData}>
            <CollectionViewHeader
                title={headerString}
                collectionType={collectionType}
                setAddUpdateModalVisible={setAddUpdateModalVisible}
            />
        </ListsContext.Provider>
    );
}
