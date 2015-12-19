/// <reference path="../core/App.ts" />

interface Window { twttr: any; };

module ui {
    export class TwitterConversionTracking extends PureComponent<{}> {
        public componentDidMount () {
            var id = core.TWITTER_TRACKING_ID;
            if (id) {
                var dom = ReactDOM.findDOMNode(this);
                var script   = document.createElement("script");
                script.type  = "text/javascript";
                script.src   = "//platform.twitter.com/oct.js";
                script.onload = () => {
                    window.twttr.conversion.trackPid(id, { tw_sale_amount: 0, tw_order_quantity: 0 });
                };
                dom.appendChild(script);
            }
        }
        public render() {
            return React.DOM.div({});
        }
    }

    export module DOM {
        export var TwitterConversionTracking = React.createFactory(ui.TwitterConversionTracking);
    }
}
