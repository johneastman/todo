import { ReactNode } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { Color } from "../utils";

type PageContainerProps = {
    children: ReactNode;
};

export default function PageContainer(props: PageContainerProps): JSX.Element {
    const { children } = props;
    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={{ paddingBottom: 20 }}
        >
            {children}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 10,
        backgroundColor: Color.White,
    },
});
