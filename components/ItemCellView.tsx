import { View, Text, Pressable } from "react-native";
import { Item, List } from "../data/data";
import {
    LIGHT_BLUE,
    STYLES,
    WHITE,
    displayBoolean,
    getDeveloperModeListCellStyles,
} from "../utils";
import DeveloperModeListCellView from "./DeveloperModeListCellView";
import { useContext } from "react";
import CustomCheckBox from "./CustomCheckBox";
import {
    RenderItemParams,
    ScaleDecorator,
} from "react-native-draggable-flatlist";
import { SettingsContext } from "../data/reducers/settingsReducer";
import {
    ItemsPageStateAction,
    SelectItem,
    SetItemIsComplete,
} from "../data/reducers/itemsPageReducer";

interface ItemCellViewProps {
    list: List;
    sectionIndex: number;
    itemsDispatch: (action: ItemsPageStateAction) => void;

    renderParams: RenderItemParams<Item>;
    testID?: string;
}

export default function ItemCellView(props: ItemCellViewProps): JSX.Element {
    const { list, sectionIndex, itemsDispatch, renderParams, testID } = props;

    const { item, getIndex, drag, isActive } = renderParams;
    const itemIndex: number = getIndex() ?? -1;

    const settingsContext = useContext(SettingsContext);
    const {
        settings: { isDeveloperModeEnabled },
    } = settingsContext;

    // Completed items have their names crossed out
    let dynamicTextStyles: {} = {
        flex: 1, // ensure text doesn't push buttons off screen
        textDecorationLine: item.isComplete ? "line-through" : "none",
        color: item.isComplete ? "#ccc" : "#000",
        verticalAlign: list.listType === "Shopping" ? "top" : "middle",
    };

    const setIsComplete = () =>
        itemsDispatch(new SetItemIsComplete(sectionIndex, itemIndex));

    const setIsSelected = (isChecked: boolean) =>
        itemsDispatch(new SelectItem(sectionIndex, itemIndex, isChecked));

    return (
        <ScaleDecorator>
            <Pressable
                testID={testID}
                disabled={isActive}
                onLongPress={drag}
                onPress={setIsComplete}
                style={[
                    getDeveloperModeListCellStyles(isActive),
                    {
                        backgroundColor: isActive ? LIGHT_BLUE : WHITE,
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
                        {list.listType === "Shopping" && (
                            <Text style={[{ fontSize: 15 }, dynamicTextStyles]}>
                                Quantity: {item.quantity}
                            </Text>
                        )}
                    </View>

                    <CustomCheckBox
                        testID={`edit-item-checkbox-${itemIndex}`}
                        isChecked={item.isSelected}
                        onChecked={(isChecked: boolean) =>
                            setIsSelected(isChecked)
                        }
                    />
                </View>
                {isDeveloperModeEnabled && (
                    <DeveloperModeListCellView>
                        <Text>List ID: {list.id}</Text>
                        <Text>Index: {itemIndex}</Text>
                        <Text>
                            Is Complete: {displayBoolean(item.isComplete)}
                        </Text>
                    </DeveloperModeListCellView>
                )}
            </Pressable>
        </ScaleDecorator>
    );
}
