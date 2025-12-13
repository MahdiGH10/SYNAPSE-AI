import { IPost, Post } from "@/models/Post";
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function uploadBufferToCloudinary(buffer: Buffer, filename?: string, folder?: string) {
  return new Promise<any>((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: folder || "posts",
        public_id: filename ? filename.replace(/\.[^/.]+$/, "") : undefined,
        resource_type: "auto",
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    uploadStream.end(buffer);
  });
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const form = await request.formData();

    // read fields correctly from FormData
    const userID = form.get("userID") ? String(form.get("userID")) : undefined;
    const content = form.get("content") ? String(form.get("content")) : undefined;
    const timestampRaw = form.get("timestamp") ? String(form.get("timestamp")) : undefined;

    // handle file (FormData File)
    const fileField = form.get("file") as File | null;

    let fileUrl: string | undefined = undefined;

    if (fileField && typeof fileField.arrayBuffer === "function") {
      // convert to buffer
      const arrayBuffer = await fileField.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // optional: use original filename
      const filename = (fileField as any).name || `upload_${Date.now()}`;

      const uploadResult = await uploadBufferToCloudinary(buffer, filename, "posts");
      fileUrl = uploadResult?.secure_url || uploadResult?.url;
    }

    // create post document
    const newPost = await Post.create({
      userID,
      content,
      file: fileUrl, // store cloudinary URL (or undefined)
    } as Partial<IPost>);

    // Populate user data before returning
    const populatedPost = await Post.findById(newPost._id).populate('userID', 'name email profilePicture');
    
    if (populatedPost) {
      const postObj = populatedPost.toObject();
      const user = postObj.userID as any;
      
      const transformedPost = {
        ...postObj,
        userID: user?._id || postObj.userID,
        userName: user?.name || user?.email || 'Anonymous',
        userImage: user?.profilePicture || '',
      };
      
      return NextResponse.json(
        {
          success: true,
          message: "Post created successfully",
          data: transformedPost,
        },
        { status: 201 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Post created successfully",
        data: newPost,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Post creation error:", error);
    return NextResponse.json({ success: false, message: "Failed to create post", error: (error as Error).message }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const posts = await Post.find().sort({ timestamp: -1 }).populate('userID', 'name email profilePicture');
    
    // Transform posts to include user info in the expected format
    const transformedPosts = posts.map(post => {
      const postObj = post.toObject();
      const user = postObj.userID as any;
      
      return {
        ...postObj,
        userID: user?._id || postObj.userID,
        userName: user?.name || user?.email || 'Anonymous',
        userImage: user?.profilePicture || '',
      };
    });
    
    return NextResponse.json(
      {
        success: true,
        message: "Posts fetched successfully",
        data: transformedPosts,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Posts fetch error:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch posts" }, { status: 500 });
  }
}