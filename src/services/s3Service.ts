import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

// S3 Client using default credentials (IAM role in EC2)
let s3Client = new S3Client({
  region: 'ap-south-1'
});

let bucketName = 'cfiopenhouse2025';


/**
 * Updates the S3 configuration with new values (Optional)
 * @param config New S3 configuration
 */
export const updateS3Config = (config: { region?: string; bucketName?: string }) => {
  if (config.region) {
    s3Client = new S3Client({ region: config.region });
  }
  if (config.bucketName) {
    bucketName = config.bucketName;
  }
};

/**
 * Uploads data to S3 bucket
 * @param data Data to upload
 * @param key Object key (file path in the bucket)
 * @returns Promise that resolves with the upload result
 */
export const uploadToS3 = async (data: any, key: string) => {
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
