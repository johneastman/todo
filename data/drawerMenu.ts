import { MenuOption } from "../types";

type DrawerMenuType = "BUTTON" | "DIVIDED_BUTTON";

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
