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

        // Handle version 1.x and 2.x import differences
        cloudinary = cloudinaryModule.v2 || (cloudinaryModule.default && cloudinaryModule.default.v2) || cloudinaryModule.default;
        CloudinaryStorage = storageModule.CloudinaryStorage;
        multer = multerModule.default;

        if (!cloudinary || typeof cloudinary.config !== 'function') {
            throw new Error("Cloudinary library v2 object not found in the imported module.");
        }

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
        console.warn("⚠️ Cloudinary initialization failed:", error.message);
        console.warn("Using mock upload fallback.");

        // Mock Multer middleware that does nothing but pass the request through
        const mockMulter = () => (req, res, next) => {
            req.file = {
                // A 1x1 transparent Base64 PNG to avoid ERR_NAME_NOT_RESOLVED
                path: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==',
                originalname: 'mock-file.png'
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
