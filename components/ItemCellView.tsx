import { View, Text, Button, Pressable } from "react-native";
import { SettingsContext } from "../types";
import { Item, List } from "../data/data";
import {
    LIGHT_BLUE,
    LIGHT_GREY,
    STYLES,
    WHITE,
    getDeveloperModeListCellStyles,
} from "../utils";
import DeveloperModeListCellView from "./DeveloperModeListCellView";
import { useContext } from "react";
import CustomCheckBox from "./CustomCheckBox";
import {
    RenderItemParams,
    ScaleDecorator,
} from "react-native-draggable-flatlist";

interface ItemCellViewProps {
    list: List;
    sectionIndex: number;
    updateItem: (sectionIndex: number, itemIndex: number, item: Item) => void;
    openAddItemModal: (index: number) => void;

    renderParams: RenderItemParams<Item>;
    testID?: string;
}

export default function ItemCellView(props: ItemCellViewProps): JSX.Element {
    const {
        list,
        sectionIndex,
        updateItem,
        openAddItemModal,
        renderParams,
        testID,
    } = props;

    const { item, getIndex, drag, isActive } = renderParams;
    const itemIndex: number = getIndex() ?? -1;

    const settingsContext = useContext(SettingsContext);

    // Completed items have their names crossed out
    let dynamicTextStyles: {} = {
        flex: 1, // ensure text doesn't push buttons off screen
        textDecorationLine: item.isComplete ? "line-through" : "none",
        color: item.isComplete ? "#ccc" : "#000",
        verticalAlign: list.listType === "Shopping" ? "top" : "middle",
    };

    const setIsComplete = () => {
        const newItem: Item = new Item(
            item.name,
            item.quantity,
            item.itemType,
            !item.isComplete,
            item.isSelected
        );
        updateItem(sectionIndex, itemIndex, newItem);
    };

    const setIsSelected = (isChecked: boolean) => {
        const newItem: Item = new Item(
            item.name,
            item.quantity,
            item.itemType,
            item.isComplete,
            isChecked
        );
        updateItem(sectionIndex, itemIndex, newItem);
    };

    return (
        <ScaleDecorator>
            <Pressable
                testID={testID}
                disabled={isActive}
                onLongPress={drag}
                onPress={setIsComplete}
                style={[
                    getDeveloperModeListCellStyles(isActive),
                    /**
                     * For sections, the background color should be the same when the cell is
                     * both active and inactive. However for items, the background color when
                     * the cell is active should be different when the cell is inactive.
                     */
                    {
                        backgroundColor:
                            item.itemType === "Section"
                                ? LIGHT_GREY
                                : isActive
                                ? LIGHT_BLUE
                                : WHITE,
                    },
                ]}
            >
                <View style={STYLES.listCellView}>
                    <View style={STYLES.listCellTextDisplay}>
                        <Text
                            testID={`item-cell-name-${itemIndex}`}
                            style={[STYLES.listCellNameText, dynamicTextStyles]}
                        >
                            {list.listType === "Ordered To-Do"
                                ? `${itemIndex + 1}. ${item.name}`
                                : item.name}
                        </Text>
                        {list.listType === "Shopping" &&
                            item.itemType === "Item" && (
                                <Text
                                    style={[
                                        { fontSize: 15 },
                                        dynamicTextStyles,
                                    ]}
                                >
                                    Quantity: {item.quantity}
                                </Text>
                            )}
                    </View>

                    <View style={[STYLES.listCellView, { gap: 10 }]}>
                        {item.itemType === "Section" && (
                            <Button
                                title="Add Item"
                                onPress={() => openAddItemModal(-1)}
                                testID="section-add-item"
                            />
                        )}

                        <CustomCheckBox
                            testID={`edit-item-checkbox-${itemIndex}`}
                            isChecked={item.isSelected}
                            onChecked={(isChecked: boolean) =>
                                setIsSelected(isChecked)
                            }
                        />
                    </View>
                </View>
                {settingsContext.isDeveloperModeEnabled && (
                    <DeveloperModeListCellView>
                        <Text>List ID: {list.id}</Text>
                        <Text>Index: {itemIndex}</Text>
                        <Text>
                            Is Complete: {item.isComplete ? "True" : "False"}
                        </Text>
                    </DeveloperModeListCellView>
                )}
            </Pressable>
        </ScaleDecorator>
    );
}
