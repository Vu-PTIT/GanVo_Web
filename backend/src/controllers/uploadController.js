

export const uploadImage = (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Không có file nào được tải lên' });
        }

        // Construct the URL. Assuming server serves static files from /uploads
        // You might need to adjust the protocol/host based on your environment or use a relative path
        const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

        return res.status(200).json({
            message: 'Tải ảnh thành công',
            url: fileUrl
        });
    } catch (error) {
        console.error('Upload Error:', error);
        return res.status(500).json({ message: 'Lỗi tải ảnh' });
    }
};
