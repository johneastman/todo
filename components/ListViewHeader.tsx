import { View, Text, StyleSheet } from "react-native";
import CustomCheckBox from "./CustomCheckBox";
import Header from "./Header";

interface ListViewHeaderProps {
    title: string;

    isAllSelected: boolean;
    onChecked: (isChecked: boolean) => void;

    right?: React.ReactNode;
}

export default function ListViewHeader(
    props: ListViewHeaderProps
): JSX.Element {
    const { title, isAllSelected, onChecked, right } = props;

    return (
        <View style={styles.menu}>
            <Header text={title} />
            <View
                style={{ flexDirection: "row", gap: 10, alignItems: "center" }}
            >
                <View
                    style={{
                        flex: 1,
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <View>
                        <CustomCheckBox
                            label={"Select All"}
                            isChecked={isAllSelected}
                            onChecked={onChecked}
                        />
                    </View>
                    <View
                        style={{
                            flex: 1,
                            flexDirection: "row",
                            gap: 10,
                            justifyContent: "flex-end",
                        }}
                    >
                        {right}
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    menu: {
        paddingVertical: 24,
        paddingHorizontal: 20,
        backgroundColor: "lightblue",
        alignItems: "center",
        gap: 10,
    },
});
