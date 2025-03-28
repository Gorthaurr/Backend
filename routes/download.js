const path = require('path');
const fs = require('fs');

exports.downloadFile = (req, res) => {
    const filePath = path.join(__dirname, '..', 'files', decodeURIComponent(req.params.file));
    console.log('Попытка скачивания файла:', {
        requestedFile: req.params.file,
        fullPath: filePath,
        exists: fs.existsSync(filePath)
    });
    
    if (!fs.existsSync(filePath)) {
        console.error('Файл не найден:', filePath);
        return res.status(404).json({ message: 'Файл не найден' });
    }

    const stat = fs.statSync(filePath);
    const fileSize = stat.size;
    const range = req.headers.range;

    console.log('Информация о файле:', {
        size: fileSize,
        range: range,
        headers: req.headers
    });

    if (range) {
        const parts = range.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
        const chunksize = (end - start) + 1;
        const file = fs.createReadStream(filePath, { start, end });
        const head = {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunksize,
            'Content-Type': 'application/octet-stream',
        };
        res.writeHead(206, head);
        file.pipe(res);
    } else {
        const head = {
            'Content-Length': fileSize,
            'Content-Type': 'application/octet-stream',
        };
        res.writeHead(200, head);
        fs.createReadStream(filePath).pipe(res);
    }
};