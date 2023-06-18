import {
    RenderItemParams,
    ScaleDecorator,
} from "react-native-draggable-flatlist";
import { Pressable, View, Text } from "react-native";

import { Position } from "../types";
import CollectionCellActions from "./CollectionCellActions";
import { Item } from "../data/Item";
import { STYLES, getDeveloperModeListCellStyles } from "../utils";
import DeveloperModeListCellView from "./DeveloperModeListCellView";

interface ItemsPageCellProps {
    renderItemParams: RenderItemParams<Item>;
    listId: string;
    isDeveloperModeEnabled: boolean;
    updateItem: (oldPos: number, newPos: Position, item: Item) => void;
    deleteItem: (index: number) => void;
    openUpdateItemModal: (index: number, item: Item) => void;
}

export default function ItemsPageCell(props: ItemsPageCellProps): JSX.Element {
    const {
        renderItemParams,
        listId,
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
                        <Text style={[{ fontSize: 15 }, dynamicTextStyles]}>
                            Quantity: {item.quantity}
                        </Text>
                    </View>

                    <CollectionCellActions
                        index={index}
                        updateAction={() => {
                            openUpdateItemModal(index, item);
                        }}
                        deleteAction={() => {
                            deleteItem(index);
                        }}
                    />
                </View>
                {isDeveloperModeEnabled ? (
                    <DeveloperModeListCellView>
                        <Text>List ID: {listId}</Text>
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
