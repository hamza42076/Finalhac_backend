import 'dotenv/config';

// We use dynamic imports to prevent the server from crashing if the packages are not installed
let cloudinary;
let CloudinaryStorage;
let multer;
let upload;
let cloudinaryConfigured = false;

const initCloudinary = async () => {
    try {
        // Try to import the packages
        const cloudinaryModule = await import('cloudinary');
        const storageModule = await import('multer-storage-cloudinary');
        const multerModule = await import('multer');

        cloudinary = cloudinaryModule.v2;
        CloudinaryStorage = storageModule.CloudinaryStorage;
        multer = multerModule.default;

        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
        });

        const storage = new CloudinaryStorage({
            cloudinary: cloudinary,
            params: {
                folder: 'clinic_reports',
                allowed_formats: ['jpg', 'png', 'pdf'],
            },
        });

        upload = multer({ storage: storage });
        cloudinaryConfigured = true;
        console.log("✅ Cloudinary initialized successfully.");
    } catch (error) {
        console.warn("⚠️ Cloudinary packages missing. Using mock upload fallback.");

        // Mock Multer middleware that does nothing but pass the request through
        const mockMulter = () => (req, res, next) => {
            req.file = {
                path: 'https://via.placeholder.com/150?text=Mock+Upload+URL',
                originalname: 'mock-file.pdf'
            };
            next();
        };

        upload = {
            single: () => mockMulter(),
            array: () => mockMulter(),
            fields: () => mockMulter(),
        };
    }
};

// Initialize immediately
await initCloudinary();

export { cloudinary, upload, cloudinaryConfigured };
