import { Text, Pressable, Image, TextStyle, StyleProp } from "react-native";
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
import CellView from "./CellView";
import { SettingsContext } from "../contexts/settings.context";
import EditButton from "./EditButton";
import DeleteButton from "./DeleteButton";

type ItemCellViewProps = {
    listIndex: number;
    list: List;
    onEdit: (index: number) => void;
    onDelete: (index: number) => void;

    renderParams: RenderItemParams<Item>;
    testID?: string;
};

export default function ItemCellView(props: ItemCellViewProps): JSX.Element {
    const {
        listIndex,
        list: { listType },
        onEdit,
        onDelete,
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

    // Completed items have their names crossed out
    const dynamicTextStyles: StyleProp<TextStyle> = {
        flex: 1, // ensure text doesn't push buttons off screen
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
                        backgroundColor: isActive
                            ? Color.LightBlue
                            : Color.White,
                    },
                ]}
            >
                <CellView
                    primaryText={
                        listType === "Ordered To-Do"
                            ? `${index + 1}. ${item.name}`
                            : item.name
                    }
                    primaryTextStyle={dynamicTextStyles}
                    secondaryText={
                        listType === "Shopping"
                            ? `Quantity: ${item.quantity}`
                            : undefined
                    }
                    secondaryTextStyle={dynamicTextStyles}
                    testId={`item-cell-name-${index}`}
                >
                    {item.isLocked && (
                        <Image
                            source={require("../assets/lock.png")}
                            style={{ width: 30, height: 30 }}
                        />
                    )}

                    <DeleteButton
                        onPress={() => onDelete(index)}
                        testId="item-cell-delete-button"
                    />

                    <EditButton
                        onPress={() => onEdit(index)}
                        testId="item-cell-edit-button"
                    />
                </CellView>

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
