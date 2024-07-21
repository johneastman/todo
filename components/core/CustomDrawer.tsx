import { Pressable, View } from "react-native";
import { Color } from "../../utils";

type CustomDrawerProps = {
    isVisible: boolean;
    setIsVisible: (isVisible: boolean) => void;
    percentWidth: number; // How much of the screen the drawer should take up
    children?: React.ReactNode;
};

export default function CustomDrawer(props: CustomDrawerProps): JSX.Element {
    const { isVisible, setIsVisible, percentWidth, children } = props;

    const width: number = percentWidth;
    const marginWidth: number = 100 - width;

    return (
        <>
            {isVisible && (
                <>
                    <View
                        // Drawer View
                        style={{
                            position: "absolute",
                            height: "100%",
                            width: `${width}%`,
                            marginLeft: `${marginWidth}%`,
                            backgroundColor: Color.White,
                            zIndex: 1,
                        }}
                    >
                        {children}
                    </View>

                    <Pressable
                        // Part of screen not covered by the drawer. It blocks interaction with
                        // elements under the drawer. Pressing this area closes the drawer.
                        style={{
                            position: "absolute",
                            height: "100%",
                            width: `${marginWidth}%`,
                            marginRight: `${width}%`,
                            backgroundColor: Color.Gray,
                            opacity: 0.3,
                            zIndex: 1,
                        }}
                        onPress={() => setIsVisible(false)}
                    />
                </>
            )}
        </>
    );
}
