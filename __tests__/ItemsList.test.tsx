import { render, screen, fireEvent } from "@testing-library/react-native";

import ItemsList from "../components/ItemsList";
import {
    RenderItemParams,
    ScaleDecorator,
} from "react-native-draggable-flatlist";
import { Text, View } from "react-native";

import { Item } from "../data/Item";
import { GestureHandlerRootView } from "react-native-gesture-handler";

/* Needed to mitigate this error:
 *     TypeError: Cannot set property setGestureState of [object Object] which has only a getter
 * https://github.com/computerjazz/react-native-draggable-flatlist/blob/main/tests/index.test.js
 */
jest.mock("react-native-reanimated", () =>
    require("react-native-reanimated/mock")
);

describe("<ItemsList />", () => {
    it("displays empty list view", () => {
        const renderItem = ({ item }: RenderItemParams<Item>) => {
            return <Text>{item.value}</Text>;
        };
        let drag = jest.fn();

        render(<ItemsList items={[]} renderItem={renderItem} drag={drag} />);
        expect(screen.getByText("No Items")).not.toBeNull();
    });

    it("displays items in list", () => {
        const renderItem = ({ item }: RenderItemParams<Item>) => {
            return (
                <View>
                    <Text>{item.value}</Text>
                    <Text>Quantity: {item.quantity}</Text>
                </View>
            );
        };
        let drag = jest.fn();

        let items: Item[] = [
            new Item("a", 1),
            new Item("b", 2),
            new Item("c", 3),
        ];

        render(<ItemsList items={items} renderItem={renderItem} drag={drag} />);

        for (let item of items) {
            expect(screen.getByText(item.value)).not.toBeNull();
            expect(
                screen.getByText(`Quantity: ${item.quantity}`)
            ).not.toBeNull();
        }
    });
});
