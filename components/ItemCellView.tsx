import {
    Pressable,
    Image,
    TextStyle,
    StyleProp,
    View,
    StyleSheet,
} from "react-native";
import { Item, List } from "../data/data";
import { Color, getDeveloperModeListCellStyles } from "../utils";
import DeveloperModeListCellView from "./DeveloperModeListCellView";
import { useContext } from "react";
import {
    RenderItemParams,
    ScaleDecorator,
} from "react-native-draggable-flatlist";
import { ListsContext } from "../contexts/lists.context";
import { ItemIsComplete } from "../data/reducers/lists.reducer";
import { SettingsContext } from "../contexts/settings.context";
import EditButton from "./EditButton";
import DeleteButton from "./DeleteButton";
import HorizontalLine from "./core/HorizontalLine";
import CustomText, { TextSize } from "./core/CustomText";
import { ItemsStateContext } from "../contexts/itemsState.context";
import CustomCheckBox from "./core/CustomCheckBox";

type ItemCellViewProps = {
    listIndex: number;
    list: List;
    onEdit: (index: number) => void;
    onDelete: (index: number) => void;
    onSelect: (index: number, isSelected: boolean) => void;

    renderParams: RenderItemParams<Item>;
    testID?: string;
};

export default function ItemCellView(props: ItemCellViewProps): JSX.Element {
    const {
        listIndex,
        list: { listType },
        onEdit,
        onDelete,
        onSelect,
        renderParams,
        testID,
    } = props;

    const { item, getIndex, drag, isActive } = renderParams;

    const index: number | undefined = getIndex();
    if (index === undefined) {
        throw Error("Unable to retrieve item index");
    }

    const listsContextData = useContext(ListsContext);
    const { listsDispatch: dispatch } = listsContextData;

    const settingsContext = useContext(SettingsContext);
    const {
        settings: { isDeveloperModeEnabled },
    } = settingsContext;

    const itemsStateContext = useContext(ItemsStateContext);
    const {
        itemsState: { selectMode },
    } = itemsStateContext;

    // Completed items have their names crossed out
    const dynamicTextStyles: StyleProp<TextStyle> = {
        flex: 1, // ensure text doesn't push buttons off screen
        color: item.isComplete ? "#ccc" : "#000",
        verticalAlign: listType === "Shopping" ? "top" : "middle",
    };

    const onPressLocal = () => dispatch(new ItemIsComplete(listIndex, index));

    const onItemSelected = (isChecked: boolean) => onSelect(index, isChecked);

    const itemNameText: string =
        listType === "Ordered To-Do" ? `${index + 1}. ${item.name}` : item.name;

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
                        backgroundColor: isActive
                            ? Color.LightBlue
                            : Color.White,
                    },
                ]}
            >
                <View style={styles.listCellView}>
                    <View style={styles.listCellTextDisplay}>
                        <CustomText
                            testId={`item-cell-name-${index}`}
                            text={itemNameText}
                            size={TextSize.Large}
                            style={dynamicTextStyles}
                        />

                        {listType === "Shopping" && (
                            <CustomText
                                text={`Quantity: ${item.quantity}`}
                                style={dynamicTextStyles}
                            />
                        )}
                    </View>
                    <View style={styles.childrenWrapper}>
                        {item.isLocked && (
                            <Image
                                source={require("../assets/lock.png")}
                                style={{ width: 30, height: 30 }}
                            />
                        )}

                        {selectMode ? (
                            <CustomCheckBox
                                isChecked={item.isSelected}
                                onChecked={onItemSelected}
                            />
                        ) : (
                            <>
                                <DeleteButton
                                    onPress={() => onDelete(index)}
                                    testId="item-cell-delete-button"
                                />
                                <EditButton
                                    onPress={() => onEdit(index)}
                                    testId="item-cell-edit-button"
                                />
                            </>
                        )}
                    </View>
                </View>
                {item.notes.length > 0 && (
                    <View style={{ paddingTop: 10 }}>
                        <HorizontalLine />
                        <CustomText
                            text={item.notes}
                            style={dynamicTextStyles}
                        />
                    </View>
                )}

                {isDeveloperModeEnabled && (
                    <DeveloperModeListCellView>
                        <CustomText text={`List Index: ${listIndex}`} />
                        <CustomText text={`Item Index: ${index}`} />
                        <CustomText
                            text={`Is Complete: ${
                                item.isComplete ? "True" : "False"
                            }`}
                        />
                        <CustomText
                            text={`Is Selected: ${
                                item.isSelected ? "Yes" : "No"
                            }`}
                        />
                    </DeveloperModeListCellView>
                )}
            </Pressable>
        </ScaleDecorator>
    );
}

const styles = StyleSheet.create({
    listCellTextDisplay: {
        flex: 1,
        flexDirection: "column",
    },
    listCellView: {
        justifyContent: "space-between",
        flexDirection: "row",
        alignItems: "center",
    },
    childrenWrapper: {
        gap: 10,
        flexDirection: "row",
        alignItems: "center",
    },
});
