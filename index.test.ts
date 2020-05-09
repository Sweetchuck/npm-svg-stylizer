import xmlJs from 'xml-js';
import SvgStylizer  from './index';

interface RemoveAllStyleElementTestCase {
    description: string;
    svgString: string;
    expectedSvgString: string;
}

interface ToSvgStringTestCase extends RemoveAllStyleElementTestCase {
    styleAttributes: xmlJs.Attributes;
    cssString: string;
}

const svgTemplate: string =
    '<?xml version="1.0" encoding="UTF-8" standalone="no"?>\n' +
    '<!-- Created with Inkscape (http://www.inkscape.org/) -->\n' +
    '<svg>\n' +
    '{style}' +
    '    <defs id="defs1"/>\n' +
    '    <g id="layer1">\n' +
    '        <rect class="red" id="rect10" width="114" height="90" x="28" y="18"/>\n' +
    '    </g>\n' +
    '</svg>';

describe(
    'SvgStylizer.toSvgString',
    () => {
        const cases: Array<ToSvgStringTestCase> = [
            {
                description: 'empty',
                svgString: '',
                styleAttributes: {},
                cssString: '',
                expectedSvgString: '',
            },
            {
                description: 'without root element',
                svgString: '<?xml version="1.0" encoding="UTF-8" standalone="no"?>',
                styleAttributes: {},
                cssString: '',
                expectedSvgString: '<?xml version="1.0" encoding="UTF-8" standalone="no"?>',
            },
            {
                description: 'without any initial style tags and no additional CSS',
                svgString: svgTemplate.replace('{style}', ''),
                styleAttributes: {},
                cssString: '',
                expectedSvgString: svgTemplate.replace('{style}', ''),
            },
            {
                description: 'without any initial style tags with additional CSS',
                svgString: svgTemplate.replace('{style}', ''),
                styleAttributes: {},
                cssString: '.after { height: 82px; }',
                expectedSvgString: svgTemplate.replace(
                    '{style}',
                    '    <style>\n' +
                    '        .after { height: 82px; }\n' +
                    '    </style>\n'
                ),
            },
            {
                description: 'with an initial style tag but with empty cssString',
                svgString: svgTemplate.replace(
                    '{style}',
                    '    <style>\n' +
                    '        .before { width: 42px; }\n' +
                    '    </style>\n'
                ),
                styleAttributes: {},
                cssString: '',
                expectedSvgString: svgTemplate.replace(
                    '{style}',
                    '    <style>\n' +
                    '        \n' +
                    '        .before { width: 42px; }\n' +
                    '    \n' +
                    '    </style>\n'
                ),
            },
            {
                description: 'append',
                svgString: svgTemplate.replace(
                    '{style}',
                    '    <style>\n' +
                    '        .before { width: 42px; }\n' +
                    '    </style>\n'
                ),
                styleAttributes: {},
                cssString: '.after { height: 84px; }\n',
                expectedSvgString: svgTemplate.replace(
                    '{style}',
                    '    <style>\n' +
                    '        \n' +
                    '        .before { width: 42px; }\n' +
                    '    \n' +
                    '        .after { height: 84px; }\n' +
                    '    </style>\n'
                ),
            },
            {
                description: 'attributes',
                svgString: svgTemplate.replace(
                    '{style}',
                    '    <style media="print">\n' +
                    '        .before { width: 42px; }\n' +
                    '    </style>\n'
                ),
                styleAttributes: {
                    media: 'screen'
                },
                cssString: '.after { height: 84px; }\n',
                expectedSvgString: svgTemplate.replace(
                    '{style}',
                    '    <style media="print">\n' +
                    '        \n' +
                    '        .before { width: 42px; }\n' +
                    '    \n' +
                    '    </style>\n' +
                    '    <style media="screen">\n' +
                    '        .after { height: 84px; }\n' +
                    '    </style>\n'
                ),
            },
            {
                description: 'append to a specific style',
                svgString: svgTemplate.replace(
                    '{style}',
                    '    <style media="print">\n' +
                    '        .print { width: 42px; }\n' +
                    '    </style>\n' +
                    '    <style media="screen">\n' +
                    '        .screen-1 { width: 42px; }\n' +
                    '    </style>\n' +
                    '    <style media="projection">\n' +
                    '        .projection { width: 42px; }\n' +
                    '    </style>\n'
                ),
                styleAttributes: {
                    media: 'screen'
                },
                cssString: '.screen-2 { height: 84px; }\n',
                expectedSvgString: svgTemplate.replace(
                    '{style}',
                    '    <style media="print">\n' +
                    '        \n' +
                    '        .print { width: 42px; }\n' +
                    '    \n' +
                    '    </style>\n' +
                    '    <style media="screen">\n' +
                    '        \n' +
                    '        .screen-1 { width: 42px; }\n' +
                    '    \n' +
                    '        .screen-2 { height: 84px; }\n' +
                    '    </style>\n' +
                    '    <style media="projection">\n' +
                    '        \n' +
                    '        .projection { width: 42px; }\n' +
                    '    \n' +
                    '    </style>\n'
                ),
            },
        ];

        for (const c of cases) {
            it(
                c.description,
                () => {
                    const svgStylizer = new SvgStylizer();
                    svgStylizer
                        .initFromString(c.svgString)
                        .addCssString(c.cssString, c.styleAttributes)
                    expect(svgStylizer.toSvgString()).toEqual(c.expectedSvgString);
                }
            );
        }
    }
);

describe(
    'SvgStylizer.removeAllStyleElement',
    () => {
        const cases: Array<RemoveAllStyleElementTestCase> = [
            {
                description: 'empty',
                svgString: svgTemplate.replace('{style}', ''),
                expectedSvgString: svgTemplate.replace('{style}', ''),
            },
            {
                description: 'basic',
                svgString: svgTemplate.replace(
                    '{style}',
                    '    <style>\n' +
                    '        .a { width: 1px; }\n' +
                    '    </style>\n' +
                    '    <style>\n' +
                    '        .b { width: 2px; }\n' +
                    '    </style>\n' +
                    '    <style>\n' +
                    '        .c { width: 3px; }\n' +
                    '    </style>\n'
                ),
                expectedSvgString: svgTemplate.replace('{style}', ''),
            },
        ];

        for (const c of cases) {
            it(
                c.description,
                () => {
                    const svgStylizer = new SvgStylizer();
                    svgStylizer.initFromString(c.svgString)
                    svgStylizer.removeAllStyleElement()
                    expect(svgStylizer.toSvgString()).toEqual(c.expectedSvgString);
                }
            );
        }
    }
);
