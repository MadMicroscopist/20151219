/// <reference path="../underscore.d.ts" />
/// <reference path="../react.d.ts" />
/// <reference path="FluxContainer" />

module ui {

    export interface ZeroClipboardProps extends React.HTMLProps {
        "data-clipboard-text": string;
        render(state: ZeroClipboardState): React.ReactNode;
    }

    export interface ZeroClipboardState {
        status: string; // initial, ready, beforecopy, copy, aftercopy, done
    }

    export class ZeroClipboard extends PureRender<ZeroClipboardProps, ZeroClipboardState> implements core.ZeroClipboardComponent {
        private debounce: Function;
        public beMounted = false;
        public state = ({
            status: 'initial'
        });
        public componentWillMount() {
            this.debounce = _.debounce(() => {
                if (this.state.status === 'aftercopy') {
                    this.beMounted && this.setState({status: 'done'});
                }
            }, 1500);
        }
        public componentDidMount() {
            this.beMounted = true;
            this.clipReferences();
        }
        public componentWillUnmount() {
            this.beMounted = false;
            ui.App.zeroClipboard.unclip(this);
        }
        public componentDidUpdate() {
            this.clipReferences();
        }
        private clipReferences() {
            // it is safe to call this on already clipped element
            ui.App.zeroClipboard.clip(this);
        }
        public onZeroClipBoard(e: core.ZeroClipboardEvent) {
            this.setState({status: e.type}, () => this.debounce());
        }
        public render() {
            return React.DOM.div(
                this.props,
                this.props.render(this.state),
                this.props.children
            );
        }
    }

    export module DOM {
        export var ZeroClipboard = React.createFactory(ui.ZeroClipboard);
    }
}
