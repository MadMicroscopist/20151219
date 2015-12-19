module ui {
    export function CDNify(url: string) {
        return core.CDN_BASE + url + '?v=' + core.CDN_V;
    }

    export function CDNBackgroundImage(url: string) {
        return 'url("' + CDNify(url) + '")';
    }

    export function MysteriousIssue() {
        return <span>
            Oops! A mysterious issue took place—we’ll study the logs to understand what happened. Meanwhile, would you mind giving it another shot? If trouble persists, please <ui.NavLink href="/contact">contact us</ui.NavLink>.
        </span>;
    };

}
