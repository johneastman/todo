import { useNavigation } from "@react-navigation/core";
import { ImageAttribution, LegalPageNavigationProp } from "../../types";
import {
    Image,
    Linking,
    Text,
    View,
    StyleSheet,
    FlatList,
    ListRenderItemInfo,
} from "react-native";
import Header from "../Header";
import { LIGHT_BLUE_BUTTON, LIGHT_GREY } from "../../utils";

export default function LegalPage(): JSX.Element {
    const navigation = useNavigation<LegalPageNavigationProp>();

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
    ];

    const renderItem = (params: ListRenderItemInfo<ImageAttribution>) => {
        const {
            item: {
                hyperlink: { text, url },
                image,
            },
        } = params;

        return (
            <View style={styles.cellContainer}>
                <View style={styles.imageContainer}>
                    <Image source={image} style={styles.image} />
                </View>
                <Text
                    style={styles.hyperlink}
                    onPress={() => Linking.openURL(url)}
                >
                    {text}
                </Text>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <Header text="Asset Attributions" style={styles.header} />
            <FlatList data={assetAttributions} renderItem={renderItem} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 10,
    },
    header: { fontWeight: "bold" },
    cellContainer: {
        flexDirection: "row",
        gap: 10,
        alignItems: "center",
        paddingVertical: 5,
    },
    imageContainer: { padding: 5, backgroundColor: LIGHT_GREY },
    image: { width: 50, height: 50 },
    hyperlink: { flex: 1, color: LIGHT_BLUE_BUTTON, fontSize: 20 },
});
