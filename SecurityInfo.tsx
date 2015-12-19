/// <reference path="../underscore.d.ts" />
/// <reference path="../react.d.ts" />

module ui {
    export class SecurityInfo extends PureComponent<React.HTMLAttributes> {
        public render () {
            return <div {...this.props}>
                <p className="small" style={{marginTop: 10, marginBottom: 20, textAlign: "right"}}>
                    <a href="https://sameroom.io/blog/sameroom-security-overview/" target="_blank">
                        Security info
                    </a>
                </p>
            </div>
        }
    }
}
