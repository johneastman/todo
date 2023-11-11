import CustomMenu from "./CustomMenu";
import { MenuData } from "../data/data";
import CustomMenuOption from "./CustomMenuOption";

interface ItemsPageMenuProps {
    menuData: MenuData[];
}

export default function ItemsPageMenu(props: ItemsPageMenuProps): JSX.Element {
    const { menuData } = props;

    return (
        <CustomMenu>
            {menuData.map((menuDatum: MenuData, index: number) => (
                <CustomMenuOption
                    text={menuDatum.text}
                    onSelect={menuDatum.onSelect}
                    disabled={menuDatum.disabled}
                    textStyle={menuDatum.textStyle}
                    key={index}
                />
            ))}
        </CustomMenu>
    );
}
