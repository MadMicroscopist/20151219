module ui {
    // inspired by https://github.com/acdlite/flummox/blob/master/docs/api/FluxComponent.md

    /* example usage
        class SimpleContainer extends FluxSimpleContainer {
            stores = {
                userStore: App.userStore,
            }
            getState = () => ({
                users: this.stores.userStore.getUsers(),
            })
            state = this.getState()
            render = () => React.DOM.div({},
                "There are " + this.state.users.length + " users."
            )
        }
    */

    type subscribable = {
        on(event: string, listener: Function): EventEmitter2;
        off(event: string, listener: Function): EventEmitter2;
    };
    type storeDictionary = _.Dictionary<subscribable>;

    type emptyObj = {}

    export class FluxCompleteContainer<P, S> extends React.Component<P, S> {
        private _isMounted = false;
        protected stores: {}; // we have to throw types here
        getState: () => S;
        private subscribeToStores() {
            _.each(this.stores as storeDictionary, (store) => { // restore types
                store.on('changed', this.onStoreUpdate);
            });
        }
        private unsubscribeFromStores() {
            _.each(this.stores as storeDictionary, (store) => { // restore types
                store.off('changed', this.onStoreUpdate);
            });
        }
        private onStoreUpdate = () => {
            var getState = this.getState;
            if (getState) {
                // to accomodate for case if component is unmounted by the same 'changed' event
                if (this._isMounted) {
                    this.setState(getState());
                }
            } else {
                console.error("getState isn't implmented on ", this);
            }
        }
        constructor(p: P, context: any) {
            super(p, context);
            var _component: React.ComponentLifecycle<P, S> = this;
            // subscribe
            var componentDidMountChild = _component.componentDidMount;
            _component.componentDidMount = () => {
                this._isMounted = true;
                this.subscribeToStores();
                componentDidMountChild && componentDidMountChild()
            }
            // unsubscribe
            var componentWillUnmountChild = _component.componentWillUnmount;
            _component.componentWillUnmount = () => {
                this._isMounted = false;
                this.unsubscribeFromStores();
                componentWillUnmountChild && componentWillUnmountChild()
            }
            // pure render mixin
            _component.shouldComponentUpdate = React.addons.PureRenderMixin.shouldComponentUpdate;
        }
    }

    export class FluxContainer<P> extends FluxCompleteContainer<P, emptyObj> {}

    export class FluxSimpleContainer extends FluxCompleteContainer<emptyObj, emptyObj> {}

    // not exacly flux container
    export class PureRender<P, S> extends React.Component<P, S> {
        constructor(p: P, context: any) {
            super(p, context);
            var _component: React.ComponentLifecycle<P, S> = this;
            // pure render mixin
            _component.shouldComponentUpdate = React.addons.PureRenderMixin.shouldComponentUpdate;
        }
    }
    export class PureComponent<P> extends PureRender<P, emptyObj> {}
}
