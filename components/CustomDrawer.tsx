import { View } from "react-native";

interface CustomDrawerProps {
    isVisible: boolean;
    percentWidth: number; // How much of the screen the drawer should take up
    children?: React.ReactNode;
}

export default function CustomDrawer(props: CustomDrawerProps): JSX.Element {
    const { isVisible, percentWidth, children } = props;

    const width: number = percentWidth;
    const marginWidth: number = 100 - width;

    return (
        <>
            {isVisible && (
                <View
                    style={{
                        position: "absolute",
                        height: "100%",
                        width: `${width}%`,
                        marginLeft: `${marginWidth}%`,
                        backgroundColor: "white",
                        zIndex: 1,
                    }}
                >
                    {children}
                </View>
            )}
        </>
    );
}
