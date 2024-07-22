import { View } from "react-native";
import { MenuOption } from "../types";
import CustomDrawer from "./core/CustomDrawer";
import MenuOptionView from "./MenuOptionView";

type CollectionPageDrawerProps = {
    isVisible: boolean;
    setIsVisible: (isVisible: boolean) => void;
    topMenuOptions: MenuOption[];
    bottomMenuOptions: MenuOption[];
    menuActionWrapper: (action: () => void) => void;
};

export default function CollectionPageDrawer(props: CollectionPageDrawerProps) {
    const {
        isVisible,
        setIsVisible,
        topMenuOptions,
        bottomMenuOptions,
        menuActionWrapper,
    } = props;

    return (
        <CustomDrawer
            isVisible={isVisible}
            setIsVisible={setIsVisible}
            percentWidth={70}
        >
            <View
                style={{
                    height: "100%",
                    justifyContent: "space-between",
                }}
            >
                <MenuOptionView
                    menuOptions={topMenuOptions}
                    menuActionWrapper={menuActionWrapper}
                    style={{ borderBottomWidth: 1 }}
                />

                <MenuOptionView
                    menuOptions={bottomMenuOptions}
                    menuActionWrapper={menuActionWrapper}
                    style={{ borderTopWidth: 1 }}
                />
            </View>
        </CustomDrawer>
    );
}
