import {
    RenderItemParams,
    ScaleDecorator,
} from "react-native-draggable-flatlist";
import { Pressable, View, Text } from "react-native";

import { Position, SettingsContext } from "../types";
import { Item, List } from "../data/data";
import { STYLES, getDeveloperModeListCellStyles } from "../utils";
import DeveloperModeListCellView from "./DeveloperModeListCellView";
import { useContext } from "react";
import CustomCheckBox from "./CustomCheckBox";

interface ItemsPageCellProps {
    renderItemParams: RenderItemParams<Item>;
    list: List;
    updateItem: (
        oldPos: number,
        newPos: Position,
        listId: string,
        item: Item
    ) => void;
}

export default function ItemsPageCell(props: ItemsPageCellProps): JSX.Element {
    const { renderItemParams, list, updateItem } = props;

    const { item, getIndex, drag, isActive } = renderItemParams;
    const settingsContext = useContext(SettingsContext);

    // const [isEditChecked, setIsEditChecked] = useState<boolean>(false);

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
                    updateItem(index, "current", list.id, newItem);
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

                    <CustomCheckBox
                        label={""}
                        isChecked={item.isBeingEdited}
                        onChecked={(c: boolean) => {
                            let newItem: Item = new Item(
                                item.value,
                                item.quantity,
                                item.isComplete,
                                c
                            );
                            updateItem(index, "current", list.id, newItem);
                        }}
                    />

                    {/* <OptionsDisplay
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
                    /> */}
                </View>
                {settingsContext.isDeveloperModeEnabled ? (
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
