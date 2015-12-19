module ui {
    export interface NavLinkProps extends React.HTMLProps {
        href: string;
        preserveScroll?: boolean;
        onClick?: React.MouseEventHandler;
    }

    export class NavLink extends React.Component<NavLinkProps, void> {
        public shouldComponentUpdate(nextProps: NavLinkProps, nextState: void, nextContext: any) {
            return nextProps !== this.props;
        }
        private onClick (e: React.MouseEvent) {
            if (typeof this.props.onClick == 'function') {
                if (this.props.onClick(e)) {
                    return;
                }
            }

            // https://github.com/yahoo/flux-router-component/blob/master/lib/NavLink.js
            if (isModifiedEvent(e) || !isLeftClickEvent(e)) {
                // this is a click with a modifier or not a left-click
                // let browser handle it natively
                return;
            }

            var href = this.props.href;
            if (href[0] === '#') {
                // this is a hash link url for page's internal links.
                // Do not trigger navigate action. Let browser handle it natively.
                return;
            }
            if (href[0] === '?') {
                // internal link, let's add path
                href = window.location.pathname + href
            }

            e.preventDefault();
            e.stopPropagation();
            ui.App.router.navigateTo(href, this.props.preserveScroll);
            var hash = href.split("#")[1];
            if (hash) {
                _.defer(() => {
                    var element = document.getElementById(hash);
                    if (element) {
                        element.scrollIntoView();
                    }
                })
            }
        }
        public render () {
            var a = React.DOM.a(this.props);
            return React.cloneElement(a, {onClick: (e) => this.onClick(e)} as React.HTMLAttributes);
        }
    }

    function isModifiedEvent (e: React.MouseEvent) {
        return !!(e.metaKey || e.altKey || e.ctrlKey || e.shiftKey);
    }

    function isLeftClickEvent (e: React.MouseEvent) {
        return e.button === 0;
    }

    export module DOM {
        export var NavLink = React.createFactory(ui.NavLink);
    }
}
