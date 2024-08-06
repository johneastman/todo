import { useNavigation } from "@react-navigation/core";
import { ImageAttribution, LegalPageNavigationProps } from "../../types";
import { Image, Linking, View, StyleSheet } from "react-native";
import { Color } from "../../utils";
import CustomFlatList from "../core/CustomFlatList";
import PageContainer from "../PageContainer";
import CustomText, { TextSize } from "../core/CustomText";

export default function LegalPage(): JSX.Element {
    const navigation = useNavigation<LegalPageNavigationProps>();

    const assetAttributions: ImageAttribution[] = [
        {
            hyperlink: {
                text: "Next icons created by Roundicons -   Flaticon",
                url: "https://www.flaticon.com/free-icons/next",
            },
            image: require("../../assets/right-arrow.png"),
        },
        {
            hyperlink: {
                text: "Tick icons created by Maxim Basinski Premium - Flaticon",
                url: "https://www.flaticon.com/free-icons/tick",
            },
            image: require("../../assets/check.png"),
        },
        {
            hyperlink: {
                text: "To-do-list icons created by Graphics Plazza - Flaticon",
                url: "https://www.flaticon.com/free-icons/to-do-list",
            },
            image: require("../../assets/icons/android/playstore-icon.png"),
        },
        {
            hyperlink: {
                text: "Lock icons created by Aswell Studio - Flaticon",
                url: "https://www.flaticon.com/free-icons/lock",
            },
            image: require("../../assets/lock.png"),
        },
        {
            hyperlink: {
                text: "Edit icons created by Pixel perfect - Flaticon",
                url: "https://www.flaticon.com/free-icons/edit",
            },
            image: require("../../assets/edit.png"),
        },
        {
            hyperlink: {
                text: "Trash icons created by Freepik - Flaticon",
                url: "https://www.flaticon.com/free-icons/trash",
            },
            image: require("../../assets/bin.png"),
        },
    ];

    const renderItem = (imageAttribution: ImageAttribution, index: number) => {
        const {
            hyperlink: { text, url },
            image,
        } = imageAttribution;

        const openUrl = () => Linking.openURL(url);

        return (
            <View style={styles.cellContainer}>
                <View style={styles.imageContainer}>
                    <Image source={image} style={styles.image} />
                </View>
                <CustomText
                    text={text}
                    size={TextSize.Medium}
                    onPress={openUrl}
                    style={{ flex: 1, color: Color.LightBlueButton }}
                />
            </View>
        );
    };

    return (
        <PageContainer>
            <CustomText
                text="Asset Attributions"
                style={styles.header}
                size={TextSize.Medium}
            />
            <CustomFlatList
                data={assetAttributions}
                renderElement={renderItem}
            />
        </PageContainer>
    );
}

const styles = StyleSheet.create({
    header: { fontWeight: "bold" },
    cellContainer: {
        flexDirection: "row",
        gap: 10,
        alignItems: "center",
        paddingVertical: 5,
    },
    imageContainer: { padding: 5, backgroundColor: Color.LightGray },
    image: { width: 50, height: 50 },
});
