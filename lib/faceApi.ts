// @ts-nocheck
// face-api.js doesn't have great TypeScript support, so we'll use @ts-nocheck to avoid noisy errors.
import type { KnownFace } from '../types';

// Declare faceapi as a global constant to resolve "Cannot find name 'faceapi'" errors.
// This is necessary because face-api.js is loaded via a script tag and does not have proper TypeScript types.
declare const faceapi: any;

const MODEL_URL = 'https://justadudewhohacks.github.io/face-api.js/models';

let modelsLoaded = false;

/**
 * Loads the face-api.js models required for detection and recognition.
 */
export const loadFaceApiModels = async (): Promise<void> => {
    if (modelsLoaded) {
        return;
    }
    try {
        console.log("Loading face-api models...");
        await Promise.all([
            faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
            faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
            faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        ]);
        modelsLoaded = true;
        console.log("Face-api models loaded successfully.");
    } catch (error) {
        console.error("Error loading face-api models:", error);
        throw new Error("Could not load face recognition models. Please check the console for details.");
    }
};

/**
 * Generates face descriptors for a given image source (URL or File).
 * @param imageSource The URL or File of the image to process.
 * @returns A Float32Array of the face descriptor, or null if no face is found.
 */
export const extractFaceDescriptor = async (imageSource: string | File): Promise<Float32Array | null> => {
    if (!modelsLoaded) {
        await loadFaceApiModels();
    }
    try {
        let img;
        if (typeof imageSource === 'string') {
            img = await faceapi.fetchImage(imageSource);
        } else {
            img = await faceapi.bufferToImage(imageSource);
        }
        
        const detection = await faceapi.detectSingleFace(img, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptor();

        if (detection) {
            return detection.descriptor;
        }
        return null;
    } catch (error) {
        console.error("Error getting descriptors from image:", error);
        return null;
    }
};


/**
 * Loads models and pre-computes descriptors for known faces.
 * @param knownFaces An array of KnownFace objects without descriptors.
 * @returns A promise that resolves to an array of KnownFace objects with descriptors.
 */
export const loadModelsAndDescriptors = async (knownFaces: KnownFace[]): Promise<KnownFace[]> => {
    await loadFaceApiModels();
    console.log("Generating descriptors for known faces...");

    const facesWithDescriptors = await Promise.all(
        knownFaces.map(async (face) => {
            // Only fetch descriptors if they don't already exist
            if (!face.descriptors || face.descriptors.length === 0) {
                const descriptors: Float32Array[] = [];
                for (const imageUrl of face.imageUrls) {
                    const descriptor = await extractFaceDescriptor(imageUrl);
                    if (descriptor) {
                        descriptors.push(descriptor);
                    }
                }
                return { ...face, descriptors };
            }
            return face;
        })
    );

    console.log("Descriptors generated.");
    return facesWithDescriptors.filter(face => face.descriptors && face.descriptors.length > 0);
};