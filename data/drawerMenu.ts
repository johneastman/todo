import { CellSelect, MenuOption, SelectionValue } from "../types";

type DrawerMenuType = "BUTTON" | "DIVIDED_BUTTON" | "PICKER";

export interface DrawerMenu {
    type: DrawerMenuType;
}

export class DrawerMenuButton implements DrawerMenu {
    type: DrawerMenuType = "BUTTON";
    menuOption: MenuOption;

    constructor(menuOption: MenuOption) {
        this.menuOption = menuOption;
    }
}

export class DrawerMenuDividedButton implements DrawerMenu {
    type: DrawerMenuType = "DIVIDED_BUTTON";
    first: MenuOption;
    second: MenuOption;
    constructor(first: MenuOption, second: MenuOption) {
        this.first = first;
        this.second = second;
    }
}

export class DrawerMenuPicker implements DrawerMenu {
    type: DrawerMenuType = "PICKER";
    placeHolder: string;
    data: [CellSelect, number[]][];
    runAction: (incides: number[]) => void;
    constructor(
        placeHolder: string,
        data: [CellSelect, number[]][],
        runAction: (incides: number[]) => void
    ) {
        this.placeHolder = placeHolder;
        this.data = data;
        this.runAction = runAction;
    }
}
