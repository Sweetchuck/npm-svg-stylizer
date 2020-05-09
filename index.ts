import fs from 'fs';
import xmlJs from 'xml-js';
import _ from 'lodash';
import indentString from "indent-string";

export default class SvgStylizer {
    protected svg: xmlJs.Element = {};

    protected svgRootElement: xmlJs.Element = {};

    protected xmlToJsOptions: xmlJs.Options.XML2JS = {
        compact: false,
    };

    public jsToXmlOptions: xmlJs.Options.JS2XML = {
        indentAttributes: false,
        indentText: true,
        spaces: 4,
    };

    protected readFileOptions = {
        encoding: 'utf8',
    };

    public initFromFile(svgFileName: string): this {
        this.initFromString(fs.readFileSync(svgFileName, this.readFileOptions));

        return this;
    }

    public initFromString(svgString: string): this {
        this.svg = xmlJs.xml2js(svgString, this.xmlToJsOptions) as xmlJs.Element;
        this.svgRootElement = {};
        const root = this.findFirstElementByType(this.svg.elements || [], 'element');
        if (typeof root !== 'undefined') {
            this.svgRootElement = root;
        }

        this.svgRootElement.elements = this.svgRootElement.elements || [];

        return this;
    }

    public removeAllStyleElement(): this {
        this.assertSvgRootElement();
        const elements = this.svgRootElement.elements || [];
        for (let i = elements.length - 1; i >= 0; i--) {
            const element: xmlJs.Element = elements[i];
            if (element.type === 'element' && element.name === 'style') {
                this.svgRootElement.elements?.splice(i, 1);
            }
        }

        return this;
    }

    public addCssFile(cssFileName: string, attributes: xmlJs.Attributes = {}): this {
        this.addCssString(
            fs.readFileSync(cssFileName, this.readFileOptions),
            attributes
        );

        return this;
    }

    public addCssString(cssString: string, attributes: xmlJs.Attributes = {}): this {
        if (cssString === '') {
            return this;
        }

        this.assertSvgRootElement();

        cssString = _.trim(indentString(cssString, 8));
        let styleElement = this.findStyleElement(attributes);
        if (typeof styleElement === 'undefined') {
            styleElement = {
                type: 'element',
                name: 'style',
                attributes: attributes,
                elements: [
                    {
                        type: 'text',
                        text: cssString,
                    }
                ],
            };

            this.svgRootElement.elements?.splice(
                this.indexOfLastStyleElement() + 1,
                0,
                styleElement
            );

            return this;
        }

        styleElement.elements = styleElement.elements || [];
        styleElement.elements.push({
            type: 'text',
            text: cssString,
        });

        return this;
    }

    public toSvgString(): string {
        this.assertSvgRootElement();

        return xmlJs.js2xml(this.svg, this.jsToXmlOptions);
    }

    protected findStyleElement(attributes: xmlJs.Attributes): xmlJs.Element | undefined {
        for (const element of this.svgRootElement.elements || []) {
            if (
                element.type === 'element' &&
                element.name === 'style' &&
                _.isEqual(element.attributes || {}, attributes)
            ) {
                return element;
            }
        }

        return undefined;
    }

    protected findFirstElementByType(elements: Array<xmlJs.Element>, type: string): xmlJs.Element | undefined {
        for (const element of elements) {
            if (element.type === type) {
                return element;
            }
        }

        return undefined;
    }

    protected assertSvgRootElement(): void {
        if (this.svg === {} || this.svgRootElement === {}) {
            throw new TypeError('The SVG root element is not initialized');
        }
    }

    protected indexOfLastStyleElement(): number {
        const elements = this.svgRootElement.elements || [];
        for (let i = elements.length - 1; i >= 0; i--) {
            if (elements[i].type === 'element' && elements[i].name === 'style') {
                return i;
            }
        }

        return -1;
    }
}
