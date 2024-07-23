import { useContext } from "react";
import { Text, Image, Pressable, View, StyleSheet } from "react-native";

import { getDeveloperModeListCellStyles, cellsCountDisplay } from "../utils";
import DeveloperModeListCellView from "./DeveloperModeListCellView";
import {
    RenderItemParams,
    ScaleDecorator,
} from "react-native-draggable-flatlist";
import { List } from "../data/data";
import { SettingsContext } from "../contexts/settings.context";
import EditButton from "./EditButton";
import DeleteButton from "./DeleteButton";

type ListCellViewProps = {
    renderParams: RenderItemParams<List>;
    onPress: (index: number) => void;
    onEdit: (index: number) => void;
    onDelete: (index: number) => void;
    testID?: string;
};

export default function ListCellView(props: ListCellViewProps): JSX.Element {
    const { renderParams, onEdit, onDelete, onPress, testID } = props;
    const { item: list, getIndex, drag, isActive } = renderParams;

    const index: number | undefined = getIndex();
    if (index === undefined) {
        throw Error("Unable to retrieve list index");
    }

    const settingsContext = useContext(SettingsContext);
    const {
        settings: { isDeveloperModeEnabled },
    } = settingsContext;

    const numListsDisplay: string = cellsCountDisplay(
        "Item",
        list.items.length
    );

    return (
        <ScaleDecorator>
            <Pressable
                testID={testID}
                disabled={isActive}
                onLongPress={drag}
                onPress={() => onPress(index)}
                style={getDeveloperModeListCellStyles(isActive)}
            >
                <View style={styles.listCellView}>
                    <View style={styles.listCellTextDisplay}>
                        <Text
                            testID={`list-cell-name-${index}`}
                            style={styles.listCellNameText}
                        >
                            {list.name}
                        </Text>
                        <Text style={{ fontSize: 15 }}>
                            {list.listType} • {numListsDisplay}
                        </Text>
                    </View>
                    <View style={styles.childrenWrapper}>
                        <DeleteButton onPress={() => onDelete(index)} />

                        <EditButton onPress={() => onEdit(index)} />

                        <Image
                            source={require("../assets/right-arrow.png")}
                            style={{ width: 32, height: 32 }}
                        />
                    </View>
                </View>

                {isDeveloperModeEnabled && (
                    <DeveloperModeListCellView>
                        <Text>Index: {index}</Text>
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
    listCellNameText: {
        fontSize: 30,
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
