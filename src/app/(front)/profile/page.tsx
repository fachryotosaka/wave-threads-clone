import { getServerSession } from "next-auth";
import React, { useEffect, useState } from 'react';
import UserProfileAvatar from "@/components/common/UserProfileAvatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fetchUserAlbums, fetchUserComments, fetchUserPosts } from "@/lib/serverMethods";
import PostCard from "@/components/common/PostCard";
import CommentCard from "@/components/common/CommentCard";
import DyanmicNavBar from "@/components/common/DyanmicNavBar";
import {
  CustomSession,
  authOptions,
} from "@/app/api/auth/[...nextauth]/options";
import UserAlbumDisplay from "@/components/album/UserAlbumDisplay";
import prisma from "@/DB/db.config";
import ExportButton from "@/components/exportExcel";
import EditProfileDialog from "@/components/profile/form";

export default async function Profile() {

  
  const session: CustomSession | null = await getServerSession(authOptions);
  const posts: Array<PostType> | [] = await fetchUserPosts();
  const comments: Array<CommentType> | [] = await fetchUserComments();
  const albums: Array<AlbumType> | [] = await fetchUserAlbums();





  return (
    <div>
      <DyanmicNavBar title="Profile" />
      <div className="flex items-center space-x-4 mt-5">
        <div>
          <UserProfileAvatar
            name={session?.user?.name!}
            image={session?.user?.image!}
          />
        </div>
        <div>
          <h1 className="text-2xl font-bold ">{session?.user?.name}</h1>
          <p className="text-md text-orange-300 ">@{ session?.user?.username + "#" + `${Math.floor(1000 + Math.random() * 9000)}`}</p>
          <h1 className="text-xl">{session?.user?.email}</h1>
        </div>
      </div> <br />
        <div>
        <EditProfileDialog userProfile={session?.user} />
        </div>

      <div className="mt-10 ">
        <Tabs defaultValue="post" className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="post" className="w-full">
              Posts
            </TabsTrigger>
            <TabsTrigger value="comment" className="w-full">
              Comments
            </TabsTrigger>
            <TabsTrigger value="album" className="w-full">
              Album
            </TabsTrigger>
          </TabsList>
          <TabsContent value="post">
            <div className="mt-5">
              {posts &&
                posts.map((item) => <PostCard post={item} isAuthPost={true} />)}
              {posts && posts.length < 1 && (
                <h1 className="text-center mt-5">No Post found</h1>
              )}
            </div>
          </TabsContent>
          <TabsContent value="comment">
            <div className="mt-5">
              {comments &&
                comments.map((item) => (
                  <CommentCard comment={item} isAuthCard={true} />
                ))}

              {comments && comments.length < 1 && (
                <h1 className="text-center mt-5">No Comment found</h1>
              )}
            </div>
          </TabsContent>
          <TabsContent value="album">
						<UserAlbumDisplay albums={albums} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
