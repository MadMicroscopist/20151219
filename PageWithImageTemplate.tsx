/// <reference path="../underscore.d.ts" />
/// <reference path="../react.d.ts" />

module ui {

    export interface PageWithImageTemplateProps {
        imageId: string;
        header: string;
        description: React.ReactNode;
        children?: React.ReactNode;
    }

    export class PageWithImageTemplate extends PureComponent<PageWithImageTemplateProps>{
        render() {
            return React.DOM.div({className: 'page-with-image'},
                React.DOM.div({className: 'hidden-xs', style: {marginTop: 50}}),
                React.DOM.div({className: 'section-img-wrapper'},
                    React.DOM.div({className: 'section-img', style: {backgroundImage: CDNBackgroundImage('/img/' + encodeURIComponent(this.props.imageId) + '.png')}})
                ),
                React.DOM.div({className: 'container'},
                    DOM.CenteredColumnTemplate({className: 'text-center'},
                        React.DOM.h1({className: 'roboto-slab'}, this.props.header),
                        React.DOM.div({className: 'text-left description'}, this.props.description),
                        this.props.children,
                        React.DOM.div({className: 'clearfix'}),
                        React.DOM.div({className: 'hidden-xs', style: {marginTop: 140}})
                    )
                )
            );
        }
    }

    export module DOM {
        export var PageWithImageTemplate = React.createFactory(ui.PageWithImageTemplate);
    }
}
