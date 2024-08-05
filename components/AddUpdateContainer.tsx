import { ReactNode } from "react";
import PageContainer from "./PageContainer";
import { StyleProp, View, ViewStyle } from "react-native";

type AddUpdateContainerProps = {
    children: ReactNode;
};

export default function AddUpdateContainer(
    props: AddUpdateContainerProps
): JSX.Element {
    const { children } = props;

    const style: StyleProp<ViewStyle> = {
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
    };

    return (
        <PageContainer>
            <View style={style}>{children}</View>
        </PageContainer>
    );
}
