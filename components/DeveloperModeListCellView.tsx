import { ReactNode } from "react";
import { View } from "react-native";

interface DeveloperModeListCellViewProps {
    children?: ReactNode;
}

export default function DeveloperModeListCellView(
    props: DeveloperModeListCellViewProps
): JSX.Element {
    return <View style={{ paddingTop: 20 }}>{props.children}</View>;
}
