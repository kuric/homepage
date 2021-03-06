const smartgrid = require('smart-grid');

const settings = {
    columns: 24,
    offset: '10px',
    container: {
        maxWidth: '950px',
        fields: '30px'
    },
    breakPoints: {
        lg: {
            width: "1300px",
            fields: "20px"
        },
        md: {
            width: "992px",
            fields: "20px"
        },
        sm: {
            width: "720px",
            fields: "10px"
        },
        xs: {
            width: "576px",
            fields: "5px"
        },
        xxs: {
            width: "380px",
            fields: "5px"
        }
    },
    oldSizeStyle: false,
    properties: [
        'justify-content'
    ]
};

smartgrid('./src/less', settings);