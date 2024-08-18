import { Switch, View } from "react-native";
import CustomButton from "./core/CustomButton";
import { CollectionViewCellType } from "../types";

type CollectionPageNavigationHeaderProps = {
    cellType: CollectionViewCellType;
    selectMode: boolean;
    updateSelectMode: (isVisible: boolean) => void;
    updateDrawerVisibility: (isVisible: boolean) => void;
};

export default function CollectionPageNavigationHeader(
    props: CollectionPageNavigationHeaderProps
): JSX.Element {
    const { cellType, selectMode, updateSelectMode, updateDrawerVisibility } =
        props;

    return (
        <View style={{ flexDirection: "row", gap: 10 }}>
            <Switch value={selectMode} onValueChange={updateSelectMode} />
            <CustomButton
                text={`${cellType} Options`}
                onPress={() => updateDrawerVisibility(true)}
            />
        </View>
    );
}
