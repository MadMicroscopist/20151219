/// <reference path="../underscore.d.ts" />
/// <reference path="../react-global.d.ts" />
/// <reference path="../react.d.ts" />
/// <reference path="../jquery.d.ts" />
/// <reference path="../trackjs.d.ts" />
/// <reference path="../NProgress" />
/// <reference path="../core/App.ts" />
/// <reference path="AppBody" />

module ui {

    if (typeof trackJs === 'object') {
        trackJs.configure({version: core.WEB_RELEASE_VERSION});
    }

    export var App = new core.App();

    $(() => {
        $('#sameroom').each((i: number, elem: Element) =>
            ReactDOM.render(<ui.AppBody />, elem));
    });
}
