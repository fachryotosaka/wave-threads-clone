import Editor from "@components/Editor";
import SelectAlbumButton from "@components/SelectAlbumButton";
import { Button } from "@components/ui";
import { getAuthSession } from "@utils/auth";
import { prisma } from "@utils/prisma";
import { format } from "date-fns";
import { Session } from "next-auth";

const CreatePage = async () => {
  const session = await getAuthSession();
  const user = await prisma.user.findUnique({
    where: {
      email: session!.user.email!,
    },
    include: {
      Follower: true,
      Post: true,
    },
  });

  const albums = await prisma.album.findMany({
    where: {
      user_id: session!.user.id,
    },
    include: {
      photos: true,
    },
  });

  return (
    <div className="sm:container max-w-7xl h-full pt-12">
      <div>
        {/* TODO: BUTTON TO TAKE US BACK */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-x-4 py-6">
          <div className="flex flex-col col-span-2 space-y-6">
            <Form session={session} />
          </div>

          {/* INFO SIDEBAR */}
          <div className="hidden md:block overflow-hidden h-fit rounded-lg border border-gray-200 order-first md:order-last">
            <div className="px-6 py-4">
              <p className="font-semibold py-3">
                Posted by u/{user && user.name}
              </p>
              <SelectAlbumButton albums={albums} />
            </div>

            <dl className="divide-y divide-gray-100 px-6 py-4 text-sm leading-6 bg-white">
              <div className="flex justify-between gap-x-4 py-3">
                <dt className="text-gray-500">Created at</dt>
                <dd className="text-gray-700">
                  {user && format(user.createdAt, "MMMM d, yyyy")}
                </dd>
              </div>

              <div className="flex justify-between gap-x-4 py-3">
                <dt className="text-gray-500">Follower</dt>
                <dd className="text-gray-700">
                  <div className="text-gray-900">
                    {user && user.Follower.length}
                  </div>
                </dd>
              </div>
              <div className="flex justify-between gap-x-4 py-3">
                <dt className="text-gray-500">Post you created</dt>
                <dd className="text-gray-700">
                  <div className="text-gray-900">
                    {user && user.Post.length}
                  </div>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

const Form = async ({ session }: { session: Session | null }) => {
  return session ? (
    <div className="flex flex-col items-start gap-6">
      <div className="border-b border-gray-200 pb-5">
        <div className="-ml-2 -mt-2 flex flex-wrap items-baseline">
          <h3 className="ml-2 mt-2 text-base font-semibold leading-6 text-gray-900">
            Create Post
          </h3>
        </div>
      </div>

      {/* FORM */}
      <Editor userId={session!.user.id!} />
    </div>
  ) : (
    <div>Loading...</div>
  );
};

export default CreatePage;
