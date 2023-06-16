import { render, screen, fireEvent } from "@testing-library/react-native";
import DraggableFlatList from "react-native-draggable-flatlist";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { Item } from "../data/Item";
import ItemsPageCell from "../components/ItemsPageCell";

/* Needed to mitigate this error:
 *     TypeError: Cannot set property setGestureState of [object Object] which has only a getter
 * https://github.com/computerjazz/react-native-draggable-flatlist/blob/main/tests/index.test.js
 */
jest.mock("react-native-reanimated", () =>
    require("react-native-reanimated/mock")
);

jest.mock("@react-native-async-storage/async-storage", () =>
    require("@react-native-async-storage/async-storage/jest/async-storage-mock")
);

describe("<ItemsPageCell />", () => {
    let drag = jest.fn();
    let updateItem = jest.fn();
    let deleteItem = jest.fn();
    let openUpdateItemModal = jest.fn();

    beforeEach(() => {
        render(
            <GestureHandlerRootView>
                <DraggableFlatList
                    data={[new Item("My Item", 1)]}
                    renderItem={(params) => (
                        <ItemsPageCell
                            renderItemParams={params}
                            updateItem={updateItem}
                            deleteItem={deleteItem}
                            openUpdateItemModal={openUpdateItemModal}
                        />
                    )}
                    onDragEnd={drag}
                    keyExtractor={(_, index) => `item-${index}`}
                />
            </GestureHandlerRootView>
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
        fireEvent(screen.getByTestId("itemCell-complete-toggle"), "onDragEnd");
        expect(drag).toBeCalledTimes(1);
    });
});
