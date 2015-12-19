/// <reference path="../underscore.d.ts" />
/// <reference path="../react.d.ts" />

module ui {
    interface CenteredColumnTemplateProps extends React.HTMLAttributes {
        className?: string;
        kind?: string;
    }

    export class CenteredColumnTemplate extends PureComponent<CenteredColumnTemplateProps> {
        private placingClass = 'col-sm-offset-1 col-sm-10 '
                             + 'col-md-offset-2 col-md-8 '
                             + 'col-lg-offset-3 col-lg-6';
        private placingClasB = 'col-sm-offset-0 col-sm-12 '
                             + 'col-md-offset-2 col-md-8';
        public render () {
            var placingClass = this.placingClass;
            if (this.props.kind === 'big') {
                placingClass = this.placingClasB;
            }
            var props = _.defaults({
                    className: classNames(placingClass, this.props.className)
                }, this.props);
            return React.DOM.div(props)
        }
    }

    export module DOM {
        export var CenteredColumnTemplate = React.createFactory(ui.CenteredColumnTemplate);
    }
}
