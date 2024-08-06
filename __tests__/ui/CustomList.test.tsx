import { render, screen } from "@testing-library/react-native";

import CustomList from "../../components/core/CustomList";
import { RenderItemParams } from "react-native-draggable-flatlist";
import { View } from "react-native";

import { Item } from "../../data/data";
import CustomText from "../../components/core/CustomText";

/* Needed to mitigate this error:
 *     TypeError: Cannot set property setGestureState of [object Object] which has only a getter
 * https://github.com/computerjazz/react-native-draggable-flatlist/blob/main/tests/index.test.js
 */
jest.mock("react-native-reanimated", () =>
    require("react-native-reanimated/mock")
);

describe("<CustomList />", () => {
    it("displays items in list", () => {
        const renderItem = ({ item }: RenderItemParams<Item>) => {
            return (
                <View>
                    <CustomText text={item.name} />
                    <CustomText text={` Quantity: ${item.quantity}`} />
                </View>
            );
        };
        const drag = jest.fn();

        const items: Item[] = [
            new Item("a", "", 1, false),
            new Item("b", "", 2, false),
            new Item("c", "", 3, false),
        ];

        render(
            <CustomList items={items} renderItem={renderItem} drag={drag} />
        );

        for (const item of items) {
            expect(screen.getByText(item.name)).not.toBeNull();
            expect(
                screen.getByText(`Quantity: ${item.quantity}`)
            ).not.toBeNull();
        }
    });
});
