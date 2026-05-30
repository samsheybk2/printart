const fs = require('fs');
const path = require('path');

const imgDir = path.join(__dirname, '..', 'img');
const outputFile = path.join(__dirname, '..', 'js', 'gallery-data.js');

const categoryMap = {
    lamina: 'Láminas',
    lapbook: 'Lapbooks',
    marca: 'Identidad de marca',
    cartelera: 'Carteleras',
};

const categoryIcons = {
    lamina: 'fa-brain',
    lapbook: 'fa-book-open',
    marca: 'fa-palette',
    cartelera: 'fa-chart-bar',
};

const categoryGradients = {
    lamina: 'linear-gradient(135deg, #f4d4d4, #e8b4b4)',
    lapbook: 'linear-gradient(135deg, #f5f0e8, #e8dcc8)',
    marca: 'linear-gradient(135deg, #d4d4f4, #b4b4e8)',
    cartelera: 'linear-gradient(135deg, #e8d4f4, #d4b4e8)',
};

const defaultGradient = 'linear-gradient(135deg, #d4e8f4, #b4d4e8)';
const defaultIcon = 'fa-image';

function slugToTitle(slug) {
    return slug
        .replace(/[-_]/g, ' ')
        .replace(/\b\w/g, c => c.toUpperCase())
        .trim();
}

if (!fs.existsSync(imgDir)) {
    fs.mkdirSync(imgDir, { recursive: true });
}

const files = fs.readdirSync(imgDir)
    .filter(f => /\.webp$/i.test(f) && f !== 'icono.webp')
    .sort();

const items = files.map((file, index) => {
    const name = path.parse(file).name;
    let category = 'all';
    let title = slugToTitle(name);

    for (const prefix of Object.keys(categoryMap)) {
        if (name.startsWith(prefix + '-') || name.startsWith(prefix + '_')) {
            category = prefix;
            title = slugToTitle(name.slice(prefix.length + 1));
            break;
        }
    }

    return {
        id: index + 1,
        src: `img/${file}`,
        category,
        title,
        gradient: categoryGradients[category] || defaultGradient,
        icon: categoryIcons[category] || defaultIcon,
    };
});

const output = `window.GALLERY_DATA = ${JSON.stringify(items, null, 2)};\n`;

fs.writeFileSync(outputFile, output, 'utf-8');
console.log(`✓ Gallery data generated: ${items.length} images`);
console.log(`  → ${outputFile}`);
