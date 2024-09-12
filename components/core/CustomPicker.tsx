import {
    Modal,
    View,
    StyleSheet,
    Pressable,
    TouchableOpacity,
    Image,
    StyleProp,
    ViewStyle,
} from "react-native";
import CustomText, { TextSize } from "./CustomText";
import { useContext, useState } from "react";
import { Color } from "../../utils";
import { SelectionValue } from "../../types";
import CustomFlatList from "./CustomFlatList";
import { SettingsContext } from "../../contexts/settings.context";

type CustomPickerProps<T> = {
    data: SelectionValue<T>[];
    selectedValue?: T;
    onSelect: (value: T) => void;
    placeholder?: string;
    disabled?: boolean;
    testId?: string;
    style?: StyleProp<ViewStyle>;
};

export default function CustomPicker<T>(
    props: CustomPickerProps<T>
): JSX.Element {
    const {
        data,
        selectedValue,
        onSelect,
        placeholder,
        disabled,
        testId,
        style,
    } = props;

    const [isPickerVisible, setIsPickerVisible] = useState(false);

    const {
        settings: { isDeveloperModeEnabled },
    } = useContext(SettingsContext);

    return (
        <View
            style={[
                {
                    width: "100%",
                    ...(isDeveloperModeEnabled ? styles.devMode : {}),
                },
                style,
            ]}
        >
            <Pressable
                onPress={() => setIsPickerVisible(true)}
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingHorizontal: 5,
                    gap: 10,
                }}
                disabled={disabled}
                testID={testId}
            >
                <CustomText
                    text={
                        data.find((d) => d.value === selectedValue)?.label ??
                        placeholder
                    }
                    size={TextSize.Medium}
                    style={{ opacity: disabled ? 0.5 : 1 }}
                />
                <Image
                    source={require("../../assets/right-arrow.png")}
                    style={{
                        width: 10,
                        height: 10,
                        transform: [{ rotate: "90deg" }],
                        opacity: disabled ? 0.5 : 1,
                    }}
                />
            </Pressable>

            <Modal
                visible={isPickerVisible}
                transparent={true}
                animationType="none"
            >
                <TouchableOpacity
                    style={styles.centeredView}
                    onPress={() => setIsPickerVisible(false)}
                >
                    <View style={styles.modal}>
                        <CustomFlatList
                            data={data}
                            renderElement={(data) => (
                                <TouchableOpacity
                                    onPress={() => {
                                        onSelect(data.value);
                                        setIsPickerVisible(false);
                                    }}
                                    activeOpacity={1}
                                    testID={`${testId}-${data.label}`}
                                >
                                    <CustomText
                                        text={data.label}
                                        size={TextSize.Large}
                                    />
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modal: {
        width: "90%",
        margin: 20,
        backgroundColor: Color.White,
        shadowColor: Color.Black,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        gap: 10,
        padding: 10,
    },
    devMode: {
        borderColor: Color.LightGray,
        borderWidth: 1,
    },
});
