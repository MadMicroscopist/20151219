/// <reference path="../underscore.d.ts" />
/// <reference path="../react.d.ts" />

module ui {

    export interface ProviderLogoProps {
        providerId: string;
        isBw: boolean;
        style: React.CSSProperties;
    }

    export class ProviderLogo extends PureComponent<ProviderLogoProps> {
        public render () {
            var providerId = this.props.providerId;
            var style = _.omit(this.props.style, 'src');
            var path = this.props.isBw ? 'bw' : 'colored';
            style.src = CDNify('/img/providers/' + path + '/' + encodeURIComponent(providerId) + '.png');
            style = _.defaults(style, {title: providerId, alt: providerId});
            return React.DOM.img(style);
        }
    }

    export module DOM {
        export var ProviderLogo = React.createFactory(ui.ProviderLogo);
    }
}
