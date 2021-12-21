
function homeUrl(projectId: string, type: string) {
    return "/project/"+ projectId + "/" + type ;
}

function idUrl(projectId: string, id: string, type: string) {
    return "/project/"+ projectId + "/" + type + "/" + id;
}

export function PageUrl(projectId: string, id: string) {
    return idUrl(projectId, id, 'page');
}
export function PagePreviewUrl(projectId: string, id: string) {
    return idUrl(projectId, id, 'page') + '/preview';
}
export function PageHomeUrl(projectId: string) {
    return homeUrl(projectId, 'page');
}

export function ModelHomeUrl(projectId: string) {
    return homeUrl(projectId, 'model');
}
export function ModelUrl(projectId: string, id: string) {
    return idUrl(projectId, id, 'model');
}
export function ModelEditUrl(projectId: string, id: string) {
    return idUrl(projectId, id, 'model') + '/edit';
}

export function MenuHomeUrl(projectId: string) {
    return homeUrl(projectId, 'menu');
}




export function DictUrl(projectId: string, id: string) {
    return idUrl(projectId, id, 'dict');
}
export function DictEditUrl(projectId: string, id: string) {
    return idUrl(projectId, id, 'dict')+'/edit';
}


export function DictHome(projectId: string) {
    return homeUrl(projectId, 'dict');
}
export function DesignerPageUrl(projectId: string, id: string) {
    return idUrl(projectId, id, 'designer');
}


export function DesignerEditUrl(projectId: string, id: string) {
    return idUrl(projectId, id, 'designer')+'/edit';
}
export function DesignerSettingUrl(projectId: string, id: string) {
    return idUrl(projectId, id, 'designer')+'/setting';
}
export function DesignerDeployUrl(projectId: string, id: string) {
    return idUrl(projectId, id, 'designer')+'/deploy';
}