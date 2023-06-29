import {
    RenderItemParams,
    ScaleDecorator,
} from "react-native-draggable-flatlist";
import { Pressable, View, Text } from "react-native";

import { Position } from "../types";
import { Item, List } from "../data/data";
import {
    STYLES,
    areTestsRunning,
    getDeveloperModeListCellStyles,
} from "../utils";
import DeveloperModeListCellView from "./DeveloperModeListCellView";
import OptionsDisplay from "./OptionsDisplay";

interface ItemsPageCellProps {
    renderItemParams: RenderItemParams<Item>;
    list: List;
    isDeveloperModeEnabled: boolean;
    updateItem: (oldPos: number, newPos: Position, item: Item) => void;
    deleteItem: (index: number) => void;
    openUpdateItemModal: (index: number, item: Item) => void;
}

export default function ItemsPageCell(props: ItemsPageCellProps): JSX.Element {
    const {
        renderItemParams,
        list,
        isDeveloperModeEnabled,
        updateItem,
        deleteItem,
        openUpdateItemModal,
    } = props;

    const { item, getIndex, drag, isActive } = renderItemParams;

    let index: number = getIndex() ?? -1;

    // Completed items have their names crossed out
    let dynamicTextStyles: {} = {
        flex: 1, // ensure text doesn't push buttons off screen
        textDecorationLine: item.isComplete ? "line-through" : "none",
        color: item.isComplete ? "#ccc" : "#000",
        verticalAlign: list.type === "Shopping" ? "top" : "middle",
    };

    return (
        <ScaleDecorator>
            <Pressable
                testID="itemCell-complete-toggle"
                onLongPress={drag}
                disabled={isActive}
                onPress={() => {
                    let newItem: Item = new Item(
                        item.value,
                        item.quantity,
                        !item.isComplete
                    );
                    updateItem(index, "current", newItem);
                }}
                style={getDeveloperModeListCellStyles(isActive)}
            >
                <View style={STYLES.listCellView}>
                    <View style={STYLES.listCellTextDisplay}>
                        <Text
                            testID={`item-cell-name-${index}`}
                            style={[STYLES.listCellNameText, dynamicTextStyles]}
                        >
                            {item.value}
                        </Text>
                        {list.type === "Shopping" ? (
                            <Text style={[{ fontSize: 15 }, dynamicTextStyles]}>
                                Quantity: {item.quantity}
                            </Text>
                        ) : null}
                    </View>

                    <OptionsDisplay
                        options={[
                            {
                                text: "Update",
                                action: () => {
                                    openUpdateItemModal(index, item);
                                },
                                testID: `item-cell-update-${index}`,
                            },
                            {
                                text: "Delete",
                                action: () => {
                                    deleteItem(index);
                                },
                                testID: `item-cell-delete-${index}`,
                                textStyle: { color: "red" },
                            },
                        ]}
                    />
                </View>
                {isDeveloperModeEnabled ? (
                    <DeveloperModeListCellView>
                        <Text>List ID: {list.id}</Text>
                        <Text>Index: {index}</Text>
                        <Text>
                            Is Complete: {item.isComplete ? "True" : "False"}
                        </Text>
                    </DeveloperModeListCellView>
                ) : null}
            </Pressable>
        </ScaleDecorator>
    );
}
