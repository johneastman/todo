import { View, Text, StyleSheet } from "react-native";
import CustomCheckBox from "./CustomCheckBox";

interface ListViewHeaderProps {
    title: string;

    isAllSelected: boolean;
    onChecked: (isChecked: boolean) => void;

    right?: React.ReactNode;

    children?: React.ReactNode;
}

export default function ListViewHeader(
    props: ListViewHeaderProps
): JSX.Element {
    const { title, isAllSelected, onChecked, right, children } = props;

    return (
        <View style={styles.menu}>
            <Text style={{ fontSize: 20 }}>{title}</Text>

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
            <View>{children}</View>
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
