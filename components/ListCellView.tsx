import { useContext } from "react";
import { View, Text, Image, Pressable } from "react-native";

import {
    STYLES,
    getDeveloperModeListCellStyles,
    cellsCountDisplay,
} from "../utils";
import DeveloperModeListCellView from "./DeveloperModeListCellView";
import CustomCheckBox from "./CustomCheckBox";
import {
    RenderItemParams,
    ScaleDecorator,
} from "react-native-draggable-flatlist";
import { List } from "../data/data";
import { AppContext } from "../contexts/app.context";

type ListCellViewProps = {
    updateItems: (index: number, isSelected: boolean) => void;
    renderParams: RenderItemParams<List>;
    onPress: (item: List, index: number) => void;
    testID?: string;
};

export default function ListCellView(props: ListCellViewProps): JSX.Element {
    const { updateItems, renderParams, onPress, testID } = props;
    const { item: list, getIndex, drag, isActive } = renderParams;

    const index: number | undefined = getIndex();
    if (index === undefined) {
        throw Error("Unable to retrieve list index");
    }

    const appContext = useContext(AppContext);
    const {
        data: {
            settings: { isDeveloperModeEnabled },
        },
    } = appContext;

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
                onPress={() => onPress(list, index)}
                style={getDeveloperModeListCellStyles(isActive)}
            >
                <View
                    style={[
                        STYLES.listCellView,
                        {
                            flex: 1,
                        },
                    ]}
                >
                    <View style={STYLES.listCellTextDisplay}>
                        <Text
                            testID={`list-cell-name-${index}`}
                            style={STYLES.listCellNameText}
                        >
                            {list.name}
                        </Text>
                        <Text style={{ fontSize: 15 }}>
                            {`${list.listType} • ${numListsDisplay}`}
                        </Text>
                    </View>
                    <Image
                        source={require("../assets/right-arrow.png")}
                        style={{ width: 32, height: 32 }}
                    />

                    <CustomCheckBox
                        testID={`edit-list-checkbox-${index}`}
                        isChecked={list.isSelected}
                        onChecked={(isChecked: boolean) =>
                            updateItems(index, isChecked)
                        }
                    />
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
