import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3"

export async function POST(req) {

    const myS3Client = new S3Client({
        region: 'ap-south-1',
        credentials: {
            accessKeyId: process.env.S3_ACCESS_KEY,
            secretAccessKey: process.env.S3_SECRET_ACCESS_KEY
        }
    })

    const formData = await req.formData()

    for(const fileInfo of formData) {

        const file = fileInfo[1];
        const fileName = Date.now().toString() + file.name;

        const chunks = []
        for await (const chunk of file.stream()){
            chunks.push(chunk);
        }
        const buffer = Buffer.concat(chunks);

        await myS3Client.send(new PutObjectCommand({
            Bucket: 'feedback-board-upload-cwd',
            Key: fileName,
            ACL: 'public-read',
            Body: buffer,
            ContentType: file.type
        }))

        console.log('https://feedback-board-upload-cwd.s3.amazonaws.com/' + fileName)
    }

    return Response.json('ok')
}