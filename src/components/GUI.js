import * as dat from 'dat.gui'

const gui = new dat.GUI({ width: 400 });

export const Gui = (folderName) => {
    return gui.addFolder(folderName);
}
