import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

// S3 configuration
let s3Config = {
  region: import.meta.env.VITE_AWS_REGION || "ap-south-1",
  credentials: {
    accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
    secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
  },
};

let bucketName = import.meta.env.VITE_AWS_S3_BUCKET;
let s3Client = new S3Client(s3Config);

/**
 * Updates the S3 configuration with new values
 * @param config New S3 configuration
 */
export const updateS3Config = (config: {
  region?: string;
  accessKeyId?: string;
  secretAccessKey?: string;
  bucketName?: string;
}) => {
  if (config.region) s3Config.region = config.region;
  if (config.accessKeyId && config.secretAccessKey) {
    s3Config.credentials = {
      accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
      secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
    };
  }
  if (config.bucketName) bucketName = import.meta.env.VITE_AWS_S3_BUCKET;

  // Reinitialize S3 Client with new credentials
  s3Client = new S3Client(s3Config);
};

/**
 * Uploads data to S3 bucket
 * @param data Data to upload
 * @param key Object key (file path in the bucket)
 * @returns Promise that resolves with the upload result
 */
export const uploadToS3 = async (data: any, key: string) => {
  if (!s3Config.credentials.accessKeyId || !s3Config.credentials.secretAccessKey) {
    throw new Error("🚨 AWS credentials are missing! Check .env file.");
  }

  try {
    const objectKey = `registrations/${key}`;
    const jsonData = JSON.stringify(data, null, 2);

    const uploadParams = {
      Bucket: bucketName,
      Key: objectKey,
      Body: jsonData,
      ContentType: "application/json",
      ACL: "private" as const,
    };

    const result = await s3Client.send(new PutObjectCommand(uploadParams));

    return result;
  } catch (error: any) {
    console.error("❌ AWS Upload Failed:", error);
    console.error("🛠 Error Code:", error.name || "UNKNOWN");
    console.error("🔹 AWS Message:", error.message || "No message provided");

    if (error.$metadata) {
      console.error("📡 AWS Response Metadata:", error.$metadata);
    }

    throw new Error(error.message || "Upload to S3 failed.");
  }
};
