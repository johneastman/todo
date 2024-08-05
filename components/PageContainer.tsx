import { ReactNode } from "react";
import { View, StyleSheet, StyleProp, ViewStyle } from "react-native";
import { Color } from "../utils";

type PageContainerProps = {
    children: ReactNode;
};

export default function PageContainer(props: PageContainerProps): JSX.Element {
    const { children } = props;
    return <View style={styles.container}>{children}</View>;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: Color.White,
    },
});
