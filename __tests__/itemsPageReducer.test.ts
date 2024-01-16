import { Item, Section } from "../data/data";
import {
    DeleteItems,
    ItemsPageState,
    itemsPageReducer,
} from "../data/reducers/itemsPageReducer";

describe("items page reducer", () => {
    it("deletes an item after moving it to another list via update", () => {
        const oldState: ItemsPageState = {
            sections: [
                new Section(
                    "Section 1",
                    [new Item("Item 1.1", 1, false, true)],
                    true
                ),
            ],
            items: [new Item("Item 1.1", 1, false, true)],
            isItemModalVisible: true,
            currentItemIndex: 0,
            isDeleteAllItemsModalVisible: false,
        };

        const {
            sections,
            items: newItems,
            isDeleteAllItemsModalVisible,
            currentItemIndex,
            isItemModalVisible,
        } = itemsPageReducer(oldState, new DeleteItems());

        // Assert the number of sections does not change;
        expect(sections.length).toEqual(oldState.sections.length);

        // Assert all items have been deleted and all sections contain no items.
        expect(newItems.length).toEqual(0);
        for (const section of sections) {
            expect(section.items.length).toEqual(0);
        }

        // Assert the "delete all items" modal remains invisible
        expect(isDeleteAllItemsModalVisible).toEqual(false);

        // Assert the current item index has been reset
        expect(currentItemIndex).toEqual(-1);

        // Assert item's update modal is no longer visible
        expect(isItemModalVisible).toEqual(false);
    });

    it("deletes all items and sections", () => {
        const oldState: ItemsPageState = {
            sections: [
                new Section(
                    "Section 1",
                    [new Item("Item 1.1", 1, false)],
                    true
                ),
                new Section("Section 2", [
                    new Item("Item 2.1", 1, false),
                    new Item("Item 2.2", 2, false),
                ]),
            ],
            items: [
                new Item("Item 1.1", 1, false),
                new Item("Item 2.1", 1, false),
                new Item("Item 2.2", 2, false),
            ],
            isItemModalVisible: false,
            currentItemIndex: -1,
            isDeleteAllItemsModalVisible: true,
        };

        const {
            sections,
            items: newItems,
            isDeleteAllItemsModalVisible,
            currentItemIndex,
            isItemModalVisible,
        } = itemsPageReducer(oldState, new DeleteItems());

        // Assert all sections except the primary one are deleted.
        expect(sections.length).toEqual(1);

        // Assert all items have been deleted and all sections contain no items.
        expect(newItems.length).toEqual(0);
        for (const section of sections) {
            expect(section.items.length).toEqual(0);
        }

        // Assert the "delete all items" modal remains invisible
        expect(isDeleteAllItemsModalVisible).toEqual(false);

        // Assert the current item index has been reset
        expect(currentItemIndex).toEqual(-1);

        // Assert item's update modal is no longer visible
        expect(isItemModalVisible).toEqual(false);
    });
});
