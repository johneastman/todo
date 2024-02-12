import { View, Text, Pressable } from "react-native";
import { Item, List } from "../data/data";
import {
    LIGHT_BLUE,
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
import { AppContext } from "../contexts/app.context";
import { ItemIsComplete } from "../data/reducers/app.reducer";

type ItemCellViewProps = {
    listIndex: number;
    list: List;
    updateItems: (index: number, isSelected: boolean) => void;

    renderParams: RenderItemParams<Item>;
    testID?: string;
};

export default function ItemCellView(props: ItemCellViewProps): JSX.Element {
    const {
        listIndex,
        list: { listType },
        updateItems,
        renderParams,
        testID,
    } = props;

    const { item, getIndex, drag, isActive } = renderParams;

    const index: number | undefined = getIndex();
    if (index === undefined) {
        throw Error("Unable to retrieve item index");
    }

    const settingsContext = useContext(AppContext);
    const {
        data: {
            settings: { isDeveloperModeEnabled },
        },
        dispatch,
    } = settingsContext;

    // Completed items have their names crossed out
    const dynamicTextStyles: {} = {
        flex: 1, // ensure text doesn't push buttons off screen
        textDecorationLine: item.isComplete ? "line-through" : "none",
        color: item.isComplete ? "#ccc" : "#000",
        verticalAlign: listType === "Shopping" ? "top" : "middle",
    };

    const onPressLocal = () => dispatch(new ItemIsComplete(listIndex, index));

    return (
        <ScaleDecorator>
            <Pressable
                testID={testID}
                disabled={isActive}
                onLongPress={drag}
                onPress={onPressLocal}
                style={[
                    getDeveloperModeListCellStyles(isActive),
                    /**
                     * For sections, the background color should be the same when the cell is
                     * both active and inactive. However for items, the background color when
                     * the cell is active should be different when the cell is inactive.
                     */
                    {
                        backgroundColor: isActive ? LIGHT_BLUE : WHITE,
                    },
                ]}
            >
                <View style={STYLES.listCellView}>
                    <View style={STYLES.listCellTextDisplay}>
                        <Text
                            testID={`item-cell-name-${index}`}
                            style={[STYLES.listCellNameText, dynamicTextStyles]}
                        >
                            {listType === "Ordered To-Do"
                                ? `${index + 1}. ${item.name}`
                                : item.name}
                        </Text>
                        {listType === "Shopping" && (
                            <Text style={[{ fontSize: 15 }, dynamicTextStyles]}>
                                Quantity: {item.quantity}
                            </Text>
                        )}
                    </View>

                    <View style={[STYLES.listCellView, { gap: 10 }]}>
                        <CustomCheckBox
                            testID={`edit-item-checkbox-${index}`}
                            isChecked={item.isSelected}
                            onChecked={(isChecked: boolean) =>
                                updateItems(index, isChecked)
                            }
                        />
                    </View>
                </View>

                {isDeveloperModeEnabled && (
                    <DeveloperModeListCellView>
                        <Text>List Index: {listIndex}</Text>
                        <Text>Index: {index}</Text>
                        <Text>
                            Is Complete: {item.isComplete ? "True" : "False"}
                        </Text>
                    </DeveloperModeListCellView>
                )}
            </Pressable>
        </ScaleDecorator>
    );
}
