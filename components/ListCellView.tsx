import { useContext } from "react";
import { Text, Image, Pressable } from "react-native";

import { getDeveloperModeListCellStyles, cellsCountDisplay } from "../utils";
import DeveloperModeListCellView from "./DeveloperModeListCellView";
import CustomCheckBox from "./core/CustomCheckBox";
import {
    RenderItemParams,
    ScaleDecorator,
} from "react-native-draggable-flatlist";
import { List } from "../data/data";
import CellView from "./CellView";
import { SettingsContext } from "../contexts/settings.context";

type ListCellViewProps = {
    onChecked: (index: number, isSelected: boolean) => void;
    renderParams: RenderItemParams<List>;
    onPress: (index: number) => void;
    testID?: string;
};

export default function ListCellView(props: ListCellViewProps): JSX.Element {
    const { onChecked, renderParams, onPress, testID } = props;
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
                <CellView
                    primaryText={list.name}
                    secondaryText={`${list.listType} • ${numListsDisplay}`}
                    testId={`list-cell-name-${index}`}
                >
                    <Image
                        source={require("../assets/right-arrow.png")}
                        style={{ width: 32, height: 32 }}
                    />

                    <CustomCheckBox
                        testID={`edit-list-checkbox-${index}`}
                        isChecked={list.isSelected}
                        onChecked={(isChecked: boolean) =>
                            onChecked(index, isChecked)
                        }
                    />
                </CellView>
                {isDeveloperModeEnabled && (
                    <DeveloperModeListCellView>
                        <Text>Index: {index}</Text>
                    </DeveloperModeListCellView>
                )}
            </Pressable>
        </ScaleDecorator>
    );
}
