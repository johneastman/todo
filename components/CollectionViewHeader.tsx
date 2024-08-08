import { View, StyleSheet, Button } from "react-native";
import { CollectionViewCellType } from "../types";
import { useContext } from "react";
import { LoginContext } from "../contexts/loginState.context";
import { Color } from "../utils";
import CustomText, { TextSize } from "./core/CustomText";

type CollectionViewHeaderProps = {
    title: string;
    collectionType: CollectionViewCellType;
    setAddUpdateModalVisible: (isVisible: boolean, cellIndex: number) => void;
};

export default function CollectionViewHeader(
    props: CollectionViewHeaderProps
): JSX.Element {
    const { title, collectionType, setAddUpdateModalVisible } = props;

    const {
        loginState: { username },
    } = useContext(LoginContext);

    const openModal = () => setAddUpdateModalVisible(true, -1);

    return (
        <View style={styles.menu}>
            <View style={styles.contentWrapper}>
                <View>
                    {username !== undefined && (
                        <CustomText
                            text={username}
                            style={styles.username}
                            size={TextSize.Medium}
                        />
                    )}
                    <CustomText text={title} size={TextSize.Medium} />
                </View>
                <View style={styles.leftWrapper}>
                    <Button
                        title={`Add ${collectionType}`}
                        onPress={openModal}
                    />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    menu: {
        flexDirection: "row",
        paddingVertical: 24,
        paddingHorizontal: 20,
        backgroundColor: Color.LightBlue,
        alignItems: "center",
        gap: 10,
    },
    contentWrapper: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    username: { fontWeight: "bold" },
    leftWrapper: {
        flex: 1,
        flexDirection: "row",
        gap: 10,
        justifyContent: "flex-end",
    },
});
