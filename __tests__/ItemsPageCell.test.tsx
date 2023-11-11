import { render, screen, fireEvent } from "@testing-library/react-native";
import DraggableFlatList from "react-native-draggable-flatlist";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { Item, List } from "../data/data";
import ItemsPageCell from "../components/ItemsPageCell";
import { SettingsContext, defaultSettings } from "../types";

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
    let updateItemBeingEdited = jest.fn();
    let isItemBeingEdited = jest.fn();

    beforeEach(() => {
        render(
            <SettingsContext.Provider value={defaultSettings}>
                <GestureHandlerRootView>
                    <DraggableFlatList
                        data={[new Item("My Item", 1)]}
                        renderItem={(params) => (
                            <ItemsPageCell
                                list={
                                    new List(
                                        "0",
                                        "My List",
                                        "Shopping",
                                        "bottom"
                                    )
                                }
                                renderItemParams={params}
                                updateItem={updateItem}
                                updateItemBeingEdited={updateItemBeingEdited}
                                isItemBeingEdited={isItemBeingEdited}
                            />
                        )}
                        onDragEnd={drag}
                        keyExtractor={(_, index) => `item-${index}`}
                    />
                </GestureHandlerRootView>
            </SettingsContext.Provider>
        );
    });

    describe("display item data", () => {
        it("displays item name", () => {
            expect(screen.getByText("My Item")).not.toBeNull();
        });

        it("displays item quantity", () => {
            expect(screen.getByText("Quantity: 1")).not.toBeNull();
        });
    });

    it("selects edit-item checkbox", () => {
        fireEvent.press(screen.getByTestId("edit-item-checkbox-0"));
        expect(updateItemBeingEdited).toBeCalledTimes(1);
    });

    it("move item in list", () => {
        fireEvent(screen.getByTestId("itemCell-complete-toggle"), "onDragEnd");
        expect(drag).toBeCalledTimes(1);
    });

    it("marks item as complete", () => {
        fireEvent.press(screen.getByTestId("itemCell-complete-toggle"));
        expect(updateItem).toBeCalledTimes(1);
    });
});
