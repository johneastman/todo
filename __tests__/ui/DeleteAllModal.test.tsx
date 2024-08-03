import { render, screen } from "@testing-library/react-native";
import DeleteAllModal from "../../components/DeleteAllModal";
import { Item, List } from "../../data/data";
import { CollectionViewCell, CollectionViewCellType } from "../../types";

jest.mock("@react-native-async-storage/async-storage", () =>
    require("@react-native-async-storage/async-storage/jest/async-storage-mock")
);

describe("<DeleteAllModal />", () => {
    describe("deletes items", () => {
        it("deletes none", () => {
            const items: Item[] = [
                new Item("A", "", 1, false),
                new Item("B", "", 1, false),
                new Item("C", "", 1, false),
            ];

            render(deleteAllModalFactory("Item", items));

            expect(
                screen.getByText(
                    "Are you sure you want to delete everything that is selected?"
                )
            ).not.toBeNull();

            expect(screen.getByText("0 items will be deleted.")).not.toBeNull();
        });

        it("deletes selected", () => {
            const items: Item[] = [
                new Item("A", "", 1, false, true),
                new Item("B", "", 1, false),
                new Item("C", "", 1, false, true),
            ];

            render(deleteAllModalFactory("Item", items));

            expect(
                screen.getByText(
                    "Are you sure you want to delete everything that is selected?"
                )
            ).not.toBeNull();

            expect(screen.getByText("2 items will be deleted.")).not.toBeNull();
        });
    });

    describe("deletes lists", () => {
        it("deletes none", () => {
            const lists: List[] = [
                new List("A", "Shopping", "bottom"),
                new List("A", "Shopping", "bottom"),
                new List("A", "Shopping", "bottom"),
            ];

            render(deleteAllModalFactory("List", lists));

            expect(
                screen.getByText(
                    "Are you sure you want to delete everything that is selected?"
                )
            ).not.toBeNull();

            expect(screen.getByText("0 lists will be deleted.")).not.toBeNull();
        });

        it("deletes selected", () => {
            const lists: List[] = [
                new List("A", "Shopping", "bottom", [], true),
                new List("A", "Shopping", "bottom"),
                new List("A", "Shopping", "bottom", [], true),
            ];

            render(deleteAllModalFactory("List", lists));

            expect(
                screen.getByText(
                    "Are you sure you want to delete everything that is selected?"
                )
            ).not.toBeNull();

            expect(screen.getByText("2 lists will be deleted.")).not.toBeNull();
        });
    });
});

function deleteAllModalFactory(
    collectionType: CollectionViewCellType,
    items: CollectionViewCell[]
): JSX.Element {
    const positiveAction = jest.fn();
    const negativeAction = jest.fn();

    return (
        <DeleteAllModal
            isVisible={true}
            collectionType={collectionType}
            numDeleted={items.filter((item) => item.isSelected).length}
            positiveAction={positiveAction}
            negativeAction={negativeAction}
        />
    );
}
