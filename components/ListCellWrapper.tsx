import { Pressable } from "react-native";
import {
    RenderItemParams,
    ScaleDecorator,
} from "react-native-draggable-flatlist";
import { getDeveloperModeListCellStyles } from "../utils";
import { ListCellContext } from "../types";

interface ListCellWrapperProps<T> {
    renderParams: RenderItemParams<T>;
    onPress: (item: T, index: number) => void;
    testID?: string;

    children?: React.ReactNode;
}

export default function ListCellWrapper<T>(
    props: ListCellWrapperProps<T>
): JSX.Element {
    const { renderParams, onPress, testID, children } = props;
    const { item, getIndex, drag, isActive } = renderParams;

    const index: number = getIndex() ?? -1;

    return (
        <ScaleDecorator>
            <Pressable
                testID={testID}
                disabled={isActive}
                onLongPress={drag}
                onPress={() => onPress(item, index)}
                style={getDeveloperModeListCellStyles(isActive)}
            >
                <ListCellContext.Provider value={{ index: index, item: item }}>
                    {children}
                </ListCellContext.Provider>
            </Pressable>
        </ScaleDecorator>
    );
}
